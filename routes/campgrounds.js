const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catch_async');
const campgroundController = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer  = require('multer');
const {storage}=require('../cloudinary');
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, upload.array('image'),validateCampground,  catchAsync(campgroundController.createCampground));
    
router.get('/new', isLoggedIn, campgroundController.newForm);

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.editCampground));

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put( isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundController.updateCampground))
    .delete( isLoggedIn, catchAsync(campgroundController.deleteCampground));

module.exports = router;