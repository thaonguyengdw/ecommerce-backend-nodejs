'use strict'

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const { findById } = require('../services/apikey.service')
const apiKey = async (req, res, next) => {
    try{
        const key = req.headers[HEADER.API_KEY]?.toString()
        //Neu key khong ton tai thong bao cho client biet
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error'                
            })
        }

        //check objKey
        const objKey = await findById(key)
        if(!objKey){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey
        return next()
    }catch (error){

    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: 'Permission denied error'
            })
        }

        console.log('permission::', req.objKey.permissions)
        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                message: 'Permission denied error'
            })
        }

        return next()
    }
}

module.exports = {
    apiKey,
    permission
}