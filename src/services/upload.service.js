'use strict'

const cloudinary = require('../configs/cloudinary.config');

//1. upload from url image

const uploadImageFromUrl = async() => {
    try {
        const urlImage = 'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-m05w04yvg4un26.webp'
        const folderName = 'product/8409', newFiledName = 'testdemo';
        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFiledName,
            folder: folderName,
        })

        // console.log(result);
        return result
    } catch (error) {
        console.error('Error uploading image::', error);
        
    }
}

const uploadImageFromLocal = async(
    path,
    folderName = 'product/8409'
) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName,
        })

        console.log(result);
        return {
            image_url: result.secure_url,
            shopId: 8409,
            thumb_url: cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'jpg'
            })
        }
    } catch (error) {
        console.error('Error uploading image::', error);
        
    }
}

uploadImageFromUrl().catch(console.error);

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal
}