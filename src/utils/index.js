'use strict'

const _= require('lodash')
const { Types } = require('mongoose')

const convertToObjectIdMongodb = id => new Types.ObjectId(id)

const getInfoData = ({ fileds = [], object = {}} ) => {
    return _.pick( object, fileds )
}

//['a','b'] = {a:1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

//['a','b'] = {a: 0, b: 0}
const unGetSelectData = (select = [])=> {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if(obj[k] === null){
            delete obj[k]
        }
    })

    return obj
}

/*
    const a = {
        c: {
            d: 1,
            e: 2
        }
    }

=> db.collection.updateOne({
    `c.d`: 1,
    `c.e`: 2
})
*/
const updateNestedObjectParser = obj => {
    console.log(`1::`, obj)
    const final = {}
    Object.keys(obj).forEach(k=> {
        if(typeof obj[k] === 'object' && !Array.isArray(obj[k])){
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a]
            })
        }else{
            final[k] = obj[k]
        }
    })
    console.log(`2::`, final)
    return final
}
/*
 new RegExp(placeholder, 'g') creates a regular expression to search for the placeholder globally in the template string.
The g flag ensures that all instances of the placeholder in the string are replaced (not just the first).
template.replace(...) replaces all instances of placeholder with the corresponding value in the params object (params[key]).
replacePlaceholder
{{lastname}}
 */
const replacePlaceholder = (template, params) => {
    Object.keys(params).forEach(k => {
        const placeholder = `{{${k}}}` // {{verifyKey}}
        template = template.replace(new RegExp(placeholder, 'g'), params[k])
    })
    return template;
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb,
    replacePlaceholder
}