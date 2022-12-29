const myVideo = document.createElement('video')
myVideo.setAttribute("width", "400");
myVideo.setAttribute("height", "300");
myVideo.setAttribute("object-fit", "cover");

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
})

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    document.getElementById('video-grid').append(video)
}
