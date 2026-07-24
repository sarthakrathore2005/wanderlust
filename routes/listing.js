const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");

const ExpressError= require("../utils/ExpressError.js");
const {listingSchema}= require("../schema.js");
const Listing= require("../models/listing.js");

//Server side Validation for listing
const validateListing= (req, res, next) =>{
    let {error}= listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//INDEX ROUTE
router.get("/", wrapAsync(async(req,res) => {
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//NEW ROUTE
router.get("/new", (req,res) => {
    res.render("listings/new.ejs");
});

//SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res) =>{
    let {id}= req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));



//CREATE ROUTE
router.post("/", validateListing, wrapAsync(async (req,res) => {//passing validateListing as middleware
    //let {title, description, image, price, locatiion, country}= req.body; 
    //Another way of extracting these is object key value pairs example: name=listing[title] in input field
    // if(!req.body.listing){ //When we send request from postman and didn't send the data for listing in the body
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    //OR
    //const res=listingSchema.validate(req.body);
    // if(res.error){
        //throw new ExpressError(400, res.error);
    // } OR use middleware function validateListing
    const newListing= new Listing(req.body.listing);//Add new listing from the data we get from the form
    await newListing.save(); //insert new listing to mongoDB database
    res.redirect("/listings");
}));

//EDIT ROUTE
router.get("/:id/edit",wrapAsync(async (req, res) => {
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//UPDATE ROUTE
router.put("/:id", validateListing, wrapAsync(async (req,res) => {
    
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});//destructuring object(listing)
    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
router.delete("/:id",wrapAsync(async (req, res)=> {
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports= router;