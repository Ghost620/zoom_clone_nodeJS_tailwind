const express = require('express');
const { v4: uuidv4} = require('uuid')

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.status(200).redirect(`/${uuidv4()}`)
})

app.get('/:romm', (req, res) => {
    res.status(200).render('room', { roomId: req.params.room })
})

io.on('connection', (socket) => {
    socket.on('join-room', () => {
        console.log('Room joined !')
    })
})

server.listen(3000);