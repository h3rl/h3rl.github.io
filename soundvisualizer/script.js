var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var audio = document.querySelector("audio")
var ctrl = document.querySelector("#audioctrl");
var slider = document.querySelector("input[type=range]");
var outvolume = document.querySelector("#volout");
var songselect = document.querySelector("#songselect");

var options = {
    samples:Math.pow(2,10),
    start:7,
    length:2,
    difference:18,
    minbass:225,
    radius:{
        min:70,
        max:120,
        sizemultiplier: 0.998
    },
    bars:100,
    ambientmodifier:10,
}

var offsetRadius = options.radius.min;

var context = new AudioContext();
var analyser = context.createAnalyser();
analyser.fftSize = Math.pow(2,11);
analyser.smoothingTimeConstant = .82;

context.createMediaElementSource(audio).connect(analyser);
analyser.connect(context.destination);

var freqsArr = new Array();

window.onload = window.onresize = function(){
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    requestAnimationFrame(draw);
}

ctrl.onclick = toggleAudio;
ctrl.innerText = "play";

var enabled = false;
function toggleAudio(){
    if(!enabled){
        ctrl.innerText = "mute";
        audio.play();
        context.resume().then(function(){
            requestAnimationFrame(draw);
        });
    }else{
        ctrl.innerText = "resume";
        audio.pause();
        context.suspend();
    }
    enabled = !enabled;
}

Uint8Array.prototype.getAvg = function(start,len){
    var avg = 0, cnt = 0;
    for(var j = start; j < start+len-1; j++)
    {
        avg += this[j];
        cnt += 1;
    }
    return Math.ceil(avg/cnt);
}

function draw(){
    var oldfreqs;
    if(freqsArr.unshift(new Uint8Array(analyser.frequencyBinCount)) > 3){
        oldfreqs = new Uint8Array(freqsArr.pop());
    }else{
        oldfreqs = new Uint8Array(freqsArr[freqsArr.length-1]);
    }
    analyser.getByteFrequencyData(freqsArr[0]);
    var freqs = freqsArr[0];

    var bassavg_old = oldfreqs.getAvg(options.start,options.length);
    var bassavg_new = freqs.getAvg(options.start,options.length);
    var difference = bassavg_new - bassavg_old;

    // Check if diffrence is bigger than options.diffrence
    // AND that the peak is more than minbass
    if(difference >= options.difference && bassavg_new >= options.minbass){
        // Set radius to clamped value
        offsetRadius = bassavg_new/255*options.radius.max;
    }else{
        //else make rad smaller and 
        offsetRadius *= options.radius.sizemultiplier;

        // check that radius is more than least possible rad
        if(offsetRadius < options.radius.min){
            offsetRadius = options.radius.min;
        }
    }

    // Helpers
    let w = canvas.width;
    let h = canvas.height;
    let bars = options.bars;

    // Clamp bassavg_new to a value in 0-60
    var size = (bassavg_new/255)*60;

    // Make everything transparent before drawing
    ctx.clearRect(0,0,w,h);

    // Create "ambiend"
    canvas.style.background = `radial-gradient(#000, rgb(${size},0,0))`;

    //fill center
    ctx.fillStyle = "black"
    ctx.arc(w/2,h/2,offsetRadius,0,2*Math.PI);
    ctx.fill();

    // Draw bars
    let radians = (Math.PI * 2) / bars;
    
    for (var i = 0; i < bars; i++) {

        let color = `rgb(255,${(255/bars*i)},0)`

        let barI = Math.floor((freqs.length * 0.6)/bars) * i;

        let bar_height = freqs[barI] * 0.5;

        let x = w / 2 + Math.cos(radians * i) * offsetRadius;
        let y = h / 2 + Math.sin(radians * i) * offsetRadius;
        let x_end =
            w / 2 + Math.cos(radians * i) * (offsetRadius + bar_height);
        let y_end =
            h / 2 + Math.sin(radians * i) * (offsetRadius + bar_height);

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x_end, y_end);
        ctx.stroke();
    }
    
    requestAnimationFrame(draw);
}

slider.oninput = function(){
    outvolume.innerHTML = slider.value + "%"
    audio.volume = slider.value/100;
}

songselect.onchange = function(){
    var song = songselect.value;
    if(enabled){
        toggleAudio();
    }
    audio.src = "../src/audio/"+song+".mp3";
    audio.load();
    ctrl.innerText = "play";
}