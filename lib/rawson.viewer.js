/*
    class Rawson.Viewer (domElement)
    
    represents a raw image viewer that handles multiple files and
    displays them on a HTML5 canvas
*/

Rawson.Viewer = Rawson.Class.extend({
    
   constructor: function (imageNodeId, options){
        this.canvas = document.getElementById(imageNodeId);
        this.events = Rawson.Events.clone();
        this.options = options || {};
        this.$metadataTable = jQuery('#metadata-info tbody');
        this.$thumbnailPane = jQuery('.thumbnails');
        this.$preview = jQuery('#preview');
        this.$previewContainer = jQuery('#preview-container');
        this._setupDrag();
        this.previews = {};
        this.controls = [];
        this._resizeViewer();
        this._initControls();
        
        var resizeTimer;
        var self = this;
        $(window).resize(function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(self._resizeViewer, 100);
        });
        
        this.events.on('file:opened', this.readFile, this);
    },
    
    _initControls: function (){
        var self = this;
        var controls = this.options.controls;
        
        if (!jQuery.isArray(this.options.controls)){
            //TODO: add Array of default controls if no controls were specified
        }
        
        for (var i = 0; i < controls.length; i++){
            var control = controls[i];
            control.setViewer(this);
            control.render();
            if (control.autoActivate){
                control.activate();
            }
            this.controls.push(control);
        }
    },
    readFiles: function (files){
        var self = this;
        for (var i = 0; i < files.length; i++){
            //show first opened preview on the canvas
            if (i == 0){
                this.readFile(files[i], function (preview){
                    self.showOnCanvas(preview.id);
                    self.events.trigger('file:loaded', preview);
                });
            }
            else {
                this.readFile(files[i]);
            }
        }
    },
    
    readFile: function (file, callback){
        if (this.isOpen(file.name)){
            return false;
        }
        var reader = new FileReader();
        var callback = callback;
        var self = this;  
        reader.onload = function(e) {
            var preview = Rawson.Preview.fromHTML5File(file.name, e.target.result);
            preview.on('previewLoaded',function(){
                self.events.trigger('file:loaded', preview);
            });
            self.previews[preview.id] = preview;
        };  
        reader.readAsBinaryString(file); 
    },
    
    isOpen: function (previewId){
        return !!this.previews[previewId];
    },
    
    zoomPreview: function (zoomIn){
        var scale = this.getTransformParams().scale || 1;
        scale = (zoomIn === true ? scale + 0.25: scale - 0.25);
        this.setTransformParams({scale: scale});
        this._updateTransform();
    },
    
    resetPreview: function (){
        this.$preview.data('scale',1);
        this.$preview.data('degrees',0);
        this._updateTransform();
    },
    
    /*showMetadata: function (previewId){
        this.$metadataTable.empty();
        var metadata = this.previews[previewId].getMetadata();
        var self = this;
        jQuery.each(metadata, function(i, metadata_item){
           self.$metadataTable.append('<tr><td>'+ metadata_item.key +'</td><td>'+ metadata_item.value+'</td></tr>'); 
        });
    },*/
    

    
    _resizeViewer: function (){
        var previewOffset = jQuery('#preview-container').position();
        //var thumbnailOffset = jQuery('.thumbnails').position();
        jQuery('#preview-container').css({
            padding: 0,
            width: jQuery(window).innerWidth() - previewOffset.left - 40,
            height: jQuery(window).innerHeight() - previewOffset.top -40,
        });
        /*jQuery('.thumbnails').css({
            height: jQuery(window).innerHeight() - thumbnailOffset.top -40,
        });*/
    },
    //todo: _setupDrag belongs to zoom control
    _setupDrag: function (){
        this.$preview.drag(function(ev, dd){
          $(this).css({
             top: dd.offsetY,
             left: dd.offsetX
          });
       },{ relative:true });
    },
    
    showOnCanvas: function (previewId) {
        if (this.activePreview){
            this.events.trigger('preview:hide', this.activePreview);
        }
        $.each(this.previews,function(previewId,preview){
           preview.hide(); 
        });
        this.activePreview = this.previews[previewId];
        this.previews[previewId].show();
        this.events.trigger('preview:show',this.activePreview);
    },
    
    getActivePreview: function () {
        return this.activePreview;
    },
    
    removeAll: function (){
        this.previews = {};
        this.$metadataTable.empty();
        this.$thumbnailPane.find('li').remove();
    }
    
});
