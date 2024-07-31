'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const { AuthFailureError } = require('../core/error.response')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils") 
const { BadRequestError, ForbiddenError } = require('../core/error.response')

// service

const { findByEmail } = require('./shop.service')
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {

    static handlerRefreshTokenV2 = async( { keyStore, user, refreshToken } )=>{
        const {userId, email} = user

        //Neu refresh token ton tai trong array nhung token da duoc su dung
        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happen !! Please relogin')

        }

        if(keyStore.refreshToken !== refreshToken)
        {
            throw new AuthFailureError("Shop is not registed ")
        }

        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError("Shop is not registed")

        const token = await createTokenPair({UserId:foundShop._id,email}, keyStore.publicKey, keyStore.privateKey)
        await keyStore.updateOne({
            $set:{
                refreshToken:token.refreshToken
            }
            ,$addToSet:{
                refreshTokensUsed:refreshToken // da dc su dung de lay token moi roi 
            }
        })
        return {
            user,
            token
        }
    }
    
    /*
        check this token is used
    */
    static handlerRefreshToken = async ( refreshToken ) => {

        //check xem token này đã được sử dụng chưa
        const foundToken = await KeyTokenService.findByRefreshTokensUsed( refreshToken )
		//neu co
        if(foundToken){
        	//Decode xem token này là thằng này
			const { userId, email } = await verifyJWT( refreshToken, foundToken.privateKey)
			console.log({ userId, email })
			//xoa tat ca tokens trong KeyStore
			await KeyTokenService.deleteKeyById(userId)
			throw new ForbiddenError('Something wrong happened, please relogin !!!')
        }

		// neu khong
		const holderToken = await KeyTokenService.findByRefreshToken( refreshToken )
		if(!holderToken) throw new AuthFailureError('Shop is registered')

		//verify token
		const { userId, email } = await verifyJWT( refreshToken, holderToken.privateKey )
		console.log('2--', { userId, email })

		// check UserId
		const foundShop = await findByEmail( {email} )
		if(!foundShop) throw new AuthFailureError('Shop is registered')
		
		//create a new pair of key
		const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

		//update token
		await holderToken.updateOne({
			$set: {
				refreshToken: tokens.refreshToken
			},
			$addToSet: {
				refreshTokensUsed: refreshToken // da dc su dung de lay token moi roi 
			}
		})

		return {
			user: { userId, email},
			tokens
		}
    }

    static logout = async(keyStore) => {
        console.log(keyStore)
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log( { delKey })
        return delKey
    }
    /*
        1. - check email in dbs
        2. - match password
        3. - create AT & RT and save
        4. - generate tokens
        5. - get data return login
     */
    static login = async ({ email, password, refreshToken = null }) => {
        //1.
        const foundShop = await findByEmail({ email })
        if(!foundShop) throw new BadRequestError('Shop not registered!')
        
        //2.
        const match = await bcrypt.compare( password, foundShop.password)
        if(!match) throw new AuthFailureError('Authentication error')

        //3.
        // create private key and public key
            
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        //4. generate tokens
        //const { _id: userId} = foundShop
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId: foundShop._id
        })
        return {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop}),
            tokens
        }
    }
    static signUp = async ({ name, email, password}) => {
        // try {
            // Step 1 check email existed??
            // lean: return a original javascript object
            const holdershop = await shopModel.findOne( { email }).lean()
            if(holdershop){
                throw new BadRequestError('Error: Shop already registered!')
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })
            
            if(newShop){
                // create private key and public key
            
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                //Public key CryptoGraphy Standards !

                console.log({ privateKey, publicKey}) //save collection keyStore

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })
                if(!keyStore){
                    // throw new BadRequestError('Error: Shop already registered!')
                    return {
                        code: 'xxxx',
                        message: 'keyStore error'
                    }
                }

                //create token pair
                const tokens = await createTokenPair({ userId: newShop._id, email}, publicKey, privateKey)
                console.log(`Created token success::`, tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop}),
                        tokens 
                    }
                }
            }
            return {
                code: 200,
                metadata: null
            }
        // } catch (error) {
        //     console.error(error)
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}

module.exports = AccessService 