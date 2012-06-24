var CTX = null;
var CNV = null;

$(window).load( function (e) {
	CNV = document.getElementById("canvas");
	CTX = CNV.getContext('2d'); 
	Canvas.init();
});




// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame|| 
	window.webkitRequestAnimationFrame	|| 
	window.mozRequestAnimationFrame		|| 
	window.oRequestAnimationFram		|| 
	window.msRequestAnimationFrame		|| 
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();




function Element(X, Y) {
	this.X = X;
	this.Y = Y;
	this.size = 10;
	this.width = 10;
	this.height = 10;
	
	this.speedX = 5;
	this.speedY = 5;
	this.dir = 0;
	
	this.setSize = function (width, height) {
		this.width = width;
		this.height = height;
	}
}


var Game = {
	ball : null,
	bar : null,
}


var Canvas = {
	
	sizeX : 480,
	sizeY : 800,
	mouse : null,
	gameover : 0,

	init : function () {
		Game.ball = new Element(20, 20);
		Game.bar = new Element(100, 725);
		Game.bar.setSize(100, 20);

		this.addMouseTouch();



		function render() {
//			if (Canvas.gameover == 0) {
				requestAnimFrame(render);
				Canvas.draw();
//			}
			
//			else writeMessage(CNV,"Game Over");
		}

		render();
	},
	
	addMouseTouch : function  () {
		$("#touchLeft").mousedown(function(e) {
			Game.bar.dir = -Game.bar.speedX; 
		});

		$("#touchRight").mousedown(function(e) {
			Game.bar.dir = Game.bar.speedX; 
		});

		$(document).mouseup(function (e) {
			Game.bar.dir = 0; 
		});

	},
	
	draw : function () {
		CTX.clearRect(0, 0, 480, 800);

		this.animateBall(Game.ball);
		this.animateBar(Game.bar);

		CTX.fillStyle = "#000";
		CTX.fillRect(Game.bar.X, Game.bar.Y, 100, 20);
	},


	animateBar : function (bar) {
		bar.X += bar.dir;
		CTX.fillRect(bar.X, bar.Y, 100, 20);
	},

	animateBall : function (ball) {
		if ( (ball.X + ball.size) >= this.sizeX || ball.X <= ball.size)
			ball.speedX = (-1) * ball.speedX;

		if ( (ball.Y + ball.size) >= this.sizeY || ball.Y <= ball.size)
			ball.speedY = (-1) * ball.speedY;

		if ( ball.Y + ball.size >= Game.bar.Y) {
			if (ball.X > Game.bar.X - ball.size && ball.X < Game.bar.X + 100 + ball.size)
				ball.speedY = (-1) * ball.speedY;
			else 
				Canvas.gameover = 1;
		}


		ball.X += ball.speedX;
		ball.Y += ball.speedY;

		CTX.beginPath();
		CTX.arc(ball.X, ball.Y, ball.size, 0, Math.PI*2, true);	
		CTX.closePath();
		CTX.fill();		
	},
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

