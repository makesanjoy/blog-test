//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const https = require("https");

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema =new  mongoose.Schema( {
   title: String,
  content: String
});
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
res.render("home",{

});

});

app.get("/feedback", function(req, res){
  Post.find({}, function(err, posts){
    res.render("feedback", {

      posts: posts
      });

    })

 });

app.post("/feedback", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });


  post.save(function(err){
    if (!err){
        res.redirect("/feedback");
    }
  });
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }

    }]
  };
  const jsonData = JSON.stringify(data);
  const url =process.env.API_URL;
  const options = {
    method: "POST",
    auth: process.env.API_AUTH
  }
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.render("success");
    } else {
      res.render("failure");

    }

    // response.on("data", function(data) {
    //   console.log(JSON.parse(data));
    // })
  })
  request.write(jsonData);
  request.end();

});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3001, function() {
  console.log("Server started on port 3000");
});
