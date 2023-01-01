const socket = io('/')

const addVideoElement = () => {
    const video = document.createElement('video')
    video.setAttribute("width", "400");
    video.setAttribute("height", "300");
    video.setAttribute("object-fit", "cover");
    return video
}

const myVideo = addVideoElement()
const peers = {}

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

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
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

    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
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


// Mute Unmute Mic

const setMuteButton = () => {
    const html = `
        <i class="fa-solid fa-microphone-lines"></i>
        <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html
}

const setUnmuteButtton = () => {
    const html = `
        <i class="unmute fa-solid fa-microphone-lines-slash text-red-600"></i>
        <span class="text-red-200">Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html
}

const muteUnmute = () => {

    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButtton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0] = true;
    }

}


// Stop Play Video 

const setPlayVideo = () => {
    const html = `
        <i class="stop fa-solid fa-video-slash text-red-600"></i>
        <span class="text-red-200">Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html
}

const setStopVideo = () => {
    const html = `
        <i class="fa-solid fa-video"></i>
        <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html
}

const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        setStopVideo();
        myVideoStream.geVideoTracks()[0] = true;
    }
}