'use strict';

const { AuthFailureError } = require('../core/error.response');
const rbac =  require('./role.middleware');   
const { roleList } = require('../services/rbac.service');
/**
 * 
 * @param {String} action //read, delete or update
 * @param {*} resource // profile, balancer...
 */
const grantAccess = (action, resource) => {

    return async (req, res, next) => {
        try {
            rbac.setGrants( await roleList({
                userId: 999
            }))
            const rol_name = req.query.role;
            const permission = rbac.can(rol_name)[action](resource);
            if(!permission.granted){
                throw new AuthFailureError('You dont have permissions...');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = { grantAccess };