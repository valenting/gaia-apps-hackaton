function drawIndex() {
	var indexdiv=document.getElementById("indexpage");
				
	// counter
	var i=0;

	// create object
	var img = new Array();

	// set image list
	var imageName = "";

	
	// start preloading
	for(i=1; i<=17; i++) {
		// compose file image name
		imageName = i.toString();
		imageName = imageName.concat('t.jpg');
							
		// create new img tag
		img[i] = document.createElement("img");
		img[i].src = "TemplatePics\\"+imageName;
		img[i].id = i;
		img[i].addEventListener("click",setSource);
		
		indexdiv.appendChild(img[i]);

		if(i%3==0) {
			// add new line
			var br = document.createElement("br");
			indexdiv.appendChild(br);
		}
	}
}
function setSource()
{
	drawCentralImage("TemplatePics\\"+this.id+'.jpg');
	document.getElementById("indexpage").style.left='-510px';
	document.getElementById("editpage").style.left='-500px';
}