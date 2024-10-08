'use strict';

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const { v4: uuidv4 } = require('uuid');

class MyLogger {
    constructor() {
        const formatPrint = format.printf(
            ({ level, message, context, requestId, timestamp, metadata }) => {
                return `${timestamp}::${level}::${context}::${requestId? `[${requestId}]` : ''}::${message} ${JSON.stringify(metadata)}`;
            }
        )

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true, // true -> bạn có thể lưu trữ file log trước khi xóa bằng cách zip file lại
                    maxSize: '1m', //dung lượng file log 
                    maxFiles: '14d', // nếu đạt mã thì sẽ xóa log tạo ra trong vòng 14 ngày
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
                        formatPrint
                    ),
                    level: 'info'
                }),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true, // true -> bạn có thể lưu trữ file log trước khi xóa bằng cách zip file lại
                    maxSize: '1m', //dung lượng file log 
                    maxFiles: '14d', // nếu đạt mã thì sẽ xóa log tạo ra trong vòng 14 ngày
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
                        formatPrint
                    ),
                    level: 'error'
                })
            ],

        })
    }

    commonParams(params) {
        let context, req, metadata;
        if(!Array.isArray(params)){
            context = params
        }else {
            [context, req, metadata] = params;
        }

        const requestId = req?.requestId || uuidv4()
        return {
            requestId,
            context,
            metadata
        }
    } 

    log(message, params) {
        const paramsLog = this.commonParams(params)
        const logObject = Object.assign({
            message
        }, paramsLog);

        this.logger.info(logObject)
    }

    error(message, params) {
        const paramsLog = this.commonParams(params)
        const logObject = Object.assign({
            message
        }, paramsLog);
        
        this.logger.error(logObject)
    }
}

module.exports = new MyLogger();