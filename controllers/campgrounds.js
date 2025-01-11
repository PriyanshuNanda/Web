const Campground = require('../models/campground');
const Export=module.exports;

Export.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

Export.newForm=(req, res) => {
    res.render('campgrounds/new');
}

Export.createCampground=async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    
    const camp = new Campground(req.body.campground);
    camp.images=req.files.map(f=>({
        url:f.path,
        filename:f.filename,
    }));
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}

Export.showCampground=async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

Export.editCampground=async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

Export.updateCampground=async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully edited the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

Export.deleteCampground=async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted the campground');
    res.redirect('/campgrounds');
}