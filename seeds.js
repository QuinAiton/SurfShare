const mongoose = require("mongoose"),
  Item = require("./models/Item"),
  Comment = require("./models/Comment");

const Data = [
  {
    title: "5'10 Almerrick",
    image:
      "https://images.unsplash.com/photo-1577093616001-6ed4f1b57e37?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "well used board with lots of life left",
    price: "200$",
  },
  {
    title: "9'0 plank",
    image:
      "https://images.unsplash.com/photo-1531722569936-825d3dd91b15?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "well used board with lots of life left",
    price: "200$",
  },
];

const SeedDB = () => {
  Item.deleteMany({}, (err, removedItems) => {
    err ? console.log(err) : console.log("Items removed");
  });

  Data.forEach((item) => {
    Item.create(item, (err, Item) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Item created ");
        Comment.create(
          { text: "Wow what an awsome board", author: "bob" },
          (err, comment) => {
            if (err) {
              console.log(err);
            } else {
              Item.comments.push(comment);
              Item.save();
              console.log("created new comments");
            }
          }
        );
      }
    });
  });
};

module.exports = SeedDB;
