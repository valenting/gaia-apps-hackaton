		var canvas  = document.getElementById("pozah");
		var context = canvas.getContext("2d");
		var uppertextfield=document.getElementById("uppertext");
		var lowertextfield=document.getElementById("lowertext");
		var centralimage=null;
		function updateUpper()
		{
			clearAndRedraw();
		}
		function updateLower()
		{
			clearAndRedraw();
		}
		function clearAndRedraw()
		{
			//alert('click!');
			context.clearRect(0,0,500,500);
			drawcentralimage();
			writeText(50,uppertextfield.value);
			writeText(450,lowertextfield.value);
		}
		function writeText(pos,text)
		{
			context.lineWidth=1;
			context.fillStyle="#FFFFFF";
			context.strokeStyle="#FFFFFF";
			context.font="bold 32px impact";
			context.textAlign="center";
			context.fillText(text, 250, pos,400);
		}
		function doSomething(e) {
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			alert(e.code);
		}
		
		function drawCentralImage(source) {
			centralimage = new Image();
			centralimage.src =source;
			centralimage.addEventListener('load', drawcentralimage);
		}
		
		function drawcentralimage() {
			canvas.width=500;
			canvas.height=500;
			context.drawImage(centralimage,0,0,500,500);
		}