var CTX = null;
var CNV = null;

$(window).load( function (e) {
	CNV = document.getElementById("canvas");
	CTX = CNV.getContext('2d'); 
	Canvas.init();
});




// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame	|| 
	window.webkitRequestAnimationFrame		|| 
	window.mozRequestAnimationFrame			|| 
	window.oRequestAnimationFram			|| 
	window.msRequestAnimationFrame			|| 
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();



var Levels = {
	level1 : new Array (0, 0, 1, 1, 1, 1, 0, 0
						),
}


function Element(X, Y) {
	this.X = X;
	this.Y = Y;
	this.size = 10; // trebuie schimbat in radius
	this.width = 10;
	this.height = 10;
	
	this.speedX = 5;
	this.speedY = 5;
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
	
	this.setSpped = function (speed) {
		this.speedX = speed;
		this.speedY = speed;
	}
	
	this.colision = function (ball) {
		//1 up
		
		if(ball.X >= this.X &&  ball.X <= this.X + this.width ) {
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
	defaultSpeed : 5,
		
	init : function () {
		Game.ball = new Element((CNV.width - 20)/2, 705);
		Game.bar = new Element((CNV.width - 100)/2, 725);
		Game.bar.setSize(100, 20);


		this.addMouseDir();


		Game.bricks = new Array();
		for(k=0,i = 100;i<400;i+=25){
			for(j = 75; j<405;j+=55,k++) {
			Game.bricks[k] = new Element(j,i);
			Game.bricks[k].setSize(50,20);
			}
		}		

		function render() {
			if (Canvas.gameover == 0) {
				requestAnimFrame(render);
				Canvas.draw();
			}
			
			else writeMessage(CNV,"Game Over");
		}

		render();
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
				}
			}
		}
	},

	animateBar : function (bar) {
		if (bar.X + bar.dir < 0 || (bar.X + bar.dir + bar.width) > CNV.width)
			return;
			
		bar.X += bar.dir;
		CTX.fillRect(bar.X, bar.Y, 100, 20);
		CTX.fillRect(CNV.width/2 , 650, 1, 100);
	},

	animateBall : function (ball) {
		if ( (ball.X + ball.size) >= this.sizeX || ball.X <= ball.size)
			ball.speedX = (-1) * ball.speedX;

		if ( (ball.Y + ball.size) >= this.sizeY || ball.Y <= ball.size)
			ball.speedY = (-1) * ball.speedY;

		if ( ball.Y + ball.size >= Game.bar.Y) {
			if (ball.X > Game.bar.X - ball.size && ball.X < Game.bar.X + Game.bar.width + ball.size)
				ball.speedY = -1 * ((Canvas.defaultSpeed+2 ) *(1-Math.abs(Game.bar.X - ball.X + 50 )/60));
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
	
	addMouseDir : function () {
		CNV.addEventListener('mousedown', function(evt){
			this.mouse = getMousePos(CNV, evt);
			if (this.mouse.x <= Canvas.sizeX / 2)
				Game.bar.dir = -Game.bar.speedX; 
			else 
				Game.bar.dir = Game.bar.speedX; 
		}, false);



		CNV.addEventListener('mouseup', function(evt){
				Game.bar.dir = 0; 
		}, false);		
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

