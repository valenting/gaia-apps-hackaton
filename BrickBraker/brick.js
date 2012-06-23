var CTX = null;
var CNV = null;

$(window).load( function (e) {
	CNV = document.getElementById("canvas");
	CTX = CNV.getContext('2d'); 
	Canvas.init();
});


function Element(X, Y) {
	this.X = X;
	this.Y = Y;
	this.size = 20;
	this.speedX = 4;
	this.speedY = 4;
}

var Bar = {
	X : 100,
	Y : 700,
	
	speed : 10,
}
 

var Game = {
	ball : null,
}


var Canvas = {
	
	sizeX : 480,
	sizeY : 800,
	mouse : null,
	gameover : 0,

	init : function () {
		Game.ball = new Element(10, 10);
		window.onkeypress = Canvas.doKeyDown;


		document.getElementById("canvas").addEventListener('mousemove', function(evt){
			this.mouse = getMousePos(CNV, evt);
			if (this.mouse.x > Bar.X + 40 )
				Bar.X += Bar.speed;
			if (this.mouse.x < Bar.X + 50 )
				Bar.X -= Bar.speed;
//			var message = "Mouse position: " + mousePos.x + "," + mousePos.y;
//			writeMessage(CNV, message);
		}, false);



		function render() {
			if (Canvas.gameover == 0) {
				mozRequestAnimationFrame(render);
				Canvas.draw();
			}
			
			else writeMessage(CNV,"Game Over");
		}

		render();
	},
	
	draw : function () {
		CTX.clearRect(0, 0, 480, 800);

		this.animateBall(Game.ball);

		CTX.fillStyle = "#000";
		CTX.fillRect(Bar.X, Bar.Y, 100, 20);
	},

	animateBall : function (ball) {
		if ( (ball.X + ball.size-10) >= this.sizeX || ball.X <= 5)
			ball.speedX = (-1) * ball.speedX;

		if ( (ball.Y + ball.size-10) >= this.sizeY || ball.Y <= 5)
			ball.speedY = (-1) * ball.speedY;

		if ( ball.Y >= Bar.Y) {
			if (ball.X > Bar.X && ball.X < Bar.X + 100)
				ball.speedY = (-1) * ball.speedY;
			else 
				Canvas.gameover = 1;
		}


		ball.X += ball.speedX;
		ball.Y += ball.speedY;

		CTX.beginPath();
		CTX.arc(ball.X, ball.Y, 10, 0, Math.PI*2, true);	
		CTX.closePath();
		CTX.fill();		
	},

	doKeyDown : function (e) {
		switch (e.keyCode) {
				case 37: /*Left arrow*/
						Bar.X -= Bar.speed;
					break;
				case 39: /*Right arrow*/
						Bar.X += Bar.speed;
					break;
		}
	}
	
}



function writeMessage(canvas, message){
    var context = canvas.getContext('2d');
    context.fillStyle = "rgba(255, 255, 255, 0.7)"; ;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '30pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 100, canvas.height/2);
}
 
function getMousePos(canvas, evt){
    // get canvas position
    var obj = canvas;
    var top = 0;
    var left = 0;
    while (obj && obj.tagName != 'BODY') {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
 
    // return relative mouse position
    var mouseX = evt.clientX - left + window.pageXOffset;
    var mouseY = evt.clientY - top + window.pageYOffset;
    return {
        x: mouseX,
        y: mouseY
    };
}

