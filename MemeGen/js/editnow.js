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
			writeText(centralimage.height-50,lowertextfield.value);
		}
		function writeText(pos,text)
		{
			context.lineWidth=1;
			context.fillStyle="#FFFFFF";
			context.strokeStyle="#FFFFFF";
			context.font="bold 32px impact";
			context.textAlign="center";
			context.fillText(text,centralimage.width/2, pos, centralimage.width-100);
		}
		
		function drawCentralImage(source) {
			centralimage = new Image();
			centralimage.src =source;
			centralimage.addEventListener('load', drawcentralimage);
		}
		
		function drawcentralimage() {
			uppertextfield.style.width=centralimage.width+"px";
			lowertextfield.style.width=centralimage.width+"px";
			canvas.width=centralimage.width;
			canvas.height=centralimage.height;
			context.drawImage(centralimage,0,0,canvas.width,canvas.height);
		}
		

		function share(){
			try {
				var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
			} catch(e) {
				var img = canvas.toDataURL().split(',')[1];
			}
			// open the popup in the click handler so it will not be blocked
			var w = window.open();
			w.document.write('Uploading...');
			// upload to imgur using jquery/CORS
			// https://developer.mozilla.org/En/HTTP_access_control
			$.ajax({
				url: 'http://api.imgur.com/2/upload.json',
				type: 'POST',
				data: {
					type: 'base64',
					// get your key here, quick and fast http://imgur.com/register/api_anon
					key: 'fc862c0aa18287070c439c8c0f039bca',
					name: 'meme.jpg',
					title: 'memegen',
					caption: 'Created with the hackaton Meme Generator!',
					image: img
				},
				dataType: 'json'
			}).success(function(data) {
				var imgurl=document.getElementById("imageURL");
				var x=data['upload']['links']['imgur_page'];
				w.close();
				imgurl.value=x;
				imgurl.style.visibility='visible';
			}).error(function() {
				alert('Could not reach api.imgur.com. Sorry :(');
				w.close();
			});
}
