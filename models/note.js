const mongoose = require("mongoose");

//Creates the DocumentSchema and exports it
const NoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  }
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;