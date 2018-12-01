// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Basic Pitch Detection
=== */

let audioContext;
let mic;
let pitch;
let vol = 0;
let drawPitch = 0;

let drawing = [];
let x = 50;
let hPsmooth = 0;
let hP = 0;


function setup() {
  createCanvas(800, 400);
  background(0);

  audioContext = getAudioContext();
  // Create an Audio input
  mic = new p5.AudioIn();
  // start the Audio Input and pitch
  // By default, it does not .connect() (to the computer speakers)
  mic.start(startPitch);
}

function draw() {
  // Get the overall volume (between 0 and 1.0)
  vol = mic.getLevel();

  fill(255);
  noStroke();

  let h = map(vol, 0, 1, -100, 100);

  if (vol > 0.25) {
    hP = map(drawPitch, 0, 500, 100, -100);
  } else {
    hP = 0;
  }


  hPsmooth = lerp(hPsmooth, hP, 0.15);

  if (hP > 85) {
    x-= 0.5;
  } else if (hP < -50){
    x-= 0.5;
  } else {
    x+= 1;
  }


  drawLine(x, hPsmooth*vol+100);

  select('#result2').html(hP);

}

function startPitch() {
  pitch = ml5.pitchDetection('./model/', audioContext , mic.stream, modelLoaded);
}

function modelLoaded() {
  select('#status').html('Model Loaded');
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      select('#result').html(frequency);
      drawPitch = frequency;
    } else {
      select('#result').html('No pitch detected');
      // select('#result2').html('No pitch detected');
    }
    getPitch();
  })
}

function drawLine(micX, micY){
    // check if line begun
    if(vol>0){
        var point = {
            x: micX,
            y: micY,

        }
        // add points to drawing
        drawing.push(point);
    }
    beginShape();
    stroke(230);
    strokeWeight(1);
    noFill();
    push();
    for(var i=0; i<drawing.length; i++){
        vertex(drawing[i].x,drawing[i].y);
    }
    endShape();
    pop();
}
