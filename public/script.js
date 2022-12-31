const socket = io('/')

const addVideoElement = () => {
    const video = document.createElement('video')
    video.setAttribute("width", "400");
    video.setAttribute("height", "300");
    video.setAttribute("object-fit", "cover");
    return video
}

const myVideo = addVideoElement()

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    peer.on('call', (call) => {
        call.answer(stream)
        const video = addVideoElement()
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })

})

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: 3000
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
    console.log(` ROOM JOINED : ${id}`)
})

socket.on('user-connected', (userId) => {
    connectToNewUser(userId, stream);
})

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = addVideoElement()
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    document.getElementById('video-grid').append(video)
}

$('html').keydown((e) => {
    if (e.which == 13 && document.querySelector('input').value.length !== 0) {
        socket.emit('message', document.querySelector('input').value)
        document.querySelector('input').value = ''
    }
})

socket.on('createMessage', (message) => {
    $('.messages').append(`<li class="message text-md"><b>user</b><br/> <span class="text-sm"> ${message} </span> </li>`)
    scrollToBottom()
})

const scrollToBottom = () => {
    let d = $('.main_chat_window')
    d.scrollTop(d.prop("scrollHeight"))
}

