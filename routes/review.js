const express= require("express");
const router= express.Router({mergeParams: true});
//Preserve the req.params values from the parent router. If the parent and the child have 
// conflicting param names, the child’s value takes precedence.
//mergeParams is an option in router which is written because previously we are unable to access id 
//from the route because we remove the common path /listings/:id/review so to merge this parent path
// with the child path we have to set mergeParams to true.
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {reviewSchema}= require("../schema.js");
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");

//Server side validation for review
const validateReview= (req, res, next) =>{
    let {error}= reviewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}


//REVIEWS
router.post("/", validateReview , wrapAsync(async(req, res) => {
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId}= req.params;

    //first of all we find the listing through id and then match the reviewId with the values 
    // stored in the reviews array inside listing and delete it through pull operator
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports= router;