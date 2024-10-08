'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')
const { 
    findAllDraftsForShop, 
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../models/repositories/product.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.repo')
const { pushNotiToSystem } = require('./notification.service')

//define factory class to create product
class ProductFactory {
    /* 
        type: 'Clothing',
        payload
    */

    static productRegistry = {} // key-class

    static registerProductType( type, classRef){
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

        return new productClass(payload).updateProduct(productId)
    }

    //Update 
    //Public a product by a seller
    static async publishProductByShop({ product_shop, product_id }){
        return await publishProductByShop({ product_shop, product_id })
    }

    //unPublish a product by a seller
    static async unPublishProductByShop({ product_shop, product_id }){
        return await unPublishProductByShop({ product_shop, product_id })
    }

    //Query
    static async findAllDraftsForShop( { product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop( { product_shop, limit = 50, skip = 0  }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    //Search product by public
    static async searchProducts({ keySearch }){
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({ limit=50, sort = 'ctime', page = 1, filter = {isPublished: true }}){
        return await findAllProducts({ limit, sort, page, filter, 
            select: ['product_name', 'product_price', 'product_thumb', 'product_shop'] 
        })
    }

    // static async findProduct({ keySearch }){
    //     return await searchProductByUser({ keySearch })
    // }

    static async findProduct({ product_id }){
        return await findProduct({ product_id, unSelect: ['__v', 'product_variations']})
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
        const newProduct =  await product.create({ ...this, _id: product_id })
        if(newProduct){
            // add product_stock in inventory collection
            const invenData = await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
            // push noti to system collections
            pushNotiToSystem({
                type: 'SHOP-001',
                receivedId: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shop_name: this.product_shop
                }
            }).then(rs => console.log(rs))
            .catch(console.error)
            console.log(`invenData::`, invenData)
        }

        return newProduct
    }

    // update Product
    async updateProduct(productId, bodyUpdate){
        return await updateProductById({ productId, bodyUpdate, model: product })
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

    async updateProduct( productId){
        /**
         * {
         *  a: undefined
         *  b: null
         * }
         */
        //1 remove attr has null undefine
        // console.log(`[1]::`, this)
        const objectParams = removeUndefinedObject(this)
        // console.log(`[2]::`, objectParams)
        //2 check xem update cho nao
        if(objectParams.product_attributes){
            // update child
            await updateProductById({ productId, 
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), 
                model: clothing
            })
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
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
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw BadRequestError('create new furnitue error')

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw BadRequestError('create new Product error')

        return newProduct;
    }
}

// register product types
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory;