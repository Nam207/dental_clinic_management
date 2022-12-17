const express = require('express');
const router = express.Router();
const permissionController = require('./permission.controller');

router.get('/', permissionController.getPermission);

router.get('/:roleId/:functionId', permissionController.getPermissionByRoleAndFunction);

router.put('/', permissionController.updatePermission);

module.exports = router;