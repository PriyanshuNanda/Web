const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});
const sample = array => array[Math.floor(Math.random() * array.length)];
const sendDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let randomCityNum = Math.floor(Math.random() * 1000);
        let price = Math.floor(Math.random() * 20) + 5;
        let newCampground = new Campground({
            location: `${cities[randomCityNum].city}, ${cities[randomCityNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            description: "Lorem ipsum dolor sit amet ",
            price: price,
        })
        await newCampground.save();
    }
}

sendDB().then(() => {
    mongoose.connection.close();
})