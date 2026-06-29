const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const listingSchema= new Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type: String
    },
    image: {
        type: Object,
        set: (v) => v==="" ? "https://unsplash.com/photos/hnRS8SlQxxw" : v,
        default: "https://unsplash.com/photos/hnRS8SlQxxw"
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },

});

const Listing= mongoose.model("Listing",listingSchema);
module.exports= Listing;