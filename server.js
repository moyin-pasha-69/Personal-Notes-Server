const http = require("http");
const path = require("path");
const notesPathJson = path.join("data", "notes.json");
const fs = require("fs");

const port = 3000;
const server = http.createServer((req, res) => {
  if (req.url == "/notes") {
    if (req.method == "GET") {
      try {
        renderData(res);
      } catch (error) {
        res.end("Failed to  get file");
      }
    } else if (req.method == "POST") {
      try {
        getData(req, res);
      } catch (error) {
        res.statusCode = 500;
        res.end("Something Went wrong");
      }
    }
  } else if (req.url.startsWith("/notes/") && req.method == "DELETE") {
    const parts = req.url.split("/");
    removeNotesData(Number(parts[2]), res);
  } else {
    res.statusCode = 404;
    res.end("File not found");
  }
});

function getNoteId(data) {
  return Math.max(...data.map((val) => val.id), 0) + 1;
}
function renderData(res) {
  const data = loadNotes();
  res.setHeader("Content-Type", "text/plain");
  if (data.length == 0) {
    res.end("There is no notes!");
  } else {
    data.forEach((val, index) => {
      res.write(`${index + 1}. ${val.note} (ID:${val.id}) \n`);
    });
    res.end("");
  }
}

function saveInNotes(data) {
  const dataJSON = JSON.stringify(data);
  return fs.writeFileSync(notesPathJson, dataJSON);
}

function loadNotes() {
  try {
    const dataBuffer = fs.readFileSync(notesPathJson);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (error) {
    return [];
  }
}

function getData(req, res) {
  let data = "";
  req.on("data", (chunks) => {
    data += chunks;
  });
  req.on("end", () => {
    saveNotes(data.trim(), res);
  });
}

function saveNotes(val, res) {
  const data = loadNotes();
  const ans = data.filter((data) => data.note == val);
  if (ans.length == 0) {
    const index = data.length;
    const obj = {
      id: getNoteId(data),
      note: `${val}`,
    };
    data.push(obj);
    saveInNotes(data);
    res.end("notes saved successfully!");
  } else {
    res.end("There is already exist this note");
    return;
  }
}

function removeNotesData(id, res) {
  let notesList = loadNotes();
  res.writeHead(200, { "Content-Type": "text/plain" });
  if (id <= 0) {
    res.write("Please enter valid id");
    res.end("");
  } else if (notesList.some((val) => val.id == id)) {
    try {
      const newNotesList = notesList.filter((val) => id != val.id);
      saveInNotes(newNotesList);
      res.write(`Notes Deleted successfully! (ID:${id})`);
      res.end("");
    } catch (error) {
      return [];
    }
  } else {
    res.write(`ID:${id} does not exist`);
    res.end("");
  }
}

server.listen(port, () => {
  console.log("Welcome to my server");
});
