const BillModel = require('../../modules/bill/bill');
const MedicalPaperModel = require('../../modules/medical_paper/medical_paper');
const CustomerModel = require("../../modules/customer/customer");
const MedicalServiceModel = require('../../modules/medical_service/medical_service');
const ServiceModel = require('../../modules/service/service');
const e = require('express');
const ProfileModel = require('../../modules/profile/profile');

function findIndexByProperty(data, key, value) {
    for (var i = 0; i < data.length; i++) {
        if (data[i][key] === value) {
            return i;
        }
    }
    return -1;
}

const findRange = (from, to, key) => {
    let array = [];
    for (let i = from; i <= to; i++) {
        var temp = "";
        for (let l = 0; l < 10 - i.toString().length; l++) {
            temp += "0";
        }
        temp += i;
        array.push(key + "_" + temp);
    }
    return array;
}

const getArrayCustomer = (startCustomer, endCustomer) => {
    let arrayCustomer = [];
    if (
        startCustomer &&
        endCustomer &&
        startCustomer !== "undefined" &&
        endCustomer !== "undefined"
    ) {
        const idNumberStartCustomer = parseInt(startCustomer.split("_")[1]) + "";
        const idNumberEndCustomer = parseInt(endCustomer.split("_")[1]) + "";
        if (idNumberStartCustomer > idNumberEndCustomer)
            arrayCustomer = findRange(
                idNumberEndCustomer,
                idNumberStartCustomer,
                "KH"
            );
        else
            arrayCustomer = findRange(
                idNumberStartCustomer,
                idNumberEndCustomer,
                "KH"
            );
    }
    return arrayCustomer;
}

const getArrayEmployee = (startEmployee, endEmployee) => {
    let arrayEmployee = [];
    if (
        startEmployee &&
        endEmployee &&
        startEmployee !== "undefined" &&
        endEmployee !== "undefined"
    ) {
        const idNumberStartCustomer = parseInt(startEmployee.split("_")[1]) + "";
        const idNumberEndCustomer = parseInt(endEmployee.split("_")[1]) + "";
        if (idNumberStartCustomer > idNumberEndCustomer)
            arrayEmployee = findRange(
                idNumberEndCustomer,
                idNumberStartCustomer,
                "NV"
            );
        else
            arrayEmployee = findRange(
                idNumberStartCustomer,
                idNumberEndCustomer,
                "NV"
            );
    }
    return arrayEmployee;
}

const getArrayService = (startService, endService) => {
    let arrayService = [];
    if (
        startService &&
        endService &&
        startService !== "undefined" &&
        endService !== "undefined"
    ) {
        const idNumberStartCustomer = parseInt(startService.split("_")[1]) + "";
        const idNumberEndCustomer = parseInt(endService.split("_")[1]) + "";
        if (idNumberStartCustomer > idNumberEndCustomer)
            arrayService = findRange(
                idNumberEndCustomer,
                idNumberStartCustomer,
                "DV"
            );
        else
            arrayService = findRange(
                idNumberStartCustomer,
                idNumberEndCustomer,
                "DV"
            );
    }
    return arrayService;
}

const statisticalForCustomer = async (req, res) => {
    const {
        startCustomer,
        endCustomer,
        startEmployee,
        endEmployee,
        startService,
        endService,
        startDate,
        endDate,
    } = req.body;

    let arrayCustomer = getArrayCustomer(startCustomer, endCustomer);

    let arrayEmployee = getArrayEmployee(startEmployee, endEmployee);

    let arrayService = getArrayService(startService, endService);

    let filter = {};
    if (arrayCustomer.length > 0) filter.customerId = { $in: arrayCustomer };
    if (arrayEmployee.length > 0) filter.createBy = { $in: arrayEmployee };
    if (
        startDate ||
        endDate ||
        startDate !== "undefined" ||
        endDate !== "undefined"
    ) {
        const fromDate = new Date(startDate);
        fromDate.setHours(0);
        fromDate.setMinutes(0);

        const toDate = new Date(endDate);
        toDate.setHours(24);
        toDate.setMinutes(60);
        filter.createdAt = { $gte: fromDate, $lt: toDate };
    }

    let filterService = {};
    if (arrayService.length > 0) filterService.serviceId = { $in: arrayService };
    const staticstical = await MedicalPaperModel.aggregate([
        {
            $lookup: {
                from: "medicalservices",
                localField: "_id",
                foreignField: "medicalPaperId",
                pipeline: [{ $match: filterService }],
                as: "service",
            },
        },
        {
            $match: filter,
        },
        {
            $group: {
                _id: { customerId: "$customerId" },
                totalAmount: { $sum: "$totalAmount" },
                customerPayment: { $sum: "$customerPayment" },
                count: { $sum: 1 },
            },
        },
    ]);

    let staticsticalTemp = [];
    await Promise.all(
        staticstical.map(async (element) => {
            const customerTemp = await CustomerModel.findById(element._id.customerId);
            staticsticalTemp.push({
                ...element,
                customerName: customerTemp.fullname,
            });
        })
    );

    res.send({ success: 1, data: staticsticalTemp });
};

const statisticalForService = async (req, res) => {
    const {
        startCustomer,
        endCustomer,
        startEmployee,
        endEmployee,
        startService,
        endService,
        startDate,
        endDate,
    } = req.body;

    let arrayCustomer = getArrayCustomer(startCustomer, endCustomer);

    let arrayEmployee = getArrayEmployee(startEmployee, endEmployee);

    let arrayService = getArrayService(startService, endService);

    let filter = {};
    if (arrayCustomer.length > 0) filter.customerId = { $in: arrayCustomer };
    if (arrayEmployee.length > 0) filter.createBy = { $in: arrayEmployee };
    if (
        startDate ||
        endDate ||
        startDate !== "undefined" ||
        endDate !== "undefined"
    ) {
        const fromDate = new Date(startDate);
        fromDate.setHours(0);
        fromDate.setMinutes(0);

        const toDate = new Date(endDate);
        toDate.setHours(24);
        toDate.setMinutes(60);
        filter.createdAt = { $gte: fromDate, $lt: toDate };
    }

    let filterService = {};
    if (arrayService.length > 0) filterService.serviceId = { $in: arrayService };
    const staticstical = await MedicalServiceModel.aggregate([
        {
            $lookup: {
                from: "medicalpapers",
                localField: "medicalPaperId",
                foreignField: "_id",
                pipeline: [{ $match: filter }],
                as: "medicalPaper",
            },
        },
        {
            $match: filterService,
        },
        {
            $group: {
                _id: { serviceId: "$serviceId" },
                count: { $sum: 1 },
            },
        },
    ]);

    let staticsticalTemp = [];
    await Promise.all(
        staticstical.map(async (element) => {
            const serviceTemp = await ServiceModel.findById(element._id.serviceId);
            staticsticalTemp.push({
                ...element,
                serviceName: serviceTemp.name,
                price: serviceTemp.price,
            });
        })
    );

    res.send({ success: 1, data: staticsticalTemp });
}

const statisticalForEmployee = async (req, res) => {
    const {
        startCustomer,
        endCustomer,
        startEmployee,
        endEmployee,
        startService,
        endService,
        startDate,
        endDate,
    } = req.body;

    let arrayCustomer = getArrayCustomer(startCustomer, endCustomer);

    let arrayEmployee = getArrayEmployee(startEmployee, endEmployee);

    let arrayService = getArrayService(startService, endService);

    let filter = {};
    if (arrayCustomer.length > 0) filter.customerId = { $in: arrayCustomer };
    if (arrayEmployee.length > 0) filter.createBy = { $in: arrayEmployee };
    if (
        startDate ||
        endDate ||
        startDate !== "undefined" ||
        endDate !== "undefined"
    ) {
        const fromDate = new Date(startDate);
        fromDate.setHours(0);
        fromDate.setMinutes(0);

        const toDate = new Date(endDate);
        toDate.setHours(24);
        toDate.setMinutes(60);
        filter.createdAt = { $gte: fromDate, $lt: toDate };
    }

    let filterService = {};
    if (arrayService.length > 0) filterService.serviceId = { $in: arrayService };
    const staticstical = await MedicalPaperModel.aggregate([
        {
            $lookup: {
                from: "medicalservices",
                localField: "_id",
                foreignField: "medicalPaperId",
                pipeline: [{ $match: filterService }],
                as: "service",
            },
        },
        {
            $match: filter,
        },
        {
            $group: {
                _id: { createBy: "$createBy" },
                totalAmount: { $sum: "$totalAmount" },
                customerPayment: { $sum: "$customerPayment" },
                count: { $sum: 1 },
            },
        },
    ]);

    let staticsticalTemp = [];
    await Promise.all(
        staticstical.map(async (element) => {
            const profileTemp = await ProfileModel.findById(element._id.customerId);
            staticsticalTemp.push({
                ...element,
                employeeName: profileTemp.fullname,
            });
        })
    );
    res.send({ success: 1, data: staticsticalTemp });
}

const statisticalForPayment = async (req, res) => {
    const {
        startCustomer,
        endCustomer,
        startEmployee,
        endEmployee,
        startService,
        endService,
        startDate,
        endDate,
    } = req.body;

    let arrayCustomer = getArrayCustomer(startCustomer, endCustomer);

    let arrayEmployee = getArrayEmployee(startEmployee, endEmployee);

    let arrayService = getArrayService(startService, endService);

    let filter = {};
    if (arrayCustomer.length > 0) filter.customerId = { $in: arrayCustomer };
    if (arrayEmployee.length > 0) filter.createBy = { $in: arrayEmployee };
    if (
        startDate ||
        endDate ||
        startDate !== "undefined" ||
        endDate !== "undefined"
    ) {
        const fromDate = new Date(startDate);
        fromDate.setHours(0);
        fromDate.setMinutes(0);

        const toDate = new Date(endDate);
        toDate.setHours(24);
        toDate.setMinutes(60);
        filter.createdAt = { $gte: fromDate, $lt: toDate };
    }

    let filterService = {};
    if (arrayService.length > 0) filterService.serviceId = { $in: arrayService };
    const staticstical = await MedicalPaperModel.aggregate([
        {
            $lookup: {
                from: "medicalservices",
                localField: "_id",
                foreignField: "medicalPaperId",
                pipeline: [{ $match: filterService }],
                as: "service",
            },
        },
        {
            $match: filter,
        },
    ]);

    let billTemp = [];
    await Promise.all(
        staticstical.map(async (element) => {
            const bill = await BillModel.find({ medicalPaperId: element._id }).populate({ path: 'paymentId', select: 'name' });
            billTemp.push({
                ...element,
            });
        })
    );

    let staticsticalTemp = [];
    await Promise.all(
        billTemp.map(async (element) => {
            if (staticsticalTemp.length < 1) {
                staticsticalTemp.push({ _id: element.paymentId._id, payment: element.paymentId.name, amount: element.amount, count: 1 });
            }
            const index = findIndexByProperty(staticsticalTemp, "_id", element.paymentId._id);
            if (index < 0) {
                staticsticalTemp.push({ _id: element.paymentId._id, payment: element.paymentId.name, amount: element.amount, count: 1 });
            } else {
                staticsticalTemp[index] = { ...staticsticalTemp[index], amount: element.amount + staticsticalTemp[index].amount, count: staticsticalTemp[index].count + 1 };
            }
        })
    )
    res.send({ success: 1, data: staticsticalTemp });
}

const statisticalForDate = async (req, res) => {
    const {
        startCustomer,
        endCustomer,
        startEmployee,
        endEmployee,
        startService,
        endService,
        startDate,
        endDate,
    } = req.body;

    let arrayCustomer = getArrayCustomer(startCustomer, endCustomer);

    let arrayEmployee = getArrayEmployee(startEmployee, endEmployee);

    let arrayService = getArrayService(startService, endService);

    let filter = {};
    if (arrayCustomer.length > 0) filter.customerId = { $in: arrayCustomer };
    if (arrayEmployee.length > 0) filter.createBy = { $in: arrayEmployee };
    if (
        startDate ||
        endDate ||
        startDate !== "undefined" ||
        endDate !== "undefined"
    ) {
        const fromDate = new Date(startDate);
        fromDate.setHours(0);
        fromDate.setMinutes(0);

        const toDate = new Date(endDate);
        toDate.setHours(24);
        toDate.setMinutes(60);
        filter.createdAt = { $gte: fromDate, $lt: toDate };
    }

    let filterService = {};
    if (arrayService.length > 0) filterService.serviceId = { $in: arrayService };
    const staticstical = await MedicalPaperModel.aggregate([
        {
            $lookup: {
                from: "medicalservices",
                localField: "_id",
                foreignField: "medicalPaperId",
                pipeline: [{ $match: filterService }],
                as: "service",
            },
        },
        {
            $match: filter,
        },
        {
            $group: {
                _id: { createdAt: "$createdAt" },
                totalAmount: { $sum: "$totalAmount" },
                customerPayment: { $sum: "$customerPayment" },
                count: { $sum: 1 },
            },
        },
    ]);

    res.send({ success: 1, data: staticstical });
}

module.exports = {
    statisticalForCustomer,
    statisticalForService,
    statisticalForEmployee,
    statisticalForPayment,
    statisticalForDate,
}