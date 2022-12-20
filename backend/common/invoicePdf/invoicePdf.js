const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};

const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fonts);
const fs = require('fs');
const ClinicModel = require('../../modules/clinic/clinic');
const { createCanvas, loadImage } = require('canvas');
const cloudinary = require('cloudinary');
const streamifier = require('streamifier')
const multer = require('multer');
const MedicalPaperModel = require('../../modules/medical_paper/medical_paper');
const CustomerModel = require("../../modules/customer/customer");
const MedicalServiceModel = require('../../modules/medical_service/medical_service');
const ServiceModel = require('../../modules/service/service');
const e = require('express');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

function getImage(url, size) {
    return loadImage(url).then(image => {
        const canvas = createCanvas(size, size);
        let ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        return canvas.toDataURL();
    });
}

function findIndexByProperty(data, key, value) {
    for (var i = 0; i < data.length; i++) {
        if (data[i][key] === value) {
            return i;
        }
    }
    return -1;
}

function buildTable(data, data2) {
    let body = [];
    body.push([
        {
            text: 'TT',
            fillColor: '#eaf2f5',
            border: [false, true, false, true],
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase',
        },
        {
            text: 'Nội dung dịch vụ',
            border: [false, true, false, true],
            alignment: 'center',
            fillColor: '#eaf2f5',
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase',
        },
        {
            text: 'SL',
            border: [false, true, false, true],
            alignment: 'center',
            fillColor: '#eaf2f5',
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase',
        },
        {
            text: 'Đơn giá',
            border: [false, true, false, true],
            alignment: 'center',
            fillColor: '#eaf2f5',
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase',
        },
        {
            text: 'Thành tiền',
            border: [false, true, false, true],
            alignment: 'center',
            fillColor: '#eaf2f5',
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase',
        },
    ])
    let temp = 1;
    data.forEach(element => {
        body.push([
            {
                text: temp,
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
                alignment: 'left',
            },
            {
                border: [false, false, false, true],
                text: element.name,
                bold: true,
                alignment: 'left',
                margin: [0, 5, 0, 5],
            },
            {
                text: element.quantity,
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
                alignment: 'center',
            },
            {
                text: element.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}),
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
                alignment: 'center',
            },
            {
                text: (element.price * element.quantity).toLocaleString('it-IT', {style : 'currency', currency : 'VND'}),
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
                alignment: 'right',
            },
        ])
        temp++;
    });
    body.push([
        {
            text: '',
            border: [false, false, false, true],
            margin: [0, 5, 0, 5],
            alignment: 'left',
        },
        {
            text: '',
            border: [false, false, false, true],
            margin: [0, 5, 0, 5],
            alignment: 'left',
        },
        {
            text: '',
            border: [false, false, false, true],
            margin: [0, 5, 0, 5],
            alignment: 'left',
        },
        {
            text: 'Tổng cộng',
            fontSize: 15,
            bold: true,
            border: [false, false, false, true],
            margin: [0, 5, 0, 5],
            alignment: 'right',
        },
        {
            text: Number(data2.totalAmount).toLocaleString('it-IT', {style : 'currency', currency : 'VND'}),
            fontSize: 15,
            bold: true,
            border: [false, false, false, true],
            fillColor: '#f5f5f5',
            alignment: 'right',
            margin: [0, 5, 0, 5],
        },
    ])
    return body;
}

const exportPdf = async (req, res) => {
    const clinic = await ClinicModel.find();
    const data = await getImage(clinic[0].icon, 400);
    const { medicalPaperId } = req.query;

    const today = new Date();
    const medicalPaper = await MedicalPaperModel.findOne({ _id: medicalPaperId });
    const customer = await CustomerModel.findOne({ _id: medicalPaper.customerId });
    const medicalService = await MedicalServiceModel.find({ medicalPaperId: medicalPaperId });
    let medicalServiceArray = [];
    await Promise.all(medicalService.map(async (element) => {
        const service = await ServiceModel.findById(element.serviceId);
        if (medicalServiceArray.length < 1) {
            medicalServiceArray.push({
                id: service._id,
                name: service.name,
                quantity: 1,
                price: Number(service.price),
            })
            return;
        }
        const index = findIndexByProperty(medicalServiceArray, "id", element.serviceId);
        if (index < 0) {
            medicalServiceArray.push({
                id: service._id,
                name: service.name,
                quantity: 1,
                price: Number(service.price),
            })
        } else {
            const tempCount = Number(medicalServiceArray[index].quantity);
            medicalServiceArray[index] = { ...medicalServiceArray[index], quantity: tempCount + 1 };
        }
    }));

    const debt = (Number(medicalPaper.totalAmount) - Number(medicalPaper.customerPayment) > 0) ? (Number(medicalPaper.totalAmount) - Number(medicalPaper.customerPayment)) : 0;

    var docDefinition = {
        content: [
            {
                columns: [
                    {
                        image: 'data:image/png,' + data,
                        width: 150,
                    },
                    [
                        {
                            text: clinic[0].name,
                            color: '#333333',
                            width: '*',
                            fontSize: 28,
                            bold: true,
                            alignment: 'right',
                            margin: [0, 0, 0, 15],
                        },
                        {
                            stack: [
                                {
                                    columns: [
                                        {
                                            text: 'Địa chỉ',
                                            color: '#aaaaab',
                                            bold: true,
                                            width: '*',
                                            fontSize: 12,
                                            alignment: 'right',
                                        },
                                        {
                                            text: clinic[0].address,
                                            bold: true,
                                            color: '#333333',
                                            fontSize: 12,
                                            alignment: 'left',
                                            width: 220,
                                        },
                                    ],
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Điện thoại',
                                            color: '#aaaaab',
                                            bold: true,
                                            width: '*',
                                            fontSize: 12,
                                            alignment: 'right',
                                        },
                                        {
                                            text: clinic[0].phone,
                                            bold: true,
                                            color: '#333333',
                                            fontSize: 12,
                                            alignment: 'left',
                                            width: 220,
                                        },
                                    ],
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Email',
                                            color: '#aaaaab',
                                            bold: true,
                                            fontSize: 12,
                                            alignment: 'right',
                                            width: '*',
                                        },
                                        {
                                            text: clinic[0].email,
                                            bold: true,
                                            fontSize: 12,
                                            alignment: 'left',
                                            color: '#333333',
                                            width: 220,
                                        },
                                    ],
                                },
                                {
                                    columns: [
                                        {
                                            text: 'Số tài khoản',
                                            color: '#aaaaab',
                                            bold: true,
                                            fontSize: 12,
                                            alignment: 'right',
                                            width: '*',
                                        },
                                        {
                                            text: clinic[0].accountNumber,
                                            bold: true,
                                            fontSize: 12,
                                            alignment: 'left',
                                            color: '#333333',
                                            width: 220,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                ],
            },
            {
                width: '100%',
                alignment: 'center',
                text: 'Phiếu Thu',
                bold: true,
                margin: [0, 10, 0, 10],
                fontSize: 20,
            },
            {
                columns: [
                    {
                        text: 'Số: ',
                        bold: true,
                        color: '#333333',
                        fontSize: 12,
                        alignment: 'right',
                    },
                    {
                        text: medicalPaperId,
                        bold: true,
                        fontSize: 12,
                        alignment: 'left',
                        color: '#333333',
                        width: 100,
                    },
                ],
            }, '\n\n',
            {
                columns: [
                    {
                        text: 'Tên khách hàng:',
                        color: '#aaaaab',
                        bold: true,
                        fontSize: 13,
                        alignment: 'left',
                        width: 140,
                        margin: [0, 0, 0, 10]
                    },
                    {
                        text: customer.fullname,
                        color: '#333333',
                        bold: true,
                        fontSize: 13,
                        alignment: 'left',
                        margin: [0, 0, 0, 10]
                    },
                ],
            },
            {
                columns: [
                    {
                        text: 'Địa chỉ:',
                        color: '#aaaaab',
                        fontSize: 13,
                        bold: true,
                        alignment: 'left',
                        width: 140,
                        margin: [0, 0, 0, 10]
                    },
                    {
                        text: customer.address,
                        color: '#333333',
                        bold: true,
                        fontSize: 13,
                        alignment: 'left',
                        margin: [0, 0, 0, 10]
                    },
                ],
            },
            {
                columns: [
                    {
                        text: 'Số điện thoại:',
                        color: '#aaaaab',
                        fontSize: 13,
                        bold: true,
                        alignment: 'left',
                        width: 140,
                        margin: [0, 0, 0, 10]
                    },
                    {
                        text: customer.phone,
                        color: '#333333',
                        bold: true,
                        fontSize: 13,
                        alignment: 'left',
                        margin: [0, 0, 0, 10]
                    },
                ],
            },
            '\n\n',
            {
                layout: {
                    defaultBorder: false,
                    hLineWidth: function (i, node) {
                        return 1;
                    },
                    vLineWidth: function (i, node) {
                        return 1;
                    },
                    hLineColor: function (i, node) {
                        if (i === 1 || i === 0) {
                            return '#bfdde8';
                        }
                        return '#eaeaea';
                    },
                    vLineColor: function (i, node) {
                        return '#eaeaea';
                    },
                    hLineStyle: function (i, node) {
                        // if (i === 0 || i === node.table.body.length) {
                        return null;
                        //}
                    },
                    // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                    paddingLeft: function (i, node) {
                        return 10;
                    },
                    paddingRight: function (i, node) {
                        return 10;
                    },
                    paddingTop: function (i, node) {
                        return 2;
                    },
                    paddingBottom: function (i, node) {
                        return 2;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                        return '#fff';
                    },
                },
                table: {
                    headerRows: 1,
                    widths: [30, '*', 30, '*', 90],
                    body: buildTable(medicalServiceArray, medicalPaper),
                },
            },
            '\n',
            '\n\n',
            {
                layout: {
                    defaultBorder: false,
                    hLineWidth: function (i, node) {
                        return 1;
                    },
                    vLineWidth: function (i, node) {
                        return 1;
                    },
                    hLineColor: function (i, node) {
                        return '#eaeaea';
                    },
                    vLineColor: function (i, node) {
                        return '#eaeaea';
                    },
                    hLineStyle: function (i, node) {
                        // if (i === 0 || i === node.table.body.length) {
                        return null;
                        //}
                    },
                    // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                    paddingLeft: function (i, node) {
                        return 10;
                    },
                    paddingRight: function (i, node) {
                        return 10;
                    },
                    paddingTop: function (i, node) {
                        return 3;
                    },
                    paddingBottom: function (i, node) {
                        return 3;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                        return '#fff';
                    },
                },
                table: {
                    headerRows: 1,
                    widths: ['*', 90],
                    body: [
                        [
                            {
                                text: 'Đã thanh toán',
                                border: [false, true, false, true],
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                            {
                                border: [false, true, false, true],
                                text: Number(medicalPaper.customerPayment).toLocaleString('it-IT', {style : 'currency', currency : 'VND'}),
                                alignment: 'right',
                                fillColor: '#f5f5f5',
                                margin: [0, 5, 0, 5],
                            },
                        ],
                        [
                            {
                                text: 'Còn nợ',
                                border: [false, false, false, true],
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                            {
                                text: debt.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}),
                                border: [false, false, false, true],
                                fillColor: '#f5f5f5',
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                        ],
                    ],
                },
            },
            '\n\n',
            {
                text: `Hà Nội, ngày ${today.getDate()} tháng ${today.getMonth()+1} năm ${today.getFullYear()}`,
                style: 'notesText',
                alignment: 'right',
                width: '*',
            },
            '\n\n',
            {
                columns: [
                    {
                        text: 'Người thanh toán',
                        style: 'notesTitle',
                        fontSize: 13,
                        bold: true,
                        alignment: 'center',
                        width: '50%',
                        margin: [0, 0, 0, 10]
                    },
                    {
                        text: 'Nhân viên thu ngân',
                        style: 'notesTitle',
                        bold: true,
                        fontSize: 13,
                        alignment: 'center',
                        margin: [0, 0, 0, 10]
                    },
                ],
            },
            {
                columns: [
                    {
                        text: '(Kí và ghi rõ họ tên)',
                        style: 'notesText',
                        fontSize: 12,
                        alignment: 'center',
                        width: '50%',
                        margin: [0, 0, 0, 10]
                    },
                    {
                        text: '(Kí và ghi rõ họ tên)',
                        style: 'notesText',
                        fontSize: 12,
                        alignment: 'center',
                        margin: [0, 0, 0, 10]
                    },
                ],
            },
        ],
        styles: {
            notesTitle: {
                fontSize: 10,
                bold: true,
                margin: [0, 50, 0, 3],
            },
            notesText: {
                fontSize: 10,
            },
        },
        defaultStyle: {
            columnGap: 20,
        },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const src = fs.createReadStream('pdfs/document.pdf');
    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=invoice.pdf',
        'Content-Transfer-Encoding': 'Binary'
    });

    pdfDoc.pipe(res);
    pdfDoc.end();
}

const uploadToCloud = async (req, res) => {
    const { file } = req.body;
    console.log(file)
    const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    const result = await streamUpload(req);
    res.send({ success: 1, data: result.secure_url })
}

module.exports = {
    exportPdf,
    uploadToCloud
}