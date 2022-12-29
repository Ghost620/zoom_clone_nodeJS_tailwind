const express = require('express');
const { v4: uuidv4} = require('uuid')

const app = express();
const server = require('http').Server(app);

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.status(200).render('room')
})

app.get('/:romm', (req, res) => {
    res.status(200).render('room', { roomId: req.params.room })
})

server.listen(3000);