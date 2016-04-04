var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/../client'));

app.get('/', function (req, res) {
  	res.render('index');
});

app.post('/', function (req, res) {

});

app.listen(3000, function () {
  	console.log('listening on port 3000');
});