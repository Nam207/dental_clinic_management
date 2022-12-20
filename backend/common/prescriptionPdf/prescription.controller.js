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
const MedicinePrescribeModel = require('../../modules/medicine_prescribe/medicine_prescribe');
const MedicineModel = require("../../modules/medicine/medicine");
const CustomerModel = require("../../modules/customer/customer");
const MedicalPaperModel = require("../../modules/medical_paper/medical_paper");

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

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
}

function buildTable(data) {
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
            text: 'Tên thuốc',
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
            text: 'Lượng \n (viên/vỉ-ml,mg/lọ)',
            border: [false, true, false, true],
            alignment: 'center',
            fillColor: '#eaf2f5',
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase',
        },
        {
            text: 'Cách dùng',
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
                alignment: 'left',
            },
            {
                text: element.unit,
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
                alignment: 'left',
            },
            {
                text: element.usage,
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
                alignment: 'left',
            },
        ])

        temp++;
    });
    return body;
}

const exportPdf = async (req, res) => {
    const { medicalPaperId } = req.query;
    const clinic = await ClinicModel.find();
    const data = await getImage(clinic[0].icon, 400);
    const medicinePrescribe = await MedicinePrescribeModel.find({ medicalPaperId: medicalPaperId });
    let medicine = [];
    await Promise.all(
        medicinePrescribe.map(async (element) => {
            const temp = await MedicineModel.findById(element.medicineId);
            medicine.push({
                ...element._doc,
                name: temp.name,
                unit: temp.quantity,
            });
        })
    );
    const today = new Date();
    const medicalPaper = await MedicalPaperModel.findOne({ _id: medicalPaperId });
    const customer = await CustomerModel.findOne({ _id: medicalPaper.customerId });
    let reExamination = '';
    if(medicalPaper.reExamination && medicalPaper.reExamination !== 'null' && medicalPaper.reExamination !== null){
        reExamination = formatDate(medicalPaper.reExamination);
    }

    let dateOfBirth = "";
    if(customer.dateOfBirth && medicalPaper.dateOfBirth !== 'null' && medicalPaper.dateOfBirth !== null){
        dateOfBirth = formatDate(customer.dateOfBirth);
    }
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
                text: 'Đơn thuốc',
                bold: true,
                margin: [0, 10, 0, 10],
                fontSize: 20,
            },
            {
                columns: [
                    {
                        text: 'Số phiếu khám: ',
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
                        text: 'Ngày sinh:',
                        color: '#aaaaab',
                        fontSize: 13,
                        bold: true,
                        alignment: 'left',
                        width: 140,
                        margin: [0, 0, 0, 10]
                    },
                    {
                        text: dateOfBirth,
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
                    widths: [30, '*', 30, 70, 200],
                    body: buildTable(medicine)
                },
            },
            '\n\n',
            {
                text: 'Cộng khoản: ' + medicine.length,
                fontSize: 13,
                style: 'notesText',
                alignment: 'left'
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
                        text: 'Tái khám ngày: ' + reExamination,
                        style: 'notesTitle',
                        fontSize: 13,
                        bold: true,
                        alignment: 'left',
                        width: '50%',
                        margin: [0, 0, 0, 10]
                    },
                    {
                        text: 'Bác sĩ điều trị',
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
                        text: 'Lời dặn',
                        style: 'notesText',
                        fontSize: 13,
                        alignment: 'left',
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