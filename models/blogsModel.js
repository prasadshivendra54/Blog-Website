const { default: mongoose } = require("mongoose");
const authorModel = require("./authorModel"); // optinal 

const blogModel = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    authorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "author"
    },
    tags : [String],
    category : {
        type : String,
        required : true
    },
    subcategory : [String],
    deletedAt : {
        type : Date,
        // default : new Date
        default : null
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    publishedAt : {
        type : Date,
        // default : new Date
        default : null
    },
    isPublished : {
        type : Boolean,
        default : false
    }
}, {timestamps : true})


module.exports = mongoose.model("blog", blogModel)