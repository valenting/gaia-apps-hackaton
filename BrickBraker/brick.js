var CTX = null;


$(window).load( function (e) {
	CTX = document.getElementById("canvas").getContext('2d'); 
	Canvas.init();
});


 


var Canvas = {

	playerX : 100,
	playerY : 600,
	speed : 5,
	

	init : function () {
		setInterval(this.draw , 10);
		console.log(this);		
		//window.addEventListener('keypress', this.doKeyDown, false);
		window.onkeypress = Canvas.doKeyDown;
	},

	draw : function () {
		CTX.fillStyle = "yellow";
		CTX.fillRect(0, 0, 480, 800);
		CTX.fillStyle = "black";
		CTX.fillRect(Canvas.playerX, Canvas.playerY, 100, 20);
	},

	doKeyDown : function (e) {
		switch (e.keyCode) {
				case 37: /*Left arrow*/
						Canvas.playerX -= Canvas.speed;
					break;
				case 39: /*Right arrow*/
						Canvas.playerX += Canvas.speed;
											
					break;
		}
	}
	
}


	//window.onload = Canvas.init;
