const mongoose = require("mongoose"),
  ObjectID = require("mongodb").ObjectID;
let db;

//Connect to MongoDB With Authentication.
exports.cnctDBAuth = (collectionname) => {
  const mongAuth = require("./mongoauth.json");
  mongoose.connect("mongodb://localhost:27017/" + collectionname, {
    auth: {
      authSource: "admin",
    },
    user: mongAuth.username,
    pass: mongAuth.pass,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to MongoDB using collection " + collectionname);
  });
};

//Connect to MongoDB
exports.cnctDB = (collectionname) => {
  let dbLink = `mongodb://localhost/${collectionname}`;
  mongoose.connect(dbLink, { useNewUrlParser: true, useUnifiedTopology: true });

  db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to MongoDB using " + collectionname);
  });
};

exports.findInDBOne = async (Model) => {
  return await Model.findOne();
};

exports.searchInDBOne = async (Model, name) => {
  return await Model.findOne({ name: name });
};

exports.findInDB = async (Model) => {
  return await Model.find({});
};

//takes input with type Model. Saves that model in Database. Cant be used before cnctDB or cnctDBAuth.
exports.saveToDB = (input) => {
  input.save((error, sucess) => {
    if (sucess) console.log(`Successfully saved ${input} to the database!`);
    if (error) console.error(error);
  });
};

exports.getDoc = async (Model, doc) => {
  return await Model.findOne({ doc: doc });
};

exports.setDoc = async (Model, doc, text) => {
  return await Model.updateOne({ doc: doc }, { $set: { text: text } });
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
