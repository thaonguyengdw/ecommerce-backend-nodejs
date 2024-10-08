'use strict';

const { model, Schema } = require('mongoose')
const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

// const granList = [
//     { role: 'admin', resource: 'profile', action: 'update:any', attributes: '*' },
//     { role: 'admin', resource: 'profile', action: 'update:any', attributes: '*, !mount' }, // trừ field mount ra

//     { role: 'shop', resource: 'profile', action: 'update:own', attributes: '*' },
//     { role: 'shop', resource: 'profile', action: 'update:own', attributes: '*, !mount' },

//     { role: 'admin', resource: 'profile', action: 'update:own', attributes: '*' }
// ]

const RoleSchema = new Schema({
    rol_name: { type: String, default: 'user', enum: ['user', 'shop', 'admin']},
    rol_slug: { type: String, required: true }, //000777
    rol_status: { type: String, default: 'active', enum: ['active', 'bock', 'pending']},
    rol_description: { type: String, default: '' },
    rol_grants: [
        {
            resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
            actions: [{ type: String, required: true}],
            attributes: { type: String, default: '*' },
        }
    ]
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, RoleSchema)