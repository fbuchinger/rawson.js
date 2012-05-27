/*
   rawson.js

   a javascript previewer for camera raw files.
   (c) 2012 by Franz Buchinger (fbuchinger@gmail.com)
    
   licensed under GPL and MIT license      
*/


/*
    class Rawson.File (filename, rawfileData)
    
    represents a camera raw file
*/

var root, dcraw, include;
root = (typeof exports !== "undefined" && exports !== null) ? exports : this;

include = (typeof require === "function" && require !== null) ? require: function (){return {FS:FS,run:run}};

dcraw = include('../build/dcraw.js');


var Rawson = window.Rawson || {};

Rawson.File = function (fname, data){
    this.rawFile = dcraw.FS.createDataFile('/', fname, data, true, true);
    this.filename = fname;
    this.metadata = null;
    this.dcraw = dcraw;
    this.FS = dcraw.FS;
}

/*
    getMetadata()
    fetches the metadata of the raw file image
*/
Rawson.File.prototype.getMetadata = function (){
    if (this.metadata){
        return this.metadata;
    }
    var oldconsole = console.log;
    var output = [];    
    console.log = function (data){
        if (data.indexOf(':') > -1){
            output.push({key: data.split(':')[0], value:data.split(':')[1]});
        }
    }
    
    dcraw.run(['-v', '-i', '/' + this.filename]);
    console.log = oldconsole;
    this.metadata = output;
    return output;
}

/*
    extractThumbnail()
    extracts the thumbnail image of the raw file
*/
Rawson.File.prototype.extractThumbnail = function (){
    if (this.thumbnail){
        return this.thumbnail;
    }
    dcraw.run(['-e', '/' + this.filename]);
    var jpegThumbname = this.filename.split('.')[0] + '.thumb.jpg';
    var ppmThumbname = this.filename.split('.')[0] + '.thumb.ppm';
    //dcraw returned a jpeg thumbnail, which can be directly used by the browser
    if (dcraw.FS.root.contents[jpegThumbname]){
        var thumbnailData = dcraw.FS.root.contents[jpegThumbname].contents;
        if (root.btoa){
            this.thumbnail = this._toDataURI(thumbnailData,'image/jpeg');
        }
        else {
            this.thumbnail = thumbnailData;
        }
        
    }
    //dcraw returned a PNM thumbnail, which has to be converted to PNG
    //using canvas
    else if (dcraw.FS.root.contents[ppmThumbname]){
        var thumbnailData = dcraw.FS.root.contents[ppmThumbname].contents;
        this.thumbnail = this._PNMtoIMG(thumbnailData);
    }
    return this.thumbnail;
}

Rawson.File.prototype.toBitmap = function (ppmdata){
    //dcraw.run(['-h','-q','0','/' + this.filename]);
    dcraw.run(['-D','/' + this.filename]);
    var ppmName = this.filename.split('.')[0] + '.pgm';
    return dcraw.FS.root.contents[ppmName].contents;
}

Rawson.File.prototype.toFastBitmap = function (ppmdata){
    dcraw.run(['-h','/' + this.filename]);
    var ppmName = this.filename.split('.')[0] + '.ppm';
    if (dcraw.FS.root.contents[ppmName]){
        this._PNMtoIMG(this.FS.root.contents[ppmName]);
    }
}

Rawson.File.prototype._PNMtoIMG = function(ppmDataArr){
    var magicNumberIdx = ppmDataArr.indexOf(10); //10 -> '\n'
    var dimIdx = ppmDataArr.indexOf(10, magicNumberIdx +1);
    var maxValIdx = ppmDataArr.indexOf(10, dimIdx +1);
    var dataOffset = maxValIdx +1;
    var dimStr = String.fromCharCode.apply(this,ppmDataArr.slice(magicNumberIdx + 1, dimIdx));
    var photoDims = dimStr.split(" ");
    var width = ~~photoDims[0]
    var height = ~~photoDims[1];

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext('2d');
    var rgbaImage = ctx.createImageData(width, height);
    var pixelData = ppmDataArr.slice(dataOffset);
    
    var ppmPixelLength = pixelData.length;
    var rgbaPixelLength = width*height*4;
    var i = 0;
    var j = 0;
    while (i < ppmPixelLength && j < rgbaPixelLength) {
        rgbaImage.data[j] = pixelData[i]; // R
        rgbaImage.data[j+1] =  pixelData[i+1]; // G
        rgbaImage.data[j+2] = pixelData[i+2]; // B
        rgbaImage.data[j+3] = 255; // A
        j += 4;
        i += 3;
    }
    ctx.putImageData(rgbaImage, 0, 0);
    return canvas.toDataURL();
}

/*
    _toDataURI(data, mimeType)
    internal helper function for base64-encoding data
*/
Rawson.File.prototype._toDataURI = function (data,mimeType){
    var base64str = '';
    var dataLen = data.length;
	for (var i = 0; i < dataLen; i++){
		base64str += String.fromCharCode(data[i]);
	}
    return "data:" + mimeType + ";base64," + window.btoa(base64str);
}




root.Rawson = Rawson;


