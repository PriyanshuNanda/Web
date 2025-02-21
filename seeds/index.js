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
            images:[
                {
                    url: 'https://res.cloudinary.com/dxv6heraw/image/upload/v1740142583/YelpCamp/oxhu6ukkizb28s7vbjot.avif',
                    filename: 'YelpCamp/oxhu6ukkizb28s7vbjot',
                  },
                  {
                    url: 'https://res.cloudinary.com/dxv6heraw/image/upload/v1740142594/YelpCamp/xqmqz0whw0t5jqiinyqm.avif',
                    filename: 'YelpCamp/xqmqz0whw0t5jqiinyqm',
                  }
            ], 
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, cumque.',
            price:Math.floor(Math.random()*20)+10,
        });

        await camp.save();
    }
}

seedDB().then(()=>{mongoose.connection.close();});