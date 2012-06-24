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
	this.size = 10; // trebuie schimbat in radius
	this.width = 10;
	this.height = 10;
	
	this.speedX = 5;
	this.speedY = -5;
	this.dir = 0;
	this.color = "red";
	this.draw = true;
	
	this.setSize = function (width, height) {
		this.width = width;
		this.height = height;
	}
	this.setColor = function (color) {
		this.color = color;
	}
	
	this.colision = function (ball) {
		//1 up
		
		if(ball.X >= this.X  &&  ball.X <= this.X + this.width ) {
			if( ball.size >= Math.abs(this.Y - ball.Y) ||  ball.size >= Math.abs(this.Y - ball.Y + this.height) ) {
				// up and down
				ball.speedY *=-1;
				this.draw = false;
			}		
		}
		
		if(ball.Y >= this.Y &&  ball.Y <= this.Y + this.height ) {
			if( ball.size >= Math.abs(this.X - ball.X) ||  ball.size >= Math.abs(this.X - ball.X + this.width) ) {
				//left and right
				ball.speedX *=-1;
				this.draw = false;
			}		
		}
	}
}


var Game = {
	ball : null,
	bar : null,
	bricks : null,
}


var Canvas = {
	
	sizeX : 480,
	sizeY : 800,
	mouse : null,
	gameover : 0,
	defaultSpeed : 1,
	
	init : function () {
		
		Game.bar = new Element(CNV.width/2 - 50, CNV.height-100);
		Game.bar.setSize(100, 20);
		Game.ball = new Element(CNV.width/2,Game.bar.Y);
		Game.ball.Y -= 2*Game.ball.size;

		Game.bricks = new Array();
		for(k=0,i = 100;i<400;i+=25){
			for(j = 20; j<460;j+=55,k++) {
			Game.bricks[k] = new Element(j,i);
			Game.bricks[k].setSize(50,20);
			}
		}
		
		document.getElementById("canvas").addEventListener('mousedown', function(evt){
			this.mouse = getMousePos(CNV, evt);
			if (this.mouse.x <= Canvas.sizeX / 2)
				Game.bar.dir = -8; 
			else 
				Game.bar.dir = 8; 
		}, false);



		document.getElementById("canvas").addEventListener('mouseup', function(evt){
				Game.bar.dir = 0; 
		}, false);

		function render() {
			if (Canvas.gameover == 0) {
				requestAnimFrame(render);
				Canvas.draw();
			}
			
			else writeMessage(CNV,"Game Over");
		}

		render();
	},
	
	
	addTouchEvent : function (event) {
		for (var i = 0; i < event.touches.length; i++) {
			var touch = event.touches[i];
			CTX.beginPath();
			CTX.arc(touch.pageX, touch.pageY, 20, 0, 2*Math.PI, true);
			CTX.fill();
			CTX.stroke();
		}
	},
	

	
	draw : function () {
		CTX.clearRect(0, 0, 480, 800);

		this.animateBall(Game.ball);
		this.animateBar(Game.bar);
		this.drawBricks(Game.bricks,Game.ball);
		
		CTX.fillStyle = "#000";
		CTX.fillRect(Game.bar.X, Game.bar.Y, 100, 20);
	},
	
	drawBricks: function(bricks,ball) {
		for(i = 0;i<bricks.length;i++) {
			if(bricks[i].draw === true) {
				bricks[i].colision(ball);
				if(bricks[i].draw == true) { 
					CTX.fillStyle = bricks[i].color;
					CTX.fillRect(bricks[i].X, bricks[i].Y, bricks[i].width,bricks[i].height);
				} else {
					for(;i<bricks.length;i++) {
						if(bricks[i].draw == true) { 
						CTX.fillStyle = bricks[i].color;
						CTX.fillRect(bricks[i].X, bricks[i].Y, bricks[i].width,bricks[i].height);
						} 
					}
					return;
				}
			}
		}
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
			if (ball.X >= Game.bar.X - ball.size - 5 && ball.X <= Game.bar.X + Game.bar.width + ball.size + 5) {
				var aux = Math.abs(Game.bar.X - ball.X + (10 + 2 * ball.size + Game.bar.width)/2)/((10 + 2 * ball.size + Game.bar.width)/2);
				ball.speedY = -1 * ( -8 * aux * aux+ aux +8);
			}
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

	doKeyDown : function (event) {
		switch (event.keyCode) {
				case 37: /*Left arrow*/
						Game.bar.X -= Game.bar.speed;
					break;
				case 39: /*Right arrow*/
						Game.bar.X += Game.bar.speed;
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