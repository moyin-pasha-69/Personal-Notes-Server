const http = require("http");
const path = require("path");
const dataFilePath = "./data/notes.txt";
const fs = require("fs");

const port = 3000;
const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  console.log("Welcome to My Notes Server");
  const notesPath = path.join("data", "notes.txt");
  if (req.method == "GET" && req.url == "/notes") {
    try {
      const dataBuffer = fs.readFileSync(notesPath);
      const data = dataBuffer.toString();
      res.setHeader("Content-Type", "text/plain");
      res.write(data);
    } catch (error) {
      res.statusCode = 500;
      res.end("Failed to  get file");
    }
  }
});

server.listen(port, () => {
  console.log("server created successfully");
  console.log(`server at : http://localhost:${port}`);
});
