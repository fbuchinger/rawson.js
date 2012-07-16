Rawson.Plugin = {};
// Rawson.Plugin.Base
// 
// general base class for plugins
// deals with menu item adding, options management etc.
//
Rawson.Plugin.Base = Rawson.Class.extend({
    constructor: function (viewer){
        this.rootNode = $(this.menuNode);
        this.viewer = viewer;
        this.settings = {};
        this._addMenuEntry();
    },
    _addMenuEntry: function (){
        var clickHandler = $.proxy(this.onClick, this);
        $(' <li><a href="#">'+this.menuText+'</a></li>')
            .after(this.rootNode)
            .bind('click', clickHandler);
    }
});











/*
Rawson.Plugin = function (pluginObj, viewer){
    $.extend(this, pluginObj);
    this.rootNode = $('#file-menu');
    this.viewer = viewer;
    this.settings = {};
    this._addMenuEntry();
}

Rawson.Plugin.prototype = {
    _addMenuEntry: function (){
        var clickHandler = $.proxy(this.onClick, this);
        $(' <li><a href="#">'+this.namespace+'</a></li>')
            .appendTo(this.rootNode)
            .bind('click', clickHandler);
    },
    onClick: function (){
        if (this.saveImage){
            this.downloadImage(this.saveImage(this.viewer.getActivePreview(),this.settings));
        }
        else if (this.exportImage){
            this.exportImage(this.viewer.getActivePreview(), this.settings);
        }
    },
    downloadImage: function (base64ImgData){
        var downloadMime = "image/octet-stream";
        //TODO: replace image mime type with regex
        if (base64ImgData.indexOf('image/jpeg') > -1){
            location.href = base64ImgData.replace("image/jpeg", downloadMime);
        }
        else  if (base64ImgData.indexOf('image/png') > -1) {
            location.href = base64ImgData.replace("image/png", downloadMime);
        }
        
    }
}
*/

/*
Rawson.Viewer.registerPlugin({
    namespace: 'Rawson.ExportTo.ImgUr',
    apikey: '98998b9d9a3a7df943fe07238321f063',
    //postImage
    exportImage: function (rawsonPreview, settings, callback){
 
        var fd = new FormData();
        fd.append("image", rawsonPreview.toBlob('jpeg')); // Append the file - TODO: canvas.toBlob is async in Chrome - supply the blobbed image as argument?
        fd.append("key", '98998b9d9a3a7df943fe07238321f063');
        // Get your own key: http://api.imgur.com/
        // Create the XHR (Cross-Domain XHR FTW!!!)
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://api.imgur.com/2/upload.json"); // Boooom!
        xhr.onload = function() {
            // Big win!
            // The URL of the image is:
            alert(JSON.parse(xhr.responseText).upload.links.imgur_page);
        }
        // Ok, I don't handle the errors. An exercise for the reader.
        // And now, we send the formdata
        xhr.send(fd);
    }
});*/



