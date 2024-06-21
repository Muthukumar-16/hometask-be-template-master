const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

const { sequelize } = require("./model");
const routes = require("./router");

const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use(express.static(path.join(__dirname, '/../client/build')));
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

app.use(routes);

module.exports = app;
