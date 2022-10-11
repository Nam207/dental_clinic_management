require('dotenv').config();
require('express-async-errors');

const express = require('express');
const mongoose = require('mongoose');
const medicineRouter = require('./modules/medicine/medicine.router');
const roleController = require('./modules/role/role.controller');
const roleRouter = require('./modules/role/role.router');
const authRouter = require('./modules/auth/auth.router');
const serviceRouter = require('./modules/service/service.router');
const functionController = require('./modules/function/function.controller');


mongoose.connect(process.env.MONGODB_URL, err => {
    if (err) {
        return console.log('Err connnect mongodb', err);
    }
    console.log('Connect DB successfully')
    try {
        roleController.createRole();
        functionController.createFunction();
    } catch (err) {
        return console.log('Err insert role', err);
    }
})

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    console.log('time', Date.now(), req.method, req.originalUrl);
    next();
})

app.use('/api/auth', authRouter);
app.use('/api/medicine', medicineRouter);
app.use('/api/role', roleRouter);
app.use('/api/service', serviceRouter);

app.use('*', (req, res, next) => {
    res.status(404).send({ message: '404 not found' })
})

app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500).send({ success: 0, message: err.message });
})


app.listen(process.env.PORT || 8080, (err) => {
    if (err) {
        return console.log('Server Error', err);
    }
    console.log('Server started');
})