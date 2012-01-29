/*
   dcraw-wrapper.js

   convenience wrapper for commonly needed dcraw functions.
   (c) 2012 by Franz Buchinger (fbuchinger@gmail.com)
    
   dual-licensed under GPL and MIT license      
*/

/*
    class DCRawFile (filename, rawfileData)
    
    represents a camera raw file
*/
function DCRawFile (fname, data){
    this.rawFile = FS.createDataFile('/', fname, data, true, true);
    this.filename = fname;
}

/*
    getMetadata()
    fetches the metadata of the raw file image
*/
DCRawFile.prototype.getMetadata = function (){
    var metadata = '';
    var metadataFName = this.filename + '.metadata';
    this.metadataFile = FS.createDataFile('/', metadataFName, [], true, true);
    run(['-v', '-i', '/' + this.filename, '>', '/' + metadataFName]);
    
}

/*
    extractThumbnail()
    extracts the thumbnail image of the raw file
*/
DCRawFile.prototype.extractThumbnail = function (){
    run(['-e', '/' + this.filename]);
	var thumbName = this.filename.split('.')[0] + '.thumb.jpg';
	var thumbnailData = FS.root.contents[thumbName].contents;
    return this._toDataURI(thumbnailData,'image/jpeg');
}

DCRawFile.prototype.PPMtoBMP = function (ppmdata){
    
}

/*
    _toDataURI(data, mimeType)
    internal helper function for base64-encoding data
*/
DCRawFile.prototype._toDataURI = function (data,mimeType){
    var base64str = '';
    var dataLen = data.length;
	for (var i = 0; i < dataLen; i++){
		base64str += String.fromCharCode(data[i]);
	}
    return "data:" + mimeType + ";base64," + window.btoa(base64str);
}



function RawPreview (imageNodeId){
    this.img = document.getElementById(imageNodeId);
}

RawPreview.prototype.loadImageFromData = function (imgData) {
    this.img.src = imgData;
}
