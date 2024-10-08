'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error'
}

const myLogger = require('../loggers/myLogger.log.js'); 
const {StatusCodes, ReasonPhrases} = require('../utils/httpStatusCode')

class ErrorResponse extends Error {

    constructor(message, status) {
        super(message)
        this.status = status,
        this.now = Date.now()
        
/*         myLogger.error(this.message, {
            context: '/path',
            requestId: 'UUUAAA',
            message: this.message,
            metadata: {},
        }) */

        //  myLogger.error(this.message, ['/v1/api/login', 'vv33344', { error: 'Bad request error' }]);
    }
}

class RedisErrorResponse extends Error {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode =  StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}
class ConflictRequestError extends ErrorResponse{

    constructor(message = ReasonStatusCode.CONFLICT, statusCode =  StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse{

    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN){
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse{
    constructor(message=ReasonPhrases.UNAUTHORIZED, statusCode= StatusCodes.UNAUTHORIZED)
    {
        super(message,statusCode)
    }
}

class NotFoundError extends ErrorResponse{
    constructor(message=ReasonPhrases.NOT_FOUND, statusCode= StatusCodes.NOT_FOUND)
    {
        super(message,statusCode)
    }
}

class ForbiddenError extends ErrorResponse{
    constructor(message=ReasonPhrases.FORBIDDEN, statusCode= StatusCodes.FORBIDDEN)
    {
        super(message,statusCode)
    }
}

module.exports = {
    ErrorResponse,
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
    RedisErrorResponse
}



