const express = require('express');
const app = express();

const logger = require('morgan');
const path = require('path');
app.use(logger('dev'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));


const PORT = 3000;
const DOMAIN = 'localhost';
app.listen(PORT, DOMAIN, function () {
    console.log(`The server is running at http://${DOMAIN}:${PORT}`);
});