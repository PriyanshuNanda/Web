const path = require('path')
const express = require('express');
const mongoose = require('mongoose');
const Joi=require('joi');
const Campground = require('./models/campground');
const { places, descriptors } = require('./seeds/seedHelpers');
const methodOverride = require('method-override');
const catchAsync=require('./utils/catchasync');
const ejs = require('ejs-mate');

const app = express();
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const validateCampground=(req,res,next)=>{
    const campgroundSchema=Joi.object({
        campground: Joi.object({
            title: Joi.string.required(),
            price: Joi.number.required().min(0),
            image: Joi.string.required(),
            location: Joi.string.required(),
            description: Joi.string.required(),
        }).required()
    });
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});
app.engine('ejs', ejs);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/newentry');
})

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}))
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}))
app.put('/campgrounds/:id',validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.post('/campgrounds',validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);}
))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode=500}=err;
    if(!err.message) err.message='Something Went Wrong';
    res.status(statusCode).render('error',{err});
});

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});