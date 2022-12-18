var express = require('express');
var bodyParser = require('body-parser');

var app = express();

require('./mongo');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '1gb', extended: false }));

var todo = require('./routes/todos')(express.Router(), Todos);

app.use('/', todo);

app.listen(4000, () => console.log('Server On 4000'));