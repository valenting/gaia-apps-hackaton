//'use strict';
_fromCamera=1;

var Camera = {
  _camera: 0,

  get viewfinder() {
    return document.getElementById('viewfinder');
  },

  get switchButton() {
    return document.getElementById('switch-button');
  },

  get captureButton() {
    return document.getElementById('capture-button');
  },

  get galleryButton() {
    return document.getElementById('gallery-button');
  },

  init: function cameraInit() {
    this.captureButton.addEventListener('click', function() {
        alert("Capture");    
    });
    this.switchButton.addEventListener('click', this.toggleCamera.bind(this));
    this.galleryButton.addEventListener('click', function() {
        _fromCamera = 0;
        document.getElementById('imagefile').click();
    });

    this.setSource(this._camera);
  },

  setSource: function camera_setSource(camera) {
    this.viewfinder.src = '';

    var width, height;
    var viewfinder = this.viewfinder;

    width = document.body.clientHeight;
    height = document.body.clientWidth;

    var top = ((width / 2) - ((height) / 2));
    var left = -((width / 2) - (height / 2));
    viewfinder.style.top = top + 'px';
    viewfinder.style.left = left + 'px';

    var transform = 'rotate(90deg)';
    if (this._camera == 1) {
      transform += ' scale(-1, 1)';
    }

    viewfinder.style.MozTransform = transform;

    var config = {
      height: height,
      width: width,
      camera: camera
    };

    viewfinder.style.width = width + 'px';
    viewfinder.style.height = height + 'px';
    if (navigator.mozCamera)
      viewfinder.src = navigator.mozCamera.getCameraURI(config);
  },

  pause: function pause() {
    this.viewfinder.pause();
  },

  resume: function resume() {
    this.viewfinder.play();
  },

  toggleCamera: function toggleCamera() {
    if (_fromCamera == 1) {
        this._camera = 1 - this._camera;
        this.setSource(this._camera);
    }
    else {
        var html = '<video id="viewfinder" autoplay> </video>';
        document.getElementById("panel").innerHTML = html;
    }
  }

};

window.addEventListener('DOMContentLoaded', function CameraInit() {
  Camera.init();
});

document.addEventListener('mozvisibilitychange', function visibility(e) {
  if (document.mozHidden) {
    // If we're hidden, stop the video
    Camera.pause();
  } else {
    // If we become visible again, first reconfigure the camera
    // in case the screen has rotated or something, and then
    // resume the video.
    Camera.setSource(Camera._camera);
    Camera.resume();
  }
});
