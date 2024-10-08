'use strict'

const express = require('express')
const NotificationController = require('../../controllers/notification.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

//authentication //
router.use(authenticationV2)
///////////////////
router.get('', asyncHandler(NotificationController.listNotiByUser))

//Query

module.exports = router