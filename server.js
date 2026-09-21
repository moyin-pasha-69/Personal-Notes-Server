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
  if (req.method == "GET" && req.url == "/notes") {
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

function saveInNotes() {
  const dataBuffer = fs.readFileSync(notesPathJson);
  const dataJSON = dataBuffer.toString();
  const data = JSON.parse(dataJSON);
  let text = "Notes are";
  try {
    fs.writeFileSync(notesPath, "");
    data.forEach((val) => {
      text += `\n${val.id}. ${val.note}`;
    });
  } catch (error) {
    console.log(error);
  }
  return fs.writeFileSync(notesPath, text);
}

function getData(req, res) {
  let data = "";
  req.on("data", (chunks) => {
    data += chunks;
  });
  req.on("end", () => {
    const dataJSON = JSON.parse(data);
    saveNotes(notesPath, dataJSON.note);
    console.log(dataJSON.note);
    res.end("notes saved successfully!");
  });
}

function saveNotes(data) {}

function getNotesData() {}
server.listen(port, () => {
  console.log("server created successfully");
  console.log(`server at : http://localhost:${port}`);
});
