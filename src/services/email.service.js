'use strict';

const { newOtp } = require('./otp.service')
const { getTemplate } = require('./template.service')
const transport = require('../dbs/init.nodemailer')
const { NotFoundError } = require('../core/error.response')
const { replacePlaceholder } = require('../utils/index')

const sendEmailLinkVerify = async ({ 
    html,
    toEmail,
    subject = 'Xác nhận email đăng ký!',
    text = 'Xác nhận...',
}) => {
    try {
        const mailOptions = {
            from: '"ShopDEV" <thaonguyengdw@gmail.com>',
            to: toEmail,
            subject,
            text,
            html
        };

        transport.sendMail(mailOptions, (err, info) => {
            if(err) {
                return console.error(err);
            }

            console.log('Message sent::', info.messageId);
        })
    } catch (error) {
        console.error(`eror send email`, error);
        return error;
    }
}

const sendEmailToken = async ({
    email = null
}) => {
    try {
        //1. generate token
        const token = await newOtp({ email });
        //2. get template
        const template = await getTemplate({
            tem_name: 'HTML EMAIL TOKEN'
        })

        if(!template) {
            throw new NotFoundError('Template not found')
        }

        //3. replace placeholder with params
        const content = replacePlaceholder(
            template.tem_html,
            {
                link_verify: `http://localhost:3052/cgp/welcome-back?token=${token.otp_token}`,
            }
        )
        //4. send email
        // sendEmailLinkVerify({
        //     html: content,
        //     toEmail: email,
        //     subject: 'Vui lòng xác nhận địa chỉ email đăng ký ShopDEV.com',
        // }).catch(err => console.log(err));

        try {
            await sendEmailLinkVerify({
                html: content,
                toEmail: email,
                subject: 'Vui lòng xác nhận địa chỉ email đăng ký ShopDEV.com',
            });
        } catch (err) {
            console.error('Error sending verification email:', err);
        }

        return 1
    } catch (error) {
      console.log(error);
    }
}

module.exports = {
    sendEmailToken
};