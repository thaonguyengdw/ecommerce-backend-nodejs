'use strict'

const express = require('express')
const rbacController = require('../../controllers/rbac.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')

router.post('/role', asyncHandler(rbacController.newRole))
router.get('/roles', asyncHandler(rbacController.listRole))

router.post('/resource', asyncHandler(rbacController.newResource))
router.get('/resources', asyncHandler(rbacController.listResource))

module.exports = router
