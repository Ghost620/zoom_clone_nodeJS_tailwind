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
})

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: 3000
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
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
