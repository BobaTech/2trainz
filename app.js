var express = require("express");

var app = express(),
    port = process.env.PORT || "1138",
    ip = process.env.IP || "127.0.0.1";

app.use(express.static("./"));

app.all("/*", function(req, res) {
    res.sendFile("index.html", { root: "./" });
});

app.listen(port, ip);
