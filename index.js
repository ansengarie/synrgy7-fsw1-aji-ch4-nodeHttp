const http = require("http");
const fs = require("fs");

let people = [];
try {
  const data = fs.readFileSync("source/people.json");
  people = JSON.parse(data);
} catch (error) {
  console.error("Error reading people file:", error);
}

const savePeople = () => {
  fs.writeFile("source/people.json", JSON.stringify(people, null, 2), (err) => {
    if (err) {
      console.error("Error writing people file:", err);
    }
  });
};

const getListPeople = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(people));
};

const getDetailPeople = (req, res) => {
  const id = req.url.split("/")[2];
  const person = people.find((p) => p.id === parseInt(id));
  person ? res.end(JSON.stringify(person)) : notFound(res);
};

const deletePeople = (req, res) => {
  const id = req.url.split("/")[2];
  const index = people.findIndex((p) => p.id === parseInt(id));
  if (index !== -1) {
    people.splice(index, 1);
    savePeople();
    res.end("Person deleted successfully");
  } else {
    notFound(res);
  }
};

const notFound = (res) => {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
};

const handleRequest = (req, res) => {
  const { method, url } = req;
  if (method === "GET" && url === "/people") {
    getListPeople(req, res);
  } else if (method === "GET" && url.startsWith("/people/")) {
    getDetailPeople(req, res);
  } else if (method === "DELETE" && url.startsWith("/people/")) {
    deletePeople(req, res);
  } else {
    notFound(res);
  }
};

const server = http.createServer(handleRequest);
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
