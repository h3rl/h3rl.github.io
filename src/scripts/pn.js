window.onload = function(){

var pnDiv = document.querySelector('#particle-canvas');
var canvas = document.createElement("canvas");
pnDiv.appendChild(canvas);
var ctx = canvas.getContext('2d');
const pw = 1980;
const ph = 1080;

const options = {
    drawparticle: false,
    particleWidth: .7,
    particleSize: 2,
    particleAlpha: .4,
    particleColor: '#fff',
    maxDistance: 200,
    interactive: true,
    velocity: 0.1,
    density: 12000,
};

var pnDivSize = {
    width:0,
    height:0,
}

canvas.width = pnDivSize.width = pnDiv.offsetWidth;
canvas.height = pnDivSize.height = pnDiv.offsetHeight;

class Particle{
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.velocity = {
            x: (Math.random() - 0.5) * options.velocity,
            y: (Math.random() - 0.5) * options.velocity
        };
    }
    update() {

        // Change dir if outside map
        if (this.x > canvas.width + 20 || this.x < -20) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y > canvas.height + 20 || this.y < -20) {
            this.velocity.y = -this.velocity.y;
        }

        // Update position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    draw() {
        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = options.particleColor;
        ctx.globalAlpha = options.particleAlpha;
        ctx.arc(this.x, this.y, options.particleSize, 0, 2 * Math.PI);
        ctx.fill();
    }

}

function setStyles(elem, styles) {
    for (var property in styles) {
        elem.style[property] = styles[property];
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        if(options.drawparticle){
            particles[i].draw();
        }

        // Draw connections
        for (var j = particles.length - 1; j > i; j--) {
            var distance = Math.sqrt(
                Math.pow(particles[i].x - particles[j].x, 2) +
                Math.pow(particles[i].y - particles[j].y, 2)
            );
            if (distance > options.maxDistance) {
                continue;
            }

            ctx.beginPath();
            ctx.strokeStyle = options.particleColor;
            ctx.globalAlpha = (options.maxDistance - distance) / options.maxDistance;
            ctx.lineWidth = options.particleWidth;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
        }
    }

    if (options.velocity !== 0) {
        requestAnimationFrame(update);
    }
}


var particles = [];

window.addEventListener('resize', function() {

    // Check if div has changed size
    if (pnDiv.offsetWidth === pnDivSize.width && pnDiv.offsetHeight === pnDivSize.height) {
        return false;
    }

    // Scale canvas
    canvas.width = pnDivSize.width = pnDiv.offsetWidth;
    canvas.height = pnDivSize.height = pnDiv.offsetHeight;

    // Reset particles
    particles = [];
    for (var i = 0; i < canvas.width * canvas.height / options.density; i++) {
        particles.push(new Particle());
    }
    if (options.interactive) {
        particles.push(mouseParticle);
    }

    canvas
    // Update canvas
    //requestAnimationFrame(update);

    if(window.innerHeight / ph > window.innerWidth / pw)
    {
        canvas.style.backgroundSize = "auto 100%";
    }else{
        canvas.style.backgroundSize = "100% auto";
    }

});

for (var i = 0; i < canvas.width * canvas.height / options.density; i++) {
    particles.push(new Particle());
}

var mouseParticle;

if (options.interactive) {

    // Add mouse particle if interactive
    mouseParticle = new Particle();
    mouseParticle.velocity = {
        x: 0,
        y: 0
    };
    particles.push(mouseParticle);

    // Mouse event listeners
    window.addEventListener('mousemove', function(e) {
        mouseParticle.x = e.clientX - canvas.offsetLeft;
        mouseParticle.y = e.clientY - canvas.offsetTop;
    });

    window.addEventListener('mouseup', function(e) {
        mouseParticle.velocity = {
            x: (Math.random() - 0.5) * options.velocity,
            y: (Math.random() - 0.5) * options.velocity
        };
        mouseParticle = new Particle();
        mouseParticle.velocity = {
            x: 0,
            y: 0
        };
        particles.push(mouseParticle);
        mouseParticle.x = e.clientX - canvas.offsetLeft;
        mouseParticle.y = e.clientY - canvas.offsetTop;
    });
}



if(window.innerHeight / ph > window.innerWidth / pw)
{
    canvas.style.backgroundSize = "auto 100%";
}else{
    canvas.style.backgroundSize = "100% auto";
}

// Update canvas
requestAnimationFrame(update);

}