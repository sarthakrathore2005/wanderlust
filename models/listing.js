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
        type: String,
        set: (v) => v==="" ? "https://images.unsplash.com/photo-1773332598501-f8612761781a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        default: "https://images.unsplash.com/photo-1773332598501-f8612761781a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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