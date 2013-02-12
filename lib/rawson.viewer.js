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
        // TODO: remove obsolete jquery variables
        this.$metadataTable = jQuery('#metadata-info tbody'); 
        this.$thumbnailPane = jQuery('.thumbnails');
        this.$preview = jQuery('#preview');
        this.$previewContainer = jQuery('#preview-container');
        this._setupDrag();
        this.previews = {};
        this.controls = [];
        this.pendingFiles = 0;
        this._resizeViewer();
        this._initControls();
        
        var resizeTimer;
        var self = this;
        $(window).resize(function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(self._resizeViewer, 100);
        });
        
        //this.events.on('file:opened', this.readFile, this);
        this.events.on('files:chosen', this._readFilesQueued, this);
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
    _readFilesQueued: function (files){
        this.allOpenedFiles = files.length;
        this.pendingFiles = files.length;
        var files = files;
        var self = this;
        function readQueued (){
            if (self.pendingFiles > 0){
                var currentFile = self.pendingFiles -1;
                var file = files.item(currentFile);
                if (file){
                    self.readFile(file, readQueued);
                }
            }
        }
        readQueued();
    },    
    readFile: function (file, callback){
        var previewId = Rawson.Preview.getId(file.name);
        // an already open file was opened again 
        // show it on canvas 
        if (this.isOpen(previewId)){
            this.viewer.showOnCanvas(previewId);
            return false;
        }
        var reader = new FileReader();
        var callback = callback;
        var self = this;
        reader.onloadstart = function (e){
            self.events.trigger('file:load', file);
        }
        reader.onprogress = function (e){
            self.events.trigger('file:loadprogress', file, e);
        }
        reader.onloadend = function (e) {
            console.log("finished reading file",e);
        }
        reader.onload = function(e) {
            console.time('toBitmap');
            var preview = Rawson.Preview.fromHTML5File(file.name, e.target.result);
            console.timeEnd('toBitmap');
            preview.on('previewLoaded',function(){
                self.events.trigger('file:loaded', preview);
                //show the first opened file in the viewer
                if (self.allOpenedFiles === self.pendingFiles){
                    self.showOnCanvas(preview.id);
                }
                 self.pendingFiles--;
                    if (self.pendingFiles === 0){
                        self.events.trigger('files:loaded');
                    }
                if (callback){
                    callback();
                }
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
