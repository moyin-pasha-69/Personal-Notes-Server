const http = require("http");
const path = require("path");
const notesPathJson = path.join("data", "notes.json");
const notesPath = "./notes.txt";
const fs = require("fs");
const { error, log } = require("console");
const { domainToASCII } = require("url");

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
  } else {
    res.statusCode = 404;
    res.end("File not found");
  }
});

function renderData(res) {
  const data = loadNotes();
  res.setHeader("Content-Type", "text/plain");
  if (data.length == 0) {
    res.end("There is no notes!");
  } else {
    data.forEach((val) => {
      res.write(`${val.id}. ${val.note}\n`);
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
    saveNotes(data, res);
  });
}

function saveNotes(val, res) {
  const data = loadNotes();
  const ans = data.filter((data) => data.note == val);
  if (ans.length == 0) {
    const index = data.length;
    const obj = {
      id: index + 1,
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

server.listen(port, () => {
  console.log("Welcome to my server");
});
