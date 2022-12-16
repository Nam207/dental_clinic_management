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
const fileUploader = require("../../middlewares/cloudinary.config");
const cloudinary = require('cloudinary');
const streamifier = require('streamifier')
const multer = require('multer');
const {LocalFileData} = require('get-file-object-from-local-path');

const memoryStorage = multer.memoryStorage()
const uploadWithMemoryStorage = multer({ storage: memoryStorage })

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

const exportPdf = async (req, res) => {
    const clinic = await ClinicModel.find();
    const data = await getImage(clinic[0].icon, 400);
    //var image = Buffer.alloc(clinic[0].icon, 'base64')
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
                                            alignment: 'right',
                                            width: 170,
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
                                            alignment: 'right',
                                            width: 170,
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
                                            alignment: 'right',
                                            color: '#333333',
                                            width: 170,
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
                                            alignment: 'right',
                                            color: '#333333',
                                            width: 170,
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
                        text: "0001",
                        bold: true,
                        fontSize: 12,
                        alignment: 'right',
                        color: '#333333',
                        width: 70,
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
                        text: '',
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
                        text: 'aaaa',
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
                        text: '00000',
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
                    widths: [30, '*', 30, '*', '*'],
                    body: [
                        [
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
                                alignment: 'right',
                                fillColor: '#eaf2f5',
                                margin: [0, 5, 0, 5],
                                textTransform: 'uppercase',
                            },
                            {
                                text: 'SL',
                                border: [false, true, false, true],
                                alignment: 'right',
                                fillColor: '#eaf2f5',
                                margin: [0, 5, 0, 5],
                                textTransform: 'uppercase',
                            },
                            {
                                text: 'Đơn giá',
                                border: [false, true, false, true],
                                alignment: 'right',
                                fillColor: '#eaf2f5',
                                margin: [0, 5, 0, 5],
                                textTransform: 'uppercase',
                            },
                            {
                                text: 'Thành tiền',
                                border: [false, true, false, true],
                                alignment: 'right',
                                fillColor: '#eaf2f5',
                                margin: [0, 5, 0, 5],
                                textTransform: 'uppercase',
                            },
                        ],
                        [
                            {
                                text: 'Item 1',
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                            {
                                border: [false, false, false, true],
                                text: '$999.99',
                                fillColor: '#f5f5f5',
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                            {
                                text: 'Item 1',
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                            {
                                text: 'Item 1',
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                            {
                                text: 'Item 1',
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                        ],
                        [
                            {
                                text: 'Item 2',
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                            {
                                text: 'Item 2',
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                            {
                                text: 'Item 2',
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                            {
                                text: 'Item 2',
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                            {
                                text: '$999.99',
                                border: [false, false, false, true],
                                fillColor: '#f5f5f5',
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                        ],
                    ],
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
                    widths: ['*', 'auto'],
                    body: [
                        [
                            {
                                text: 'Payment Subtotal',
                                border: [false, true, false, true],
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                            {
                                border: [false, true, false, true],
                                text: '$999.99',
                                alignment: 'right',
                                fillColor: '#f5f5f5',
                                margin: [0, 5, 0, 5],
                            },
                        ],
                        [
                            {
                                text: 'Payment Processing Fee',
                                border: [false, false, false, true],
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                            {
                                text: '$999.99',
                                border: [false, false, false, true],
                                fillColor: '#f5f5f5',
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                        ],
                        [
                            {
                                text: 'Total Amount',
                                bold: true,
                                fontSize: 20,
                                alignment: 'right',
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                            },
                            {
                                text: 'USD $999.99',
                                bold: true,
                                fontSize: 20,
                                alignment: 'right',
                                border: [false, false, false, true],
                                fillColor: '#f5f5f5',
                                margin: [0, 5, 0, 5],
                            },
                        ],
                    ],
                },
            },
            '\n\n',
            {
                text: 'NOTES',
                style: 'notesTitle',
            },
            {
                text: 'Some notes goes here \n Notes second line',
                style: 'notesText',
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
    const {file} = req.body;
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
    res.send({ success: 1, data:result.secure_url })
  }

module.exports = {
    exportPdf,
    uploadToCloud
}