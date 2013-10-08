
# background-image-zoom

  zoom a background image to full screen

## Installation

  Install with [component(1)](http://component.io):

    $ component install eugenicsarchivesca/background-image-zoom

## Example

```html
<a href='#' data-zoom-url='inst6.jpg' style='background-image: url(inst6.jpg); background-size: cover;'>
</a>

<a href='#' data-zoom-url='inst6.jpg' style='background-image: url(inst6.jpg); background-size: cover;'>
</a>

<script>
var zoom = require('background-image-zoom');
var z = new zoom(document.querySelectorAll('a'));
</script>
```

## API

### zoom(el, url)

Make an element zoomable. The element must either have a `data-zoom-url` attribute, pointing to the full-sized image, or you need to supply it in the constructor.

### zoom.show()

Zoom the thumbnail to fullscreen.

### zoom.hide()

Zoom back to the thumbnail.

## Events

### zoom.on('zoomed-out');
### zoom.on('zoom');


## License

  MIT
