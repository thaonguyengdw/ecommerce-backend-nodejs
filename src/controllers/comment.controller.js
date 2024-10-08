'use strict'

const { createComment, deleteComment, getCommentsByParentId,  } = require('../services/comment.service')
const {  SuccessResponse } = require('../core/success.response')

class CommentController {
    createComment = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'create comment',
            metadata: await createComment(req.body)
        }).send(res)
    }

    deleteComment = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'delete comment',
            metadata: await deleteComment(req.body)
        }).send(res)
    }

    getCommentsByParentId = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get comment by parentId",
            metadata: await getCommentsByParentId(req.query)
        }).send(res)
    }
}

module.exports = new CommentController()