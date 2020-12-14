const express = require("express");
const fs = require("fs");
const dBModule = require("./dbModule.js");
const Doc = require("./models/note.js");
const app = express();
const port = 3000;
const clientDir = __dirname + "/client";

connectToMongo("e-notes");

app.use(express.static(clientDir));

app.post("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/exists", (req, res) => {
  if (dBModule.searchInDBOne(req.query.name)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});
app.listen(port, () => console.log(`Example app listening on port port!`));

function connectToMongo(dbName) {
  if (fs.existsSync("mongoauth.json")) {
    dBModule.cnctDBAuth(dbName);
  } else {
    dBModule.cnctDB(dbName);
  }
}

function createNote(text, name) {
  dBModule.saveToDB(
    new Doc({
      text: text,
      name: name,
    })
  );
}
