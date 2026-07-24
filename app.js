const express= require("express");
const app= express();

const mongoose= require("mongoose");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");

app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));//to use static files

const listings= require("./routes/listing.js");
const reviews= require("./routes/review.js");

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

// app.get("/testListing",async(req,res) => {
//     let sampleListing= new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful");
// });

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//WHEN ABOVE ROUTES FAILED TO MATCH THE REQUEST, THIS ROUTE GETS EXECUTED
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    //res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});