var video = document.querySelector('#video');
var canvas = document.querySelector('#canvas');
var img = document.querySelector('img');
var ctx = canvas.getContext('2d');
var cw = 360;
var ch = 400;
var imgur = '';

var snapshot = function () {
	video.style.display = 'none';
	canvas.width = cw;
	canvas.height = ch;
	ctx.drawImage(video, 0, 0, cw, ch);
	img.src = canvas.toDataURL('image/webp');
	img.style.display = 'block';
};

var sepia = function() {
	Caman('#canvas', function () {
		this.sepia(50).render();
		img.src = canvas.toDataURL('image/webp');
	});
	
};

var vibrance = function() {
	Caman('#canvas', function () {
		this.vibrance(15).render();
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

document.querySelector('#sepia').addEventListener('click', sepia);
document.querySelector('#vibrance').addEventListener('click', vibrance);
document.querySelector('#invert').addEventListener('click', invert);
document.querySelector('#grayscale').addEventListener('click', grayscale);

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

var getData = function(el, dataname) {
	return el.dataset[dataname];
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
            name: 'photobooth.jpg',
            title: 'test title',
            caption: 'test caption',
            image: imgur
        },
        dataType: 'json'
    }).success(function(data) {
        console.log(data);
    }).error(function(data) {
       console.log(data);
    });
}

document.querySelector('#share').addEventListener('click', share);

navigator.webkitGetUserMedia({video:true}, success);

document.querySelector('#snapshot').addEventListener('click', snapshot);