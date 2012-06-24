var video = document.querySelector('#video')
	, canvas = document.querySelector('#canvas')
	, img = document.querySelector('#holder img')
	, ctx = canvas.getContext('2d')
	, cw = 360
	, ch = 400
	, imgur = ''
	, userPos;

$('.be-social').hide();

var oFReader = new FileReader();

oFReader.onload = function (oFREvent) {
	var imgs = document.querySelectorAll(".preview");
	var fileHolder = document.querySelector('#fileHolder');
	fileHolder.parentNode.removeChild(fileHolder);
	document.querySelector('#holder').innerHTML = '<img class="largePreview" src="'+oFREvent.target.result+'">';
	for (var i = 0; i < imgs.length; i++) {
		imgs[i].src = oFREvent.target.result;
	}
	
	renderToCanvas(oFREvent.target.result);
};

var renderToCanvas = function (src) {
	var image = new Image();
	image.src = src;
	img = document.querySelector('.largePreview');
	image.addEventListener("load",
	    function(){
		canvas.width = image.width;
		canvas.height = image.height;
	     ctx.drawImage(this, 0, 0, image.width, image.height);
	    } ,
	    false);
};


var snapshot = function () {
	video.style.display = 'none';
	canvas.width = cw;
	canvas.height = ch;
	ctx.drawImage(video, 0, 0, cw, ch);
	img.src = canvas.toDataURL('image/webp');
	img.style.display = 'block';

	var imgs = document.querySelectorAll(".preview");
	for (var i = 0; i < imgs.length; i++) {
		imgs[i].src = canvas.toDataURL('image/webp');
	}
	reverseGeocode();
};

var previewFilters = function() {
	if(document.querySelector('input[type=file]')) {
		var oFile = document.querySelector("input[type=file]").files[0];
		oFReader.readAsDataURL(oFile);
	}
};

var sepia = function() {
	Caman('#canvas', function () {
		this.sepia(50).render();
		img.src = canvas.toDataURL('image/webp');
	});
	
};

var contrast = function() {
	Caman('#canvas', function () {
		this.contrast(15).render();
	});
	img.src = canvas.toDataURL('image/webp');
};

var invert = function() {
	Caman('#canvas', function () {
		this.invert().render();
	});
	img.src = canvas.toDataURL('image/webp');
};

var grayscale = function() {
	Caman('#canvas', function () {
		this.greyscale().render();
	});
	img.src = canvas.toDataURL('image/webp');
};

var saturate = function() {
	Caman('#canvas', function () {
		this.saturation(25).render();
	});
	img.src = canvas.toDataURL('image/webp');
};

var updateSliders = function() {
	this.dataset['value'] = this.value;
};

var inputs = document.querySelectorAll('input');
for (var i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('mousedown', updateSliders);
	inputs[i].addEventListener('mouseup', updateSliders);
}

var success = function (localStream) {
	video.src = window.webkitURL.createObjectURL(localStream);
};

var failure = function () {
	video.parentNode.removeChild(video);
	var holder = document.querySelector('#holder');
	holder.innerHTML = '<div id="fileHolder"><div class="folder-icon"></div><input type="file" id="fileURL"/></div>';
	document.querySelector('input[type=file]').addEventListener('change', previewFilters);	
};

var getData = function(el, dataname) {
	return el.dataset[dataname];
};

var reverseGeocode = function() {
	var geocoder = new google.maps.Geocoder();

	navigator.geolocation.getCurrentPosition(function(position) {  
		var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);  
		geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				userPos = results[1].formatted_address;
			}
		}
	}); 

	});
};

function share(){
var imgur = canvas.toDataURL().split(',')[1];
    $.ajax({
        url: 'http://api.imgur.com/2/upload',
        type: 'POST',
        data: {
            type: 'base64',
            // get your key here, quick and fast http://imgur.com/register/api_anon
            key: 'c759641a0e36ec56239b7d6b1271821c',
            name: 'Photobooth.jpg',
            title: 'Photobooth',
            caption: userPos,
            image: imgur
        },
        dataType: 'json'
    }).success(function(data) {
    	console.log(data);
		var url = 'https://twitter.com/share?url='+data.upload.links.original+'&text=Just took a pic with Photobooth';
		$('.twitter').attr('href', url);
    }).error(function(data) {
       console.log(data);
    });
}

//document.querySelector('#share').addEventListener('click', share);

if(navigator.webkitGetUserMedia)
	navigator.webkitGetUserMedia({video:true}, success);
else 
	failure();

$('.btn-success').on('click', function(){
	$(this).hide();
	$('.be-social').show();
	share();
});

document.querySelector('#snapshot').addEventListener('click', snapshot);
document.querySelector('#sepia').addEventListener('click', sepia);
document.querySelector('#contrast').addEventListener('click', contrast);
document.querySelector('#invert').addEventListener('click', invert);
document.querySelector('#grayscale').addEventListener('click', grayscale);
document.querySelector('#saturate').addEventListener('click', saturate);