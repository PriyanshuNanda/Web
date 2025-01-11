const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

const sample=array=>array[Math.floor(Math.random()*array.length)];


const seedDB=async()=>{
    await Campground.deleteMany({});
    for (let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const camp= new Campground({
            author:'677529da2c7f161010963d6d',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cumque.',
            price:Math.floor(Math.random()*20)+10,
        });

        await camp.save();
    }
}

seedDB().then(()=>{mongoose.connection.close();});