var canvas_margin = 20;
var width = 640;
var height = 480;
var canvas = document.getElementById("canvas");
var context = canvas.getContext( '2d' );
var playerX = 100;
var	playerY = 100;
var speed = 2;

window.addEventListener("keydown",doKeyDown,true);

function mainLoop(){
	context.fillStyle = "yellow";
context.fillRect(0,0,320,480);
context.fillStyle = "black";
context.fillRect(playerX,playerY,50,10);
}

function doKeyDown(event) {
	switch (event.keyCode) {
			/*case 38: //Up arrow
					speedY = -speed;
					speedX=0;
				break;
			case 40: //Down arrow
					speedY = speed;
					speedX = 0;
				break;*/
			case 37: /*Left arrow*/
					playerX -= speed;
				break;
			case 39: /*Right arrow*/
					playerX += speed;
										
				break;
	}
}