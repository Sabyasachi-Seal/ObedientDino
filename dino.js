import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const dinoElem = document.querySelector("[data-dino]");
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100

let isJumping;
let dinoFrame
let currentFrameTime
let yVelocity

let speechRecognition = new webkitSpeechRecognition();
speechRecognition.continuous = true;
speechRecognition.interimResults = true;

const event = new Event('speech', { bubbles: true, cancelable: false });


function checkSpeech(){
    let final_transcript = "";
    speechRecognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript = event.results[i][0].transcript;
            }
        }
        if(final_transcript == 'hello') { document.dispatchEvent('speech') }
        document.querySelector("#final").innerHTML = final_transcript;
    };
}

export function setupDino(){
    currentFrameTime = 0;
    isJumping = false
    dinoFrame = 0
    yVelocity = 0
    setCustomProperty(dinoElem, "--bottom", 0)
    document.removeEventListener("keydown", onJump)
    document.addEventListener("keydown", onJump)
    document.addEventListener("speech", onJump)
    speechRecognition.start(); 
}

export function updateDino(delta, speedScale){
    checkSpeech()
    handleRun(delta, speedScale)
    handleJump(delta)
}

export function getDinoRects() {
    return dinoElem.getBoundingClientRect()
  }

function handleRun(delta, speedScale){
    if(isJumping)   {
        dinoElem.src = "img/dino-stationary.png"
        return
    }
    if(currentFrameTime >= FRAME_TIME){
        dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
        dinoElem.src = `img/dino-run-${dinoFrame}.png`
        currentFrameTime -= FRAME_TIME
    }
    currentFrameTime += delta * speedScale
    
}

function handleJump(delta){
    if(!isJumping){
        return
    }

    incrementCustomProperty(dinoElem, "--bottom", yVelocity* delta)

    if(getCustomProperty(dinoElem, "--bottom") <= 0){
        setCustomProperty(dinoElem, "--bottom", 0)
        isJumping = false;
    }
    yVelocity -= GRAVITY * delta
}

function onJump(e){
    console.log("hello* ${}")
    if (e.code  !== "Space" || isJumping){
        return
    }

    yVelocity = JUMP_SPEED
    isJumping = true
}

export function setDinoLose(){
    dinoElem.src = "img/dino-lose.png"
}