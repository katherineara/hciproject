// var socket = new WebSocket("ws://172.28.142.145:8888/frames");
// var host = "172.28.142.145:8888";

var socket = new WebSocket("ws://172.29.41.16:8888/frames");
var host = "172.29.41.16:8888";

var isStretching = false;

$(document).ready(function () {
    homepage();
    // twod.start(); // Shows the Camera
    frames.start();
});

// Four Functions
// Homepage
// Stretch1
// Stretch2
// Stretch3
// End Page

function homepage() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    ctx.font = "30px Arial";
    ctx.fillText("Speed Stretch", 350, 50);

    var img = document.getElementById("stretchimage");
    ctx.drawImage(img,130,70,600,200);
}

function stretch1() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    ctx.font = "30px Arial";
    ctx.fillText("Stretch 1", 10, 50);

    // Next Page
    setTimeout(stretch2, 5000);
}

function stretch2() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    ctx.font = "30px Arial";
    ctx.fillText("Stretch 2", 10, 50);

    // Next Page
    setTimeout(stretch3, 5000);
}


function stretch3() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    ctx.font = "30px Arial";
    ctx.fillText("Stretch 3", 10, 50);

    // Next Page
    setTimeout(endingPage, 5000);
}

function endingPage() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    ctx.font = "30px Arial";
    ctx.fillText("Great job!", 10, 50);

    // Set Stretching back to False
    isStretching = false;

    // Next Page
    setTimeout(homepage, 5000);
}

var frames = {
    socket: null,

    start: function () {
        var url = "ws://" + host + "/frames";
        frames.socket = new WebSocket(url);
        frames.socket.onmessage = function (event) {
            frames.show(JSON.parse(event.data));
        }
    },

    show: function (frame) {
        if (!isStretching)
        {
            if (frame.people) {
                var num_people = Object.keys(frame.people).length;

                for (const [idx, person] of Object.entries(frame.people)) {
                    console.log(person);
                    var rWrist = person.keypoints["RWrist"];
                    var rShoulder = person.keypoints["RShoulder"];
                    var distance = person.avg_position[2];

                    // If the person is close to the screen
                    if ((distance < 5000) && rWrist && rShoulder)
                    {
                        var rWrist_yPosition = rWrist[1];
                        var rShoulder_yPosition = rShoulder[1];

                        // If the person is raising their hand (wrist higher than shoulder)
                        if (rWrist_yPosition <= rShoulder_yPosition)
                        {
                            // Set Stretching to True
                            isStretching = true;

                            // Begin Stretch Pages
                            stretch1();
                        }
                    }
                }
            }
        }
    }
};


// SHOWS THE CAMERA ON THE SCREEN
var twod = {
    socket: null,

    // create a connection to the camera feed
    start: function () {
        var url = "ws://" + host + "/twod";
        twod.socket = new WebSocket(url);

        // whenever a new frame is received...
        twod.socket.onmessage = function (event) {

            // parse and show the raw data
            twod.show(JSON.parse(event.data));
        }
    },

    // show the image by adjusting the source attribute of the HTML img object previously created
    show: function (twod) {
        $('img.twod').attr("src", 'data:image/pnjpegg;base64,' + twod.src);
    },
};
