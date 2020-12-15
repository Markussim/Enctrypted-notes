const express = require("express");
const fs = require("fs");
const dBModule = require("./dbModule.js");
const Note = require("./models/note.js");
const app = express();
const port = 3000;
const clientDir = __dirname + "/client";

connectToMongo("e-notes");

app.use(express.static(clientDir));
app.use(express.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  let name = req.body.name;
  let text = req.body.text;

  if (!(await dBModule.searchInDBOne(Note, name))) {
    createNote(text, name);
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

app.get("/exists", (req, res) => {
  if (dBModule.searchInDBOne(Note, req.query.name)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

app.get("/getNote", async (req, res) => {
  console.log(req.query.noteName);
  let note = await dBModule.searchInDBOne(Note, req.query.noteName);
  if (note) {
    res.send(note);
  } else {
    res.sendStatus(404);
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
    new Note({
      text: text,
      name: name,
    })
  );
}
