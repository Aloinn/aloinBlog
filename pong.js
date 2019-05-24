var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

/*
        PONG + AI
        To make pong, you will need a player paddle, a ball, and an AI paddle
        Player paddle should have input left/right

        Ball should have collisions for sides and both enemy paddle and player paddle

        AI should be able to calculate where the ball lands and head to said position
*/

// PLAYER VARIABLES
var enter = false;

var playerX = canvas.width/2
var playerY = canvas.height - 20;
var playerSpeed = 5;
var playerWidth = 25;

var playerLeft = false;
var playerRight = false;

// INPUT CHECKER
function keyDownHandler(a) {
  if(a.which === 16){
    enter = true;
  }
  if(a.key == "Right" || a.key == "ArrowRight"){
    playerRight = true;
  }
  else if (a.key =="Left"||a.key =="ArrowLeft"){
    playerLeft = true;
  }
}

function keyUpHandler(a) {
  if(a.which === 16){
    enter = false;
  }
  if(a.key == "Right" || a.key == "ArrowRight"){
    playerRight = false;
  }
  else if (a.key =="Left"||a.key =="ArrowLeft"){
    playerLeft = false;
  }
}

// STEP EVENT FOR PLAYER
function stepPlayer(){
    if(playerLeft == true && playerX - playerWidth - playerSpeed > 0){
      playerX -= playerSpeed;
    } else if (playerRight == true && playerX + playerWidth + playerSpeed < canvas.width){
      playerX += playerSpeed;
    }
}

// DRAWING THE PLAYER
function drawPlayer(){
  ctx.beginPath();
  ctx.rect(playerX, playerY, playerWidth,5);
  ctx.rect(playerX, playerY, -playerWidth,5);
  ctx.fillStyle = "#00000";
  ctx.fill();
  ctx.closePath();
}

//ENEMY VARIABLES
var enemyX = canvas.width/2;
var enemyY = 20;
var enemySpeed = 4;
var enemyWidth = 25;

var enemyMTX = enemyX;

var enemyLeft = false;
var enemyRight = false;

//STEP EVENT FOR ENEMY
function stepEnemy(){
  if(Math.abs(enemyMTX-enemyX)>enemySpeed){
    AIMTW();
  }
}
//AI THINK EVENT FOR ENEMY
function AIThink(){

  //TIME IT TAKES BEFORE BALL COVERS VERTICAL DIST TO REACH ENEMY (CYCLES)
  var t = Math.abs(enemyY - ballY)/ballSpeedY;

  // TOTAL DISTANCE TRAVELLED (x) BASED ON TIME (CYCLES)
  var d = Math.abs(t * ballSpeedX) + Math.sign(ballSpeedX)* ballX;

  // DISTANCE FROM THE SIDE
  var f = (d%canvas.width);

  // IF THE BALL WILL BOUNCE AN EVEN AMOUNT OF TIME,
  // IT WILL APPROACH FROM THE SAME DIRETCION IT IS HEADING RIGHT NOW
  // OTHERWISE IF IT BOUNCS AN ODD AMOUNT OF TIME,
  // IT WILL APPROACH FROM THE OPPOSITE DIRETCION IT IS HEADING FROM NOW
  if(Math.floor(d/canvas.width)%2==0){
    enemyMTX = f;
  } else {
    enemyMTX = canvas.width-f;//-enemyWidth;
  }

  if(ballSpeedX < 0 && ballSpeedX*t + ballX > 0){
    enemyMTX = ballX + ballSpeedX*t;
  }
}
//AI MOVE TOWARDS
function AIMTW(){
  if(enemyMTX<enemyX && enemyX - enemyWidth - enemySpeed > 0){
    enemyX -= enemySpeed;
  } else if (enemyMTX>enemyX && enemyX + enemyWidth + enemySpeed < canvas.width){
    enemyX += enemySpeed;
  }
}
//DRAW EVENT FOR ENEMY
function drawEnemy(){
  ctx.beginPath();
  ctx.rect(enemyX, enemyY, enemyWidth,5);
  ctx.rect(enemyX, enemyY, -enemyWidth,5);
  ctx.fillStyle = "#00000";
  ctx.fill();
  ctx.closePath();
}

// BALL VARIABLES
var ballRadius = 10;

var ballX = canvas.width/2;
var ballY = enemyY + ballRadius + 15;

var r = Math.random() < 0.5 ? -1 : 1;
var ballSpeedX = r*Math.floor((Math.random() * 3) + 1);
var ballSpeedY = 5;

// STEP EVENT FOR THE Ball
function stepBall(){
  // HORIZONTAL BOUNCE
  if(ballX + ballRadius + ballSpeedX > canvas.width || ballX - ballRadius + ballSpeedX < 0){
    ballSpeedX = -ballSpeedX;
  }
  ballX += ballSpeedX;

  // IF BOUNCING OFF PLAYER'S SIDE (BARELY MISSED)
  if(ballY+ballRadius > playerY
  &&  Math.abs(ballX + Math.sign(ballSpeedX)*ballRadius + ballSpeedX - playerX) < playerWidth + ballRadius){
    ballSpeedX = -ballSpeedX;
  }

  // IF BOUNCING DIRETCLY OFF PLAYER'S PAD (HIT)
  if(Math.abs(ballY + ballRadius + ballSpeedY - playerY) < ballSpeedY  && Math.abs(ballX  - playerX) < playerWidth + ballRadius){
    AIThink();
    ballSpeedY = -ballSpeedY;
  }

  // IF BOUNCING OFF ENEMY'S PAD (HIT)
  if(Math.abs(ballY - ballRadius + ballSpeedY - enemyY) < Math.abs(ballSpeedY)  && Math.abs(ballX  - enemyX) < enemyWidth + ballRadius){
    ballSpeedY = -ballSpeedY;
    ballSpeedY += Math.sign(ballSpeedY)*0.3;
  }

  // IF HITTING PLAYER'S SIDE OF FIELD
  if(ballY + ballRadius + ballSpeedY > canvas.height){
    over = true;
    endText = "You lose!";
    ballY = canvas.height - ballSpeedY - ballRadius;
    enemyScore += 1;
  }

  // IF HITTING ENEMY'S SIDE OF FIELD
  if(ballY - ballSpeedY < 0){
    over = true;
    endText = "You win!";
    ballY = 0;
    playerScore +=1;
  }
  // MOVE BALL
  ballY += ballSpeedY;
}
// DRAWING THE BALL
function drawBall(){
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2 );
  ctx.fillStyle = "#00000";
  ctx.fill();
  ctx.closePath();
}

// DRAWING EVERYTHING
function draw(){
  // IF START OR MENU
  if(over){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawEnd();
    drawBall();
    drawEnemy();
    drawPlayer();

    if(enter){
      reset();
      over = false;
      start = false;
    }
  } else if(start){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    stepPlayer();
    drawPlayer();
    stepEnemy();
    drawEnemy();
    stepBall();
    drawBall();
  } else {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawMenu();
    drawEnemy();
    drawPlayer();
    drawBall();

    if(playerLeft || playerRight)
    {start = true;}
  }
}
function reset(){
  // PLAYER VARIABLES
  playerX = canvas.width/2
  playerY = canvas.height - 20;
  playerSpeed = 5;
  playerWidth = 25;

  // ENEMY VARIABLES
  enemyX = canvas.width/2;
  enemyY = 20;
  enemySpeed = 4;
  enemyWidth = 25;
  enemyMTX = enemyX;

  // BALL VARIABLES
  ballX = canvas.width/2;
  ballY = enemyY + ballRadius + 15;
  ballRadius = 10;
  r = Math.random() < 0.5 ? -1 : 1;
  ballSpeedX = r*Math.floor((Math.random() * 3) + 1);
  ballSpeedY = 5;
}
// GAMEOVER
function drawEnd(){
  ctx.font = "30px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.fillText(playerScore, canvas.width*0.33,100);
  ctx.fillText("-",canvas.width/2,100);
  ctx.fillText(enemyScore, canvas.width*0.66,100);
  ctx.fillText(endText, canvas.width/2,130);
  ctx.fillText("Press shift to play again", canvas.width/2,160);
}
// MENU TO START
function drawMenu(){
  ctx.font = "30px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.fillText("Press left or right key to start!", canvas.width/2,130)
}

// STARTING THE GAME
setInterval(draw,15);

var start = false;
var over = false;

var endText = "";
var playerScore = 0;
var enemyScore = 0;
