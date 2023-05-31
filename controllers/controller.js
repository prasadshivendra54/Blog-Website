const authorModel = require("../models/authorModel");
const blogsModel = require("../models/blogsModel");
const jwt = require('jsonwebtoken')


// _______________ POST ________________

// this is for create author
const authors = async (req, res) =>{
    try {
        let authorData = req.body

        // for fname validate
        if(!authorData.fname) return res.status(400).send({status : false, message : "fname is Required"})
        let nameFormate = /^[A-Za-z]+$/ // this is for name validation
        if(typeof authorData.fname !== "string" || !nameFormate.test(authorData.fname)) return res.status(400).send({status : false, message : "enter valid fname"})
        if(authorData.fname.length <= 2) return res.status(400).send({status : false, message : "fname must be morethen 3 chareactor"})

        // for lname validate
        if(!authorData.lname) return res.status(400).send({status : false, message : "lname is Required"})
        if(typeof authorData.lname !== "string" || !nameFormate.test(authorData.lname)) return res.status(400).send({status : false, message : "enter valid lname"})
        if(authorData.lname.length <= 2) return res.status(400).send({status : false, message : "lname also must be morethen 3 chareactor"})

        // for title validate
        if(!authorData.title) return res.status(400).send({status : false, message : "Title is Required"});
        if(typeof authorData.title !== 'string') return res.status(400).send({status : false, message : "Title should be string"});
        let enm = ['Mr','Miss','Mrs'] // Single choice
        if(!enm.includes(authorData.title)) return res.status(400).send({status : false, message : "Title not exist"})

        // for email validate
        let emailFormat = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        if(!authorData.email) return res.status(400).send({status : false, message : "Email is Required"})
        if(!emailFormat.test(authorData.email)) return res.status(400).send({status : false, message : "Please enter valid email"})
        let findEmail = await authorModel.find({email : authorData.email})
        if(findEmail.length > 0) return res.status(400).send({status : false, message : "Email already exist"})

        // for password validate
        if(!authorData.password) return res.status(400).send({status : false, message : "Please make your password"})
        if(authorData.password.length <= 5) return res.status(400).send({status : false, message : "Password should be morethen 6 charector"})


        let data = await authorModel.create(authorData)
        return res.status(201).send({status : true, data})

    } catch (error) {
        return res.status(500).send(error.message)
    }
}


// this is for create blog
const blogs = async (req, res) =>{
    try {
        let blogData = req.body

        // for title validate 
        if(!blogData.title) return res.status(400).send({status : false, message : "Please Fill Title"})
        if(blogData.title.length <= 2) return res.status(400).send({status : false, message : "Title Should be morethen 3 charector"})

        // for body validate
        if(!blogData.body) return res.status(400).send({status : false, message : "Please Fill Body"})
        if(blogData.body.length <= 2) return res.status(400).send({status : false, message : "Body Should Be morethen 3 charector"})

        // for AuthorId validate
        if(!blogData.authorId) return res.status(400).send({status : false, message : "Please Give Author ID"})
        if(blogData.authorId.length != 24) return res.status(400).send({status : false, message : "Author Id Must Be 24 charector"})

        // for tags validate
        if(blogData.tags == "") return res.status(400).send({status : false, message : "Tags can not be Empty"})
        if(blogData.tags){
            let tags = blogData.tags
            var isValid = Array.isArray(tags) && tags.every(value => typeof value === "string");
            if(!isValid) return res.status(400).send({status : false, message : "Tags Should be Array of String"})
        }

        // for category validate
        if(!blogData.category) return res.status(400).send({status : false, message : "Please set category"})
        if(blogData.category.length <= 2) return res.status(400).send({status : false, message : "Category Should be morethen 3 charector"})
        if(typeof blogData.category !== 'string') return res.status(400).send({status : false, message : "category Should be string formate"})

        // for subcategory validate
        if(blogData.subcategory == "") return res.status(400).send({status : false, message : "Subcategory can not be Empty"})
        if(blogData.subcategory){
            let subcategory = blogData.subcategory
            var isValid = Array.isArray(subcategory) && subcategory.every(value => typeof value === "string");
            if(!isValid) return res.status(400).send({status : false, message : "Subcategory Should be Array of String"})
        }

        // for author validate
        let findAuthor = await authorModel.findById({_id : blogData.authorId})
        if(!findAuthor) return res.status(400).send({status : false, message : "Author id not Exist"})

        // blogData.authorId = req.decode.authorId
        if(blogData.authorId != req.authorId) return res.status(401).send({status : false, message : "You Are Not Authenticated"})
        let data = await blogsModel.create(blogData)
        return res.status(201).send({status : true, data})
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

// decodedToken

// ____________________ GET _________________________
// this is for get Blogs
const getBlogs = async (req, res) =>{
    try {
        let { authorId, category, subcategory } = req.query
        let querys = ({isDeleted : false, isPublished : true})
        if (authorId) {
            querys.authorId = authorId;
        }
        if (category) {
            querys.category = category;
        }
        if (subcategory) {
            querys.subcategory = subcategory;
        }

        let data = await blogsModel.find(querys)
        if(data.length > 0){
            return res.status(200).send({status : true, message : "Blogs list", data})
        }else{
            return res.status(404).send({status : false, message : "Data Not found"})
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}



// ____________________ PUT _________________________
// this is for update Blog
const updateBlogs = async (req, res) =>{
    try {
        let blogId = req.params.id
        if(!blogId){
            return res.status(400).send({status : false, message : "Please give BlogId"})
        }
        if(blogId.length != 24) return res.status(400).send({status : false, message : "Id Should be 24 charectors"})

        let blogData = req.body
        let findId = await blogsModel.findById(blogId)
        if(!findId){
            return res.status(404).send({status : false, message : "BlogId Not Exist"})
        }
        if(findId.isDeleted == true) return res.status(404).send({status : false, message : "No Blogs"})
        let data = await blogsModel.findByIdAndUpdate(
            {_id : blogId},
            {$push : {tags : blogData.tags, 
                subcategory : blogData.subcategory
            },
            title : blogData.title, 
            body : blogData.body, 
            isPublished : true, 
            publishedAt : new Date()
            }, 
            {new : true})
        return res.status(200).send({
            status : true,
            message: "Blog updated successfully",
            data
        })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}



// __________________________ DELETE _________________________
// this is for Delete blogs
const deleteBlog = async (req, res) =>{

    try {
        let blogId = req.params.id
        if(blogId.length != 24) return res.status(400).send({status : false, message : "Id Should be 24 charectors"})

        let findId = await blogsModel.findById(blogId)
        if(!findId) return res.status(404).send({status : false, message : "Blog Id Not Exist"})
        if(findId.isDeleted == true) return res.status(404).send({ status: false, message : "No blogs" })
        
        let data = await blogsModel.findByIdAndUpdate({_id : blogId},
            {isDeleted : true, deletedAt : new Date(), isPublished : false},
            {new : true}
        )

        return res.status(200).send({status : true})
    } catch (error) {
        return res.status(500).send(error.message)
    }
}


// this is for deleteByQuery
const deleteByQuery = async (req, res) =>{
    try {
        let data = req.query

        let id = req.authorId

        let { category, authorId, tags, subcategory, isPublished } = data

        let deletedBlog = await blogsModel.updateMany(
            {
                $and: [
                    { isDeleted : false }, { authorId : id }, data
                ]
            },
            { $set: {isDeleted : true, deletedAt : new Date(), isPublished : false} }

        )
        if (deletedBlog.modifiedCount > 0) {
            return res.status(200).send({ status: true, message: `${deletedBlog.modifiedCount} blog deleted` })
        }
        else {
            return res.status(404).send({ status: false, message: "no blogs found" })
        }
    } catch (error) {
        return res.status(500).send(error.message)

    }
}


// _________________________ Login (POST) ___________________________________
// this is for Login and Get Token
const login = async (req, res) =>{
    try {
        let email = req.body.email
        let password = req.body.password

        // for email and password validate
        if(!email || !password){
            if(!email) return res.status(400).send("Please enter your email ( कृपया अपना ईमेल डालें )")
            if(!password) return res.status(400).send("Please enter your password ( कृपया अपना पासवर्ड डालें ! )")
        }

        let author = await authorModel.findOne({email : email, password : password})

        // for author validate
        if(!author){
            return res.status(401).send("Email OR Password Is Incorrect ( आपका ईमेल या पासवर्ड गलत है, कृपया दोबारा प्रयास करें ! )")
        }
        
        let data = jwt.sign({authorId : author._id.toString()}, "secret-key")
        return res.status(200).send({status : true, data})

    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports = {
    authors,
    blogs,
    getBlogs,
    updateBlogs,
    deleteBlog,
    deleteByQuery,
    login
}