'use strict';

const { model, Schema } = require('mongoose')
const DOCUMENT_NAME = 'Resources';
const COLLECTION_NAME = 'Resources';

const resourceSchema = new Schema({
    src_name: { type: String, required: true },//profile
    src_slug: { type: String, required: true },//0000
    src_description: { type: String, default: ''}
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, resourceSchema)