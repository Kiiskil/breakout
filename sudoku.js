var canvas=document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2; //point of draw's start
var rightPressed = false;
var leftPressed = false;

var lives = 3;

//keypress listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

var x = canvas.width/2;
var y = canvas.height-30; //starting point of ball
var dx = 2; //because setInterval updates every 10ms, we ahve to add something to the ball-sprite wo make it appear moving
var dy = -2;
var ballRadius = 10;

//brick rows, columns, size and starting points
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

//We will hold all our bricks in a two-dimensional array. It will contain the brick columns (c), which in turn will contain the brick rows (r),
//  which in turn will each contain an object containing the x and y position to paint each brick on the screen.
// The code below will loop through the rows and columns and create the new bricks. NOTE that the brick objects will also be used for collision detection purposes later.
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status:1 };
    }
}

//bricks sprite
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status==1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//brick hitdetection
function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status==1){
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status=0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

//scores sprite
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
//lives sprite
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
//balls sprite
function drawBall(){
    ctx.beginPath();
    ctx.arc(x,y, ballRadius, 0, Math.PI*2); 
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// paddles sprite
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// movement of the ball
function draw(){
    ctx.clearRect(0,0, canvas.width, canvas.height); //clearing image before each draw, so it doesn't leave a trail
    drawBall();
    drawPaddle();
    drawScore();
    drawLives(),
    collisionDetection();
    drawBricks();
    // hitdetection bottom & top boundaries and paddle
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    // hitdetection left & right boundaries
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    //paddles movement by keypress
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
 
    x+=dx;
    y+=dy;
    //req---Frame gives authority of frames over to browser
    requestAnimationFrame(draw);
}



//if key that triggered evenetListener gives codes 39&OR37, variables change. Input e = event
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

//Set interval is fixed time
//setInterval(draw, 10);
draw();


