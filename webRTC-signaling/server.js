const fs = require("fs");
const https = require("https");
const express = require("express");
const socketio = require("socket.io");

const app = express();

const key = fs.readFileSync("./certs/cert.key");
const cert = fs.readFileSync("./certs/cert.crt");

const secureExpressServer = https.createServer({ key, cert }, app);

const PORT = process.env.PORT || 8080;

secureExpressServer.listen(8080, () => {
  console.log(`Server is listening at https://localhost:${PORT}`);
});

const io = socketio(secureExpressServer, {
  cors: ["https://localhost:5173/"],
  methods: ["GET", "POST"],
});

io.on("connection", (socket) => {
  console.log(`${socket.id} is user connected`);
});
