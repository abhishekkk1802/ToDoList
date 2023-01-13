// __dirname means the current directory in which file we are working

const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://admin-abhishek:Test123@cluster0.gotuvjd.mongodb.net/todolistDB');

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: 'welcome to your todolist!',
});

const item2 = new Item({
  name: 'Hit the + button to aff a new item.',
});

const item3 = new Item({
  name: '<-- HIt this to deelte an item',
});

const defaultItems = [item1, item2, item3];

// const listSchema = new mongoose.Schema({
//   name: String,
//   items: [itemsSchema],
// });
// const List = mongoose.model('List', listSchema);

// app.get('/', function (req, res) {
//   Item.find({}, function (err, foundItems) {
//     // console.log(foundItems);
//     if (foundItems.length === 0) {
//       Item.insertMany(defaultItems, function (err) {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log('succefully saved items');
//         }
//       });
//       res.redirect('/');
//     } else {
//       res.render('list', { listTitle: 'Today', newListItems: foundItems });
//     }
//   });

//   //   list is the name of EJS file which is inside view folder
//   // kindofDay is from list.ejs file
//   // day is a var name declared as a logic
// });

// app.get('/:customListName', function (req, res) {
//   const customListName = _.capitalize(req.params.customListName);

//   List.findOne({ name: customListName }, function (err, foundList){
//     if (!err) {
//       if (!foundList) {
//         const list = new List({
//           name: customListName,
//           items: defaultItems,
//         });

//         list.save();
//         res.redirect('/' + customListName);
//       } else {
//         res.render('list', {
//           listTitle: foundList.name,
//           newListItems: foundList.items,
//         });
//       }
//     }
//   });
// });

// app.post('/', function (req, res) {
//   // console.log(req.body);
//   const itemName = req.body.newItem;
//   const listName = req.body.list;

//   const item = new Item({
//     name: itemName,
//   });

//   if (listName === 'Today') {
//     item.save();
//     res.redirect('/');
//   } else {
//     List.findOne({ name: listName }, function (err, foundList) {
//       foundList.items.push(item);
//       foundList.save();
//       res.redirect('/' + listName);
//     });
//   }
// });

// app.post('/delete', function (req, res) {
//   const checkedItemId = req.body.checkbox;
//   const listName = req.body.listName;

//   if (listName === 'Today') {
//     Item.findByIdAndRemove(checkedItemId, function (err) {
//       if (!err) {
//         console.log('succefully deleted item');
//         res.redirect('/');
//       }
//     });
//   } else {
//     List.findOneAndUpdate(
//       { name: listName },
//       { $pull: { items: { _id: checkedItemId } } },
//       function (err, foundList) {
//         if (!err) {
//           res.redirect('/' + listName);
//         }
//       });
//   }
// });

// app.get('/about', function (req, res) {
//   res.render('about');
// });

// app.listen(3000, function () {
//   console.log('server started on port 3000');
// });

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });

});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list

        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });



});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }


});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
