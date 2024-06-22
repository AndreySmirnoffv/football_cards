require('dotenv').config({path: "../modules/.env"})
const express = require('express')
const app = express()


app.use(express.json());


app.post('/', (req, res) => {
    console.log(req.body);
    console.log(res.body)
    res.status(200).send('Request received', "req: " + req + "\nres: " + res);
});

app.listen(process.env.PORT, () => console.log("server started on port: " + process.env.PORT))