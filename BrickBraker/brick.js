var CTX = null;
var CNV = null;

$(window).load( function (e) {
	CNV = document.getElementById("canvas");
	CTX = CNV.getContext('2d'); 
	Canvas.start();	
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
	
	this.setSpped = function (speed) {
		this.speedX = speed;
		this.speedY = speed;
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
	levelNo : 0,
}


var Canvas = {
	
	sizeX : 480,
	sizeY : 800,
	mouse : null,
	startgame : 0,
	gameover : 0,
	bricksLeft : 0,
	defaultSpeed : 1,
	
	start : function () {
		
		CNV.removeEventListener('mousedown', Canvas.start); 
		
		Canvas.gameover = 0;		

		Game.bar = new Element(CNV.width/2 - 50, CNV.height-100);
		Game.bar.setSize(100, 20);
		Game.ball = new Element(CNV.width/2-5, Game.bar.Y-2);

		Game.bricks = new Array();
		Canvas.bricksLeft = 0;
		for(k=0,i = 100;i<400;i+=25){
			for(j = 20; j<460;j+=55,k++) {
				Game.bricks[k] = new Element(j,i);
				Game.bricks[k].setSize(50,20);
				if (Levels.level[Game.levelNo][k] == 0){
						Game.bricks[k].draw = false;
				
				}
				else{
					Canvas.bricksLeft ++;
				}
			}
		}
		
		Canvas.draw();
		
		writeMessage(CNV,"Click to start the Game");

		CNV.addEventListener('mousedown', Canvas.startInit, false);
		
	},
	
	startInit : function () {
		Canvas.init();
		CNV.removeEventListener('mousedown', Canvas.startInit); 		
	},
	
	init : function () {
		this.addMouseDir();
		
		function render() {
			if (Canvas.gameover == 0 && Canvas.bricksLeft != 0) {
				requestAnimFrame(render);
				Canvas.draw();
			}
			
			else {
				if (Canvas.gameover == 1)
					writeMessage(CNV, "Game Over");
					
				if (Canvas.bricksLeft == 0) {
					if (Game.levelNo < Levels.level.length - 1 ) {
						writeMessage(CNV, "Click for the next Level");
						Game.levelNo++;
					}
					else {
						writeMessage(CNV, "You've finished the game!");
						Game.levelNo = 0;
					}
				}
				CNV.addEventListener('mousedown', Canvas.start, false);
			}
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
	
	drawBricks: function(bricks, ball) {
		for(i = 0;i<bricks.length;i++) {
			if(bricks[i].draw == true) {
				bricks[i].colision(ball);
				if(bricks[i].draw == true) { 
					CTX.fillStyle = bricks[i].color;
					CTX.fillRect(bricks[i].X, bricks[i].Y, bricks[i].width,bricks[i].height);
				} else {
					Canvas.bricksLeft--;
					i++;
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
	context.textAlign = 'center'
    context.fillStyle = 'black';
    context.fillText(message, canvas.width/2, canvas.height/2 + 50);
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

