const jwt = require('jsonwebtoken')
const blogsModel = require('../models/blogsModel')
const authorModel = require('../models/authorModel')


// this is for authentication
const authentication = async (req, res, next) =>{
    try {
        let token = req.header('x-api-key')
        
        if(!Object.keys(req.headers).includes('x-api-key')) return res.status(404).send({status : false, message : "Your Header is missing"})

        if(!token){
            return res.status(400).send({status : false, message : "Token is missing"})
        }
        else{
            if(token){
                let decodedToken = jwt.verify(token, "secret-key")
                req.authorId = decodedToken.authorId
                // console.log(req.authorId)
            }else{
                return res.status(401).send({status : false, message : "You Are Not Authenticated"})
            }
        }
        
        next()
    } catch (error) {
        return res.status(500).send({status : false, message : "Token Invalid"})

        // if (error.message.includes("signature") || error.message.includes("token") || error.message.includes("malformed")) {

        //     // console.log(error.message)
        //     return res.status(401).send({ status: false, message: "You are not Authenticated" })
        // }
        // return res.status(500).send({ status: false, message: error.message })
    }
}


// this is for authorization
const authorization = async (req, res, next) =>{
    try {
        let id = req.authorId
        let blogId = req.params.id
        if (blogId) {
            let blog = await blogsModel.findById(blogId)
            if (!blog) {
                return res.status(404).send({ status: false, message: "blog not found" })
            }
            let authorId = blog.authorId
            if (id != authorId) {
                return res.status(401).send({ status: false, message: "You are not authorized" })
            }
        }
        let authorId = req.query.authorId
        if (authorId) {
            if (id != authorId) {
                return res.status(401).send({ status: false, message: "You are not authorized" })
            }
        }
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}


// this is for export 
module.exports = {authentication, authorization}