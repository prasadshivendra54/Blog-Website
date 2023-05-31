const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')
const {authentication, authorization} = require('../middleware/middleware')

router.post('/authors', controller.authors) 
router.post('/blogs', authentication, controller.blogs)
router.get('/blogs', authentication, controller.getBlogs)
router.put('/blogs/:id', authentication, authorization, controller.updateBlogs)
router.delete('/blogs/:id', authentication, authorization, controller.deleteBlog)
router.delete('/blogs', authentication, authorization, controller.deleteByQuery)

router.post('/login', controller.login)

module.exports = router