const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

const app=express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/targetDB");

const itemSchema={
    name: String
}

const Item=mongoose.model("Item", itemSchema);

const listSchema={
    name: String,
    items: [itemSchema]
}

const List=mongoose.model("List", listSchema);

app.get("/", function(req, res){
    Item.find({}, function(err, foundItems){
        res.render("home", {newListItems: foundItems});
    })
})

app.post("/", function(req, res){
    const itemName=req.body.newItem;
    const item=new Item({
        name: itemName
    })
    item.save();
    console.log("Successfully saved.");
    res.redirect("/");
})

app.post("/delete", function(req, res){
    const checkedItemID=req.body.checkbox;
    Item.findByIdAndRemove(checkedItemID, function(err){
        if(!err){
            console.log("Successfully deleted.");
            res.redirect("/");
        }
    })
})

app.listen(3000, function(req, res){
    console.log("Server running on port 3000.");
})