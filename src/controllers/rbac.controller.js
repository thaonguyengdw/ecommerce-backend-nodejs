'use strict';

const { SuccessResponse } = require('../core/success.response')
const { createResource, createRole, roleList, resourceList } = require('../services/rbac.service')

/**
 * @desc Create a new role
 * @param {string} name
 * @param {*} res
 * @param {*} next
 */

const newRole = async ( req, res, next ) => {
    new SuccessResponse({
        message: 'create role',
        metadata: await createRole(req.body)
    }).send(res);
}

const newResource = async ( req, res, next ) => {
    new SuccessResponse({
        message: 'create resource',
        metadata: await createResource(req.body)
    }).send(res);
}

const listRole = async ( req, res, next ) => {
    new SuccessResponse({
        message: 'get role list',
        metadata: await roleList(req.query)
    }).send(res);
}

const listResource = async ( req, res, next ) => {
    new SuccessResponse({
        message: 'get resource list',
        metadata: await resourceList(req.query)
    }).send(res);
}

module.exports = {
    newRole,
    newResource,
    listRole,
    listResource
}