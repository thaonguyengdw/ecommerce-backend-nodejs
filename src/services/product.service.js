'use strict'

const { product, clothing, electronic } = require('../models/product.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')

//define factory class to create product
class ProductFactory {
    /* 
        type: 'Clothing',
        payload
    */
    static async createProduct(type, payload){
        switch (type){
            case 'Electronics':
                return new Electronics(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid Product Types ${type}`)
        }
    }
}

//define the base class 
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }){
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes
    }

    // create new product
    async createProduct(product_id){
        return await product.create({ ...this, _id: product_id })
    }
} 

//Define sub-class for different product types clothing
class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw BadRequestError('create new Clothing error')

        const newProduct = await super.createProduct()
        if(!newProduct) throw BadRequestError('create new Product error')

        return newProduct;
    }
}

//Define sub-class for different product types Electronics
class Electronics extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw BadRequestError('create new Electronics error')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw BadRequestError('create new Product error')

        return newProduct;
    }
}

//Define sub-class for different product types Electronics
class Furniture extends Product{
    async createProduct(){
        const newFurniture = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw BadRequestError('create new Electronics error')

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw BadRequestError('create new Product error')

        return newProduct;
    }
}

module.exports = ProductFactory;