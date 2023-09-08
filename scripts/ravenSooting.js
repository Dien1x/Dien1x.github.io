/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('raven');
const ctx = canvas.getContext('2d');
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');

let CANVAS_WIDTH = canvas.width = window.innerWidth;
let CANVAS_HEIGHT = canvas.height = window.innerHeight;
let COLLISION_CANVAS_WIDTH = collisionCanvas.width = window.innerWidth;
let COLLISION_CANVAS_HEIGHT = collisionCanvas.height = window.innerHeight;
let fontSize = CANVAS_WIDTH / 38.4;

ctx.font = fontSize + 'px Impact';

let timeToNextRaven = 0;
const ravenInterval = 500;
let lastTime = 0;

let score = 0;
let gameOver = false;

window.addEventListener('resize', () => {
    CANVAS_WIDTH = canvas.width = window.innerWidth;
    CANVAS_HEIGHT = canvas.height = window.innerHeight;
    COLLISION_CANVAS_WIDTH = collisionCanvas.width = window.innerWidth;
    COLLISION_CANVAS_HEIGHT = collisionCanvas.height = window.innerHeight;
    fontSize = CANVAS_WIDTH / 38.4;
    ctx.font = fontSize + 'px Impact';
    if(gameOver) drawGameOver();
})

let ravens = [];
let explosions = [];
let partcles = [];

class Raven{
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier * CANVAS_WIDTH / 1920 ;
        this.height = this.spriteHeight * this.sizeModifier * CANVAS_WIDTH / 1920;
        this.x = CANVAS_WIDTH;
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        this.directionX = Math.random() * 2 + 3;
        this.directionY = Math.random() * 5 - 2.5;       
        this.image = new Image();
        this.image.src = 'images/raven.png';
        this.markedForDeletion = false
        this.frame = 0;
        this.nextFrame = Math.random() * 50 + 50;
        this.frameRate = 0;
        this.randomColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.ravenColor = 'rgb(' + this.randomColor[0] + ',' + this.randomColor[1] + ',' + this.randomColor[2] + ')'
    }
    update(delta){
        if(this.y < 0 || this.y > CANVAS_HEIGHT - this.height) this.directionY *= -1
        this.x -= this.directionX;
        this.y += this.directionY;
        this.frameRate += delta;
        if(this.x < 0 - this.width) this.markedForDeletion = true;
        if(this.frameRate > this.nextFrame){
            this.frame > 4 ? this.frame = 0 : this.frame++;
            this.frameRate = 0;
            for(let i = 0; i < 5; i++){
                partcles.push(new Particle(this.x + this.width * 0.5, this.y + this.height/2, this.width, this.ravenColor));
            }
        }
        if(this.x < 0 - this.width) gameOver = true;
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        collisionCtx.fillStyle = this.ravenColor;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Explosion{
    constructor(x, y, size){
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = this.spriteHeight * this.width / this.spriteWidth;
        this.image = new Image();
        this.image.src = 'images/boom.png'
        this.sound = new Audio();
        this.sound.src = 'sound/ice_attack.wav'
        this.frame = 0;
        this.timeToNextFrame = 200;
        this.nextFrame = 0;
        this.delete = false;
    }
    update(delta){
        if(this.frame === 0) this.sound.play();
        this.nextFrame += delta;
        if(this.nextFrame > this.timeToNextFrame){
            this.frame > 5 ? this.delete = true : this.frame++;
            this.nextFrame = 0;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

class Particle {
    constructor(x, y, size, color){
        this.x = x + Math.random() * 50 - 25;
        this.y = y + Math.random() * 50 - 25;
        this.size = size;
        this.color = color;
        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 50 + this.radius;
        this.delete = false;
        this.speed = Math.random() * 1 + 0.5;
    }
    update(){
        this.x += this.speed;
        this.radius += 0.5;
        if(this.radius > this.maxRadius - 0.5) this.delete = true;
    }
    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius/this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawScore(){
    ctx.fillStyle = 'black'
    ctx.fillText('Score :' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score :' + score, 55, 80);
}

function drawGameOver(){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER, your score is: ' + score, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER, your score is: ' + score, CANVAS_WIDTH/2+5, CANVAS_HEIGHT/2+5);
}

window.addEventListener('click', event => {
    const detectPixelColor = collisionCtx.getImageData(event.x, event.y, 1, 1);
    const clickData = detectPixelColor.data;
    ravens.forEach((raven) => {
        if (raven.randomColor[0] === clickData[0] && raven.randomColor[1] === clickData[1] && raven.randomColor[2] === clickData[2]){
            explosions.push(new Explosion(raven.x, raven.y, raven.width));
            raven.markedForDeletion = true;
            score++;
            console.log(explosions);
        }
    })
});

function animate(timestamp){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    collisionCtx.clearRect(0, 0, COLLISION_CANVAS_WIDTH, COLLISION_CANVAS_HEIGHT);
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        ravens.sort((a,b) => {return a.width - b.width})
        timeToNextRaven = 0;
    }
    drawScore();
    [...partcles,...ravens,...explosions].forEach(object => object.update(deltaTime));
    [...partcles,...ravens,...explosions].forEach(object => object.draw());
    ravens = ravens.filter(raven => !raven.markedForDeletion);
    explosions = explosions.filter(explosion => !explosion.delete);
    partcles = partcles.filter(partcle => !partcle.delete);
    if(!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
}

window.onload = animate(0);