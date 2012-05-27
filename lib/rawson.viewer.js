/*
    class Rawson.Viewer (domElement)
    
    represents a raw image viewer that handles multiple files and
    displays them on a HTML5 canvas
*/

Rawson.Viewer = function (imageNodeId, options){
    this.canvas = document.getElementById(imageNodeId);
    var options = options || {};
    this.$metadataTable = jQuery('#metadata-info tbody');
    this.$thumbnailPane = jQuery('.thumbnails');
    this.$preview = jQuery('#preview');
    this.$previewContainer = jQuery('#preview-container');
    this._setupDrag();
    this.previews = {};
    this.plugins = [];
    this._resizeViewer();
    this._initPlugins();
    
    var resizeTimer;
    var self = this;
    $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(self._resizeViewer, 100);
    });
}

Rawson.Viewer.plugins = {};

Rawson.Viewer.registerPlugin = function (pluginObj){
    if (!pluginObj.namespace){
        throw ("missing required namespace attribute in plugin");
    }
    var prefix2pluginCfg = {
        'Rawson.PostTo': {cls: Rawson.Plugin.PostImage, menuDiv: ''},
        'Rawson.SaveAs': {cls: Rawson.Plugin.SaveAs, menuDiv: ''},
        'Rawson.ModifyImage': {cls: Rawson.Plugin.ModifyImage, menuDiv:''},
    }
     
    $.each(prefix2pluginCfg, function(prefix, cfg){
        //TODO: find the right class based on the prefix?
    });
}

Rawson.Viewer.prototype._initPlugins = function (){
    var self = this;
    $.each(Rawson.Viewer.plugins, function(ns,plugin){
        self.plugins.push(new Rawson.Plugin(plugin, self));
    });
}

Rawson.Viewer.prototype.readFiles = function (files){
    var self = this;
    for (var i = 0; i < files.length; i++){
        //show first opened preview on the canvas
        if (i == 0){
            this.readFile(files[i], function (preview){
                self.showOnCanvas(preview.id);
            });
        }
        else {
            this.readFile(files[i]);
        }
    }
}


Rawson.Viewer.prototype.readFile = function (file, callback){
    if (this.isOpen(file.name)){
        return false;
    }
    var reader = new FileReader();
    var callback = callback;
    var self = this;  
    reader.onload = function(e) {
        var preview = Rawson.Preview.fromHTML5File(file.name, e.target.result);
        preview.on('previewLoaded',function(){
            self._addThumbnail(preview);
            if (callback){
                callback(preview);
            }
        });
        self.previews[preview.id] = preview;
    };  
    reader.readAsBinaryString(file); 
}


Rawson.Viewer.prototype.isOpen = function (previewId){
    return !!this.previews[previewId];
}


Rawson.Viewer.prototype.zoomPreview = function (zoomIn){
    var scale = this.getTransformParams().scale || 1;
    scale = (zoomIn === true ? scale + 0.25: scale - 0.25);
    this.setTransformParams({scale: scale});
    this._updateTransform();
}

Rawson.Viewer.prototype.resetPreview = function (){
    this.$preview.data('scale',1);
    this.$preview.data('degrees',0);
    this._updateTransform();
}

Rawson.Viewer.prototype.showMetadata = function (previewId){
    this.$metadataTable.empty();
    var metadata = this.previews[previewId].getMetadata();
    var self = this;
    jQuery.each(metadata, function(i, metadata_item){
       self.$metadataTable.append('<tr><td>'+ metadata_item.key +'</td><td>'+ metadata_item.value+'</td></tr>'); 
    });
}

Rawson.Viewer.prototype._addThumbnail = function(preview) {
    var previewId = preview.id;
    var $thumbTemplate = $($('#thumbnail-template').html());
    $thumbTemplate.find('h5').html(previewId);
   
    $thumbTemplate.removeClass('thumbnail-template');
    $thumbTemplate.appendTo($('.thumbnails'));
    var self = this;
    $thumbTemplate.bind('click', function(){
        var fname = $(this).find('h5').text();
        self.showOnCanvas(previewId);
        self.showMetadata(previewId);
    });
     $thumbTemplate.find('img').attr('src',this.previews[previewId].toImage('jpeg',250));
}

Rawson.Viewer.prototype._resizeViewer = function (){
    var previewOffset = jQuery('#preview-container').position();
    var thumbnailOffset = jQuery('.thumbnails').position();
    jQuery('#preview-container').css({
        padding: 0,
        width: jQuery(window).innerWidth() - previewOffset.left - 40,
        height: jQuery(window).innerHeight() - previewOffset.top -40,
    });
    jQuery('.thumbnails').css({
        height: jQuery(window).innerHeight() - thumbnailOffset.top -40,
    });
}

Rawson.Viewer.prototype._setupDrag = function (){
    
    this.$preview.drag(function(ev, dd){
      $(this).css({
         top: dd.offsetY,
         left: dd.offsetX
      });
   },{ relative:true });
}



Rawson.Viewer.prototype.showOnCanvas= function (previewId) {
    $.each(this.previews,function(previewId,preview){
       preview.hide(); 
    });
    this.activePreview = this.previews[previewId];
    this.previews[previewId].show();
    this.showMetadata(previewId);
}

Rawson.Viewer.prototype.getActivePreview = function () {
    return this.activePreview;
}

Rawson.Viewer.prototype.removeAll = function (){
    this.previews = {};
    this.$metadataTable.empty();
    this.$thumbnailPane.find('li').remove();
}
