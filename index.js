// on-click we clone the background element, position it
// statically over-top the current element, and then we
// programatically zoom it to the maximum dimensions allowed.

var classes = require('classes');
var events = require('events');
var css = require('css');
var redraw = require('redraw');
var is = require('is');
var afterTransition = require('after-transition');
var Emitter = require('emitter');

module.exports = function(el, url){
  if (is.object(el)){
    var zooms = [];
    for (var i = 0; i < el.length; i++){
      zooms.push(new ImageZoom(el[i]));
    }
    return zooms;
  }
  return new ImageZoom(el, url);
};

function ImageZoom(el, zoomURL){
  classes(el).add('original-image');
  this.thumb = el;
  this.viewport = {};
  this.bind();
  this.backgroundURL = zoomURL;
};

Emitter(ImageZoom.prototype);

ImageZoom.prototype.bind = function(){
  this.events = events(this.thumb, this);
  this.events.bind('click', 'show');
};

ImageZoom.prototype.loadImage = function(fn){
  if (this.hasLoaded) return fn();
  var img = new Image();
  var self = this;
  setTimeout(function(){
    if (!self.hasLoaded) self.loading();
  }, 50);
  img.onload = function(){
    self.hasLoaded = true;
    self.finishLoading();
    fn();
  }
  img.src = this.src;
};

ImageZoom.prototype.loading = function(){
  classes(this.thumb).add('loading');
};

ImageZoom.prototype.finishLoading = function(){
  classes(this.thumb).remove('loading');
};

ImageZoom.prototype.getDimensions = function(fn){
  this.originalPosition = this.thumb.getBoundingClientRect();
  this.originalDimensions = {
    width: this.thumb.clientWidth,
    height: this.thumb.clientHeight
  };
  this.src = this.thumb.getAttribute('data-zoom-url') || this.backgroundURL;
  return this;
};

ImageZoom.prototype.createClone = function(){
  this.clone = document.createElement('div');
  classes(this.clone).add('image-clone');
  this.cloneEvents = events(this.clone, this);
  this.cloneEvents.bind('click', 'hide');
  this.setOriginalDeminsions();
  document.body.appendChild(this.clone);
  return this;
};

ImageZoom.prototype.setOriginalDeminsions = function(){
  // Ideally, we would use translate3d to animate the position of the
  // element, instead of left + top. Consider using the below
  // code in the future...
  css(this.clone, {
    top: this.originalPosition.top,
    left: this.originalPosition.left,
    width: this.originalDimensions.width,
    height: this.originalDimensions.height,
    'background-image' : 'url('+ this.src +')'
  });
  return this;
};

ImageZoom.prototype.zoomToFull = function(){
  redraw(this.clone);
  css(this.clone, {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  });
  this.emit('zoom', this);
  return this;
};

ImageZoom.prototype.show = function(e){
  if (e) e.preventDefault();
  this.getDimensions();
  var self = this;
  this.loadImage(function(){
    self.createClone()
    self.zoomToFull();
  });
  return this;
};

ImageZoom.prototype.hide = function(e){
  if (e) e.preventDefault();
  this.cloneEvents.unbind();
  this.setOriginalDeminsions();
  var self = this;
  afterTransition.once(self.clone, function(){
    self.clone.parentNode.removeChild(self.clone);
    self.emit('zoomed-out', self);
  });
  return this;
};