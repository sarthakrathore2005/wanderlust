//To validate schema
//Server side schema. It is not a mongoose schema
const Joi = require('joi');

//Listing Schema
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),//Non-negative
        image: Joi.string().allow("",null)//we can allow null or empty string because by default our mongoose schema will add default image 
    }).required()//listing object is required
});

//Review Schema
// We only created a server side validation but to actually implement it we have to make schema 
// validation function in app.js named validateReview and pass it as middleware in the 
// post route of review
module.exports.reviewSchema= Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
}
)