"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var vol = document.getElementById("volume");
var volout = document.getElementById("volumeOut");

vol.oninput = function () {
  var val = vol.value;
  volout.innerHTML = val + "%";
  game.options.sound.enabled = val <= 0 ? false : true;
  game.options.sound.volume = val / 100;
};

var Sprite =
/*#__PURE__*/
function () {
  function Sprite(src) {
    _classCallCheck(this, Sprite);

    this.img = new Image();
    this.img.src = src;
    this.width = this.img.width;
    this.height = this.img.height;
  }

  _createClass(Sprite, [{
    key: "draw",
    value: function draw(x, y) {
      ctx.drawImage(this.img, x, y);
    }
  }, {
    key: "loaded",
    value: function loaded() {
      return this.img.complete;
    }
  }]);

  return Sprite;
}();

var Bird =
/*#__PURE__*/
function (_Sprite) {
  _inherits(Bird, _Sprite);

  function Bird() {
    var _this;

    _classCallCheck(this, Bird);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Bird).call(this, "sources/bird.png"));
    _this.start = {
      x: 10,
      y: 150
    };

    _this.reset();

    return _this;
  }

  _createClass(Bird, [{
    key: "reset",
    value: function reset() {
      this.x = this.start.x;
      this.y = this.start.y;
    }
  }]);

  return Bird;
}(Sprite);

var Game =
/*#__PURE__*/
function () {
  function Game(options) {
    _classCallCheck(this, Game);

    this.options = options;
  }

  _createClass(Game, [{
    key: "playSound",
    value: function playSound(src) {
      if (this.options.sound.enabled) {
        var a = new Audio();
        a.src = src;
        a.volume = this.options.sound.volume;
        a.play();

        a.onended = function () {
          return a.remove();
        };
      }
    }
  }]);

  return Game;
}();

var options = {
  sound: {
    enabled: true,
    volume: vol.value / 100
  }
};
var game = new Game(options);
var bird = new Bird(); // load images

var bg = new Sprite("sources/bg.png");
var fg = new Sprite("sources/fg.png");
var pipeNorth = new Sprite("sources/pipeNorth.png");
var pipeSouth = new Sprite("sources/pipeSouth.png"); // some variables

var gap = 90;
var constant;
var lift = -4.5;
var velocity = 0;
var maxvelocity = 4.5;
var gravity = 0.25;
var score = 0;
var highscore = score; // audio files

var cyka = "sources/cyka.mp3";
var fly = "sources/ouh.mp3";
var scor = "sources/bruh.mp3"; // on key down

document.addEventListener("keydown", moveUp);

function restart() {
  bird.reset();
  velocity = 0;
  score = 0;
  pipe.splice(0, pipe.length);
  pipe[0] = {
    x: canvas.width,
    y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
  };
}

function moveUp() {
  velocity = 0;
  velocity += lift;
  game.playSound(fly);
} // pipe coordinates


var pipe = [];
pipe[0] = {
  x: canvas.width,
  y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
}; // draw images

var loaded = false;

function draw() {
  if (!loaded) {
    if (bg.loaded() && fg.loaded() && pipeNorth.loaded() && pipeSouth.loaded() && bird.loaded()) {
      loaded = true;
    }
  } else {
    bg.draw(0, 0);

    for (var i = 0; i < pipe.length; i++) {
      constant = pipeNorth.height + gap;
      pipeNorth.draw(pipe[i].x, pipe[i].y);
      pipeSouth.draw(pipe[i].x, pipe[i].y + constant);
      pipe[i].x--;

      if (pipe[i].x == 80) {
        pipe.push({
          x: canvas.width,
          y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
        });
      } // detect collision


      if (bird.x + bird.width >= pipe[i].x && bird.x <= pipe[i].x + pipeNorth.width && (bird.y <= pipe[i].y + pipeNorth.height || bird.y + bird.height >= pipe[i].y + constant) || bird.y + bird.height >= canvas.height - fg.height) {
        if (score > highscore) {
          highscore = score;
        }

        restart(); // reload the page

        game.playSound(cyka);
        break;
      }

      if (pipe[i].x == 5) {
        score++;
        game.playSound(scor);
      }
    }

    fg.draw(0, canvas.height - fg.height);
    bird.draw(bird.x, bird.y);
    velocity += gravity;

    if (velocity > maxvelocity) {
      velocity = maxvelocity;
    }

    bird.y += velocity;
    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, canvas.height - 60);
    ctx.fillText("Highscore : " + highscore, 10, canvas.height - 20);
  }
}

restart();
var interval = setInterval(draw, 13);