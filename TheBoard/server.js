var http = require('http');
var port = process.env.port || 1337;

var express = require("express");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var app = express();
var controllers = require("./controllers");

app.set("view engine", "vash");

//flash for UI error handling
app.use(cookieParser());
app.use(session({secret:"TheBoardSession"}));
app.use(flash());

//need body-parser npm package. use for form data sending from vash(html) to controller
app.use(bodyParser.urlencoded());



//get with controller functionality and dependency engine
controllers.init(app);

//get for render with view engine
app.get("/", function(req,res) {
    res.render("index", { title: "Express + Vash" });
});



app.get("/api/user", function (req, res) {
    res.set("Content-Type", "application/json");
    res.send({ name: "Ajay", isAdmin: true, email: "ajay.kotnala@gmail.com" });
});

var server = http.createServer(app);
server.listen(port);


//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port);