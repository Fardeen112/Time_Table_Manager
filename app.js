const express=require("express");
const bodyparser=require("body-parser");
const date=require(__dirname+"/date.js");
const _=require("lodash");
const mongoose=require("mongoose");
const app=express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://fardeen:Fardeen%40112@cluster0.i9ngg.mongodb.net/todolistDB?retryWrites=true&w=majority", {useNewUrlParser: true});

const todolistSchema=new mongoose.Schema({
  task: {
    type: String,
  }
});

const   Item = mongoose.model("Item", todolistSchema);

const item1 = new Item({
 task: "Welcome to your daily timetable scheduler and manager",
});
const item2 = new Item({
 task: "Hit the + button to add a sub-task under your Major task's list",
});
const item3 = new Item({
 task: "Hit the checkbox to delete a sub-task from your major tasks's list",
});

const item4 = new Item({
 task: "Just type the the name of any major task which you want to deal seperately eg:-(/taskname)",
});


const defaulttasks=[item1,item2,item3,item4];

const listSchema=new mongoose.Schema({
  task: {
    type: String
  },
  items: [todolistSchema]
});

const   List = mongoose.model("List", listSchema);
app.get("/",function(req,res){
    Item.find({},function(err,founditems){

      if(founditems.length ==0)
      {
        // console.log(defaulttasks);
        Item.insertMany(defaulttasks,function(err){
          if(err)
          {
            console.log(err);
          }
          else
          console.log("sucess");
        });
        res.redirect("/");
      }
      else{
        console.log(founditems);
      res.render("list",{listtype: "Today", newtask: founditems});
    }
    });
});




app.post("/",function(req,res){
const itemName=req.body.task;
const listname=req.body.list;
console.log(listname);
const item = new Item({
 task: itemName,
});
if(listname=="Today")
{
  item.save();
  res.redirect("/");
}
else
{
  List.findOne({task: listname},function(err,present){
    if(!err)
    {
        present.items.push(item);
        present.save();
        res.redirect("/"+listname);
    }
  });
}

});

app.post("/delete",function(req,res){
  const checkeditemId=(req.body.checkbox);
  const listname=req.body.listname;
  console.log(listname);
  if(listname=="Today"){
  Item.findByIdAndRemove(checkeditemId,function(err)
{
    if(err){
        console.log(err);
    }
    else
    {
      console.log("deletion sucess");
      res.redirect("/");
    }

});
}
else
{
  List.updateOne({task: listname}, {$pull: {items: {_id: checkeditemId}}},function(err,present){
  if(!err)
  {
    res.redirect("/"+listname);
  }
  }
);
}
});

app.get("/:listname", function(req,res){
  let customlistname= (req.params.listname);
  customlistname=_.capitalize(customlistname);
  // const itemName=req.body.task;
  console.log(customlistname);
  List.findOne({task: customlistname},function(err,present){
    if(!err)
    {
      if(!present)
      {
        const list = new List({
         task: customlistname,
         items:defaulttasks
        });
         list.save();
         console.log("new list added");
          res.redirect("/"+ customlistname);
      }
      else
      {
        res.render("list",{listtype: present.task, newtask: present.items});

      }
    }
    else
    {
      console.log(err);
    }
  });
});

app.post("/",function(req,res){
  work.push(req.body.task);
  res.redirect("/work");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
  console.log("server started on port 3000");
});