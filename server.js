const express = require("express");
const path = require("path");
const fs = require("fs");

let app = express();
let PORT = process.env.PORT || 3000;

// Set up Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
let notes = require("./Develop/db/db.json");

// Routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});

// Display notes
app.get("/api/notes", function (req, res) {
    fs.readFile("./Develop/db/db.json", "utf8", function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(notes);
    });
});

// Starts server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

// Create new note
app.post("/api/notes", function (req, res) {
    let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    let id = randLetter + Date.now();
    let newNote = {
        id: id,
        title: req.body.title,
        text: req.body.text,
    };
    console.log(typeof notes);
    notes.push(newNote);
    const stringifyNote = JSON.stringify(notes);
    res.json(notes);
    fs.writeFile("./Develop/db/db.json", stringifyNote, (err) => {
        if (err) console.log(err);
        else {
            console.log("Note successfully saved to db.json");
        }
    });
});

// Delete note
app.delete("/api/notes/:id", function (req, res) {
    let noteID = req.params.id;
    fs.readFile("db/db.json", "utf8", function (err, data) {
        let updatedNotes = JSON.parse(data).filter((note) => {
            console.log("note.id", note.id);
            console.log("noteID", noteID);
            return note.id !== noteID;
        });
        notes = updatedNotes;
        const stringifyNote = JSON.stringify(updatedNotes);
        fs.writeFile("db/db.json", stringifyNote, (err) => {
            if (err) console.log(err);
            else {
                console.log("Note successfully deleted from db.json");
            }
        });
        res.json(stringifyNote);
    });
});

// Catch all error route
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});