let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let vol = document.getElementById("volume");
let volout = document.getElementById("volumeOut");

vol.oninput = function(){
    let val = vol.value;
    volout.innerHTML = val+"%";

    game.options.sound.enabled = val <= 0 ? false:true;
    game.options.sound.volume = val/100;
}

class Sprite{
    constructor(src){
        this.img = new Image();
        this.img.src = src;
        this.width = this.img.width;
        this.height = this.img.height;
    }
    draw(x,y){
        ctx.drawImage(this.img,x,y);
    }
    loaded(){
        return this.img.complete;
    }
}

class Bird extends Sprite{
    constructor(){
        super("sources/bird.png");
        this.start ={
            x:10,
            y:150,
        };
        this.reset();
    }
    reset(){
        this.x = this.start.x;
        this.y = this.start.y;
    }

}

class Game{
    constructor(options){
        this.options = options;
    }
    playSound(src){
        if(this.options.sound.enabled)
        {
            let a = new Audio();
            a.src = src;
            a.volume = this.options.sound.volume;
            a.play();
            a.onended = ()=>a.remove();
        }
    }
}

let options = {
    sound:{
        enabled:true,
        volume: vol.value/100,
    }
}

let game = new Game(options);

let bird = new Bird();

// load images

let bg = new Sprite("sources/bg.png");
let fg = new Sprite("sources/fg.png");
let pipeNorth = new Sprite("sources/pipeNorth.png");
let pipeSouth = new Sprite("sources/pipeSouth.png");

// some variables
let gap = 90;
let constant;

let lift = -4.5;
let velocity = 0;     
let maxvelocity = 4.5;
let gravity = 0.25;

let score = 0;
let highscore = score;

// audio files

let cyka = "sources/cyka.mp3";

let fly = "sources/ouh.mp3";

let scor = "sources/bruh.mp3";

// on key down

document.addEventListener("keydown",moveUp);

function restart(){
    bird.reset();
	velocity = 0;
	score = 0;
	pipe.splice(0,pipe.length);
	pipe[0] = {
		x : canvas.width,
		y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
	};
}
function moveUp(){
	velocity = 0;
    velocity += lift;
    game.playSound(fly);
}

// pipe coordinates

let pipe = [];

pipe[0] = {
    x : canvas.width,
    y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
};

// draw images
let loaded = false;

function draw(){
    if(!loaded){
        if(bg.loaded() && fg.loaded() && pipeNorth.loaded() && pipeSouth.loaded() && bird.loaded())
        {
            loaded = true;
        }
    }else
    {
        bg.draw(0,0);

        for(let i = 0; i < pipe.length; i++){
            
            constant = pipeNorth.height+gap;
            pipeNorth.draw(pipe[i].x,pipe[i].y);
            pipeSouth.draw(pipe[i].x,pipe[i].y+constant);
                 
            pipe[i].x--;
            
            if( pipe[i].x == 80 ){
                pipe.push({
                    x : canvas.width,
                    y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
                }); 
            }
    
            // detect collision
            
            if( bird.x + bird.width >= pipe[i].x && bird.x <= pipe[i].x + pipeNorth.width && (bird.y <= pipe[i].y + pipeNorth.height || bird.y+bird.height >= pipe[i].y+constant) || bird.y + bird.height >=  canvas.height - fg.height){
                if (score > highscore){
                    highscore = score;
                }
                restart(); // reload the page
                game.playSound(cyka);
                break;
            }
            if(pipe[i].x == 5){
                score++;
                game.playSound(scor);
            }
            
            
        }
    
        fg.draw(0,canvas.height - fg.height);
        
        bird.draw(bird.x,bird.y);
        
        velocity += gravity;
        if(velocity > maxvelocity){
            velocity = maxvelocity;
        }
        bird.y += velocity;
        
        ctx.fillStyle = "#000";
        ctx.font = "20px Verdana";
        ctx.fillText("Score : "+score,10,canvas.height-60);
        ctx.fillText("Highscore : "+highscore,10,canvas.height-20);
    }
}
restart();
let interval = setInterval(draw, 13);
