require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router').router;

const app = express();

app.use(cors())
app.use(bodyParser.json()); // To read data in json format.

app.use('/api', router);
module.exports = {
    app
}
if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT || 5000, () => console.log(`Listening on port ${process.env.port || 5000 }`))
}