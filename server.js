const http = require("http");
const path = require("path");
const notesPathJson = path.join("data", "notes.json");
const notesPath = "./notes.txt";
const fs = require("fs");
const { error, log } = require("console");
const { domainToASCII } = require("url");

const port = 3000;
const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  console.log("Welcome to My Notes Server");
  if (req.url == "/notes") {
    if (req.method == "GET") {
      try {
        saveInNotes();
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
  } else {
    res.statusCode = 404;
    res.end("File not found");
  }
});

function renderData(res) {
  const dataBuffer = fs.readFileSync(notesPath);
  const data = dataBuffer.toString();
  res.setHeader("Content-Type", "text/plain");
  if (data.length == 0) {
    res.end("There is no notes!");
  } else {
    res.write(`${data}`);
    res.end("");
  }
}

function saveInNotes(data) {
  const dataJSON = JSON.stringify(data);
  console.log(dataJSON);
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
    const dataJSON = JSON.parse(data);
    saveNotes(dataJSON);
    res.end("notes saved successfully!");
  });
}

function saveNotes(val) {
  const data = loadNotes();
  const index = data.length;
  const obj = {
    id: index + 1,
    note: `${val.note}`,
  };
  data.push(obj);
  console.log(data);
  saveInNotes(data);
}

function getNotesData() {}
server.listen(port, () => {
  console.log("server created successfully");
  console.log(`server at : http://localhost:${port}`);
});
