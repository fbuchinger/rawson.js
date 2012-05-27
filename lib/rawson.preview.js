

/*
    class Rawson.Preview (filename, rawfileData)
    
    represents the preview image of a camera raw file opened 
    in the viewer
*/

Rawson.Preview = function (rawsonFile, parentNode){
    this.parentNode = parentNode;
    this.rawFile = rawsonFile;
    this.id = rawsonFile.filename.split('.').join('');
    this.canvas = $('<canvas>').attr({id: this.id}).appendTo(this.parentNode)[0];
    this._load(rawsonFile);
    this.hide();
}

Rawson.Preview.fromHTML5File = function (fileName, fileData){
    var file  = new Rawson.File(fileName, fileData);
    var previewContainer = document.getElementById('preview-container'); //TODO: make this configurable
    return new Rawson.Preview(file,previewContainer);
}

Rawson.Preview.prototype = {
    _load: function (rawsonFile){
        var context = this.canvas.getContext("2d");
        var self = this;
        var loadimg = new Image();
        loadimg.src = rawsonFile.extractThumbnail();
        loadimg.onload = function() {
            self.canvas.width = loadimg.width;
            self.canvas.height = loadimg.height;
            context.drawImage(loadimg, 0, 0);
            self._setupDrag();
            $(self.canvas).trigger('previewLoaded',self);
            loadimg = null;
        };
    },
    _setupDrag: function (){
        $(this.canvas).drag(function(ev, dd){
          $(this).css({
             top: dd.offsetY,
             left: dd.offsetX
          });
       },{ relative:true });
    },
    rotate: function (degrees){
        
    },
    scale: function (percent){
        
    },
    zoom: function (ratio){
        scaleStr = 'scale(' + ratio + ')';
        var transformCSS = {   
        "-moz-transform" : scaleStr, 
        "-webkit-transform" : scaleStr,
        "transform": scaleStr
        }
      $(this.canvas).css(transformCSS);  
    },
    getMetadata: function (){
        return this.rawFile.getMetadata();
    },
    /*
     * on ()
     * mixin in the jquery event on method
     */ 
    on: function (event, callback){
        $(this.canvas).on(event, callback);
    },
    /*
     * off ()
     * mixin in the jquery event off method
     */ 
    off: function (event, callback){
        $(this.canvas).off(event, callback);
    },
    clone: function (cloneWidth, cloneHeight){
        var cloneWidth = cloneWidth || this.canvas.width;
        var cloneHeight = cloneHeight || this.canvas.height;
        var newCanvas = document.createElement('canvas');
        newCanvas.width = cloneWidth;
        newCanvas.height = cloneHeight;
        var context = newCanvas.getContext('2d');
        //apply the old canvas to the new one
        context.drawImage(this.canvas, 0, 0, cloneWidth, cloneHeight);
        //return the new canvas
        return newCanvas;
    },
    /*
     * toImage (format,size) 
     * returns the canvas content as image data, scaled to the given size (width=height)
     * if the size parameter is omitted, the size of the current canvas is used
     * format: 'jpeg' or 'png'
     */
    toImage: function (format, size){
        var clonedPreview = this.clone(size, size);
        return clonedPreview.toDataURL("image/" + format);
    },
    toBlob: function (format, size){
        var clonedPreview = this.clone(size, size);
        if (clonedPreview.mozGetAsFile){
            return clonedPreview.mozGetAsFile(this.id + '.'+ format, 'image/' + format);
        }
        else if (clonedPreview.toBlob){
            clonedPreview.toBlob(callback,'image/jpeg');
        }
        return clonedPreview.toDataURL("image/" + format);
    },
    show: function (){
        this.canvas.style.display = 'block';
    },
    hide: function (){
        this.canvas.style.display = 'none';
    },
    destroy: function (){
        //TODO: end drag functionality
        $(this.canvas).remove();
        this.canvas = null;
    }
}
