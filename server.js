import express from "express";
import http from "http";
import bodyParser from "body-parser";
import path from "path";
import hbs from "express-handlebars";
import router from "./routes";
import mysql from "mysql";
import socketIo from "socket.io";

const app = express();

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials")
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

global.connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "teamtengu1",
  database: "colourandpoint"
});

global.connection.connect();

const server = http.Server(app);
global.io = socketIo(server);

server.listen(80);
