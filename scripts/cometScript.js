const body = document.body;
let sky = document.createElement('div');
sky.className = 'sky';
body.appendChild(sky);

class CreateComet{
    constructor(container){
        this.sky = container;
        this.comet = document.createElement('div');
        this.newComet(this.sky);
        this.killDuration = parseInt(getComputedStyle(this.sky.querySelector('.comet'))
                            .getPropertyValue('--moveDuration').slice(0, -1)) * 3000;
        this.deleteObject = debounce(this.kill, this.killDuration);
        this.deleteObject(this.sky, this.comet);
    }
    newComet(parent){
        this.comet.className = 'comet';
        this.comet.innerHTML = `<div class="comet-head">
                                <div class="box front"></div>
                                <div class="box back"></div>
                                <div class="box top"></div>
                                <div class="box bottom"></div>
                                <div class="box left"></div>
                                <div class="box right"></div>
                            </div>
                            <div class="comet-tail">
                                <div class="arc"></div>
                                <div class="main-tail"></div>
                                <div class="main-tail sub1"></div>
                                <div class="main-tail sub2"></div>
                                <div class="main-tail sub3"></div>
                                <div class="main-tail sub4"></div>
                            </div>       
                        </div>`;
        this.comet.style.left = this.randomize(true, false, false) + 'vw';
        this.comet.style.setProperty('--moveDuration', this.randomize(false, true, false) + 's');
        let size = this.randomize(false, false, true)
        this.comet.style.setProperty('--size', size + 'vw');
        this.comet.style.setProperty('z-index', size);
        parent.appendChild(this.comet);
    }
    randomize(position, duration, size){
        if(position){
            return randomInt(0, 81);
        }else if(duration){
            return randomInt(3, 31);
        }else if(size){
            return randomInt(2, 21);
        }
    }
    kill(sky, comet){
        sky.removeChild(comet);
    }
}

function randomInt(min, max) { // [min,max)
    return Math.floor(Math.random() * (max - min) + min);
}

const debounce = (fn, delay) => {
    let timeoutId;

    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(() => {
            fn.apply(null, args);
        }, delay);
    };
};

function strPorpertyToNumber(str){
    return ;
    
}

let nIntervId;

function crtC() {
  // check if an interval has already been set up
  if (!nIntervId) {
    nIntervId = setInterval(() => {
        new CreateComet(sky);
    }, 4000);
  }
}

crtC();