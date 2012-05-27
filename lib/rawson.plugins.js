Rawson.Plugin = {};
// Rawson.Plugin.Base
// 
// general base class for plugins
// deals with menu item adding, options management etc.
//
Rawson.Plugin.Base = Rawson.Class.extend({
    constructor: function (pluginObj, viewer){
        $.extend(this, pluginObj);
        this.rootNode = $('#file-menu');
        this.viewer = viewer;
        this.settings = {};
        this._addMenuEntry();
    },
    _addMenuEntry: function (){
        var clickHandler = $.proxy(this.onClick, this);
        $(' <li><a href="#">'+this.namespace+'</a></li>')
            .appendTo(this.rootNode)
            .bind('click', clickHandler);
    }
});

// Rawson.Plugin.SaveImage
// 
// base class for plugins that save the current preview into various formats
// plugins only need to overwrite the saveImage method
//

Rawson.Plugin.SaveImage = Rawson.Plugin.Base.extend({
    onClick: function (){
        if (this.saveImage){
            this.downloadImage(this.saveImage(this.viewer.getActivePreview(),this.settings));
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
});

// Rawson.Plugin.PostImage
// 
// base class for plugins that post the current preview to various web services (e.g. img.ur)
// plugins need to overwrite the following methods and properties:
// 
//

Rawson.Plugin.PostImage = Rawson.Plugin.Base.extend({
    onClick: function (){
        var previewBlob = this.viewer.getActivePreview().toBlob('jpeg'); //TODO: make this async
        this.postData(this.requestURL, this.requestData(previewBlob, this.settings));
    },
    // onSuccess (ajaxResponse)
    //
    // callback that gets invoked when the request successfully completed
    onSuccess: function (response){
        
    },
    // onError (ajaxResponse)
    //
    // callback that gets invoked when the request triggered an error
    onError: function (response){
    
    },
    postData: function (url, data){
        var fd = new FormData();
        $.each(data, function (key, value){
           fd.append(key, value); 
        });
        
        $.ajax({
            url: url,
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            context: this,
            success: onSuccess,
            error: onError
        });
    },
    // requestURL
    //
    // API endpoint to which the request should be sent
    // can also be a passed in as a method requestURL (settings) {}
    // so that the requestURL can be determined dynamically, i.e. based on 
    // settings
    requestURL: '',
    requestData: function (previewBlob, settings){
        return {}
    }
});

Rawson.Plugin.ModifyImage = Rawson.Plugin.Base.extend({
    onClick: function (){
        if (this.modifyImage){
            this.modifyImage(this.viewer.getActivePreview(),this.settings);
        }
    },
    modifyImage: function (rawsonPreview, settings){
        //in-place modification of the image happens here
    }
});

Rawson.Plugin.Imgur = Rawson.Plugin.PostImage.extend({
    namespace: 'Rawson.PostTo.ImgUr',
    settings : {
        api_key: '98998b9d9a3a7df943fe07238321f063'
    }
    requestURL: "http://api.imgur.com/2/upload.json",
    requestData: function (previewBlob, settings){
        return {
            image: previewBlob,
            key: settings.api_key
        }
    },
    onSuccess: function (response){
         alert(response.upload.links.imgur_page);
    }, 
}); 


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


Rawson.Viewer.registerPlugin({
    //namespace must be unique within all plugins
    //use Rawson.SaveAs ... namespace to be listed in the file menu
    namespace: 'Rawson.SaveAs.JPEG',
    saveImage: function (rawsonPreview, settings){
        return rawsonPreview.toImage('jpeg');
    }
});

Rawson.Viewer.registerPlugin({
    namespace: 'Rawson.SaveAs.PNG',
    saveImage: function (rawsonPreview, settings){
        return rawsonPreview.toImage('png');
    }
});

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
});



