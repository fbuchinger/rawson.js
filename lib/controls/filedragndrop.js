Rawson.Control.FileDragNDrop = Rawson.Control.Base.extend({
    autoActivate: true,
    CLASS_NAME: 'Rawson.Control.FileDragNDrop',
    template: '<div class="" style="width:30%; border: 3px dashed #bbb; padding:5px;"> \
               <h3>Drag file(s) here</h3> \
                    <p style="font-size:14px;"> \
                    Supported Formats: {{formats}} \
                    </p> \
                </div>',
    viewerEvents: {
        'preview:show': '_hideDragHint',
        'preview:hide': '_showDragHint',
    },
    constructor: function (options){
        Rawson.Control.Base.prototype.constructor.apply(this, arguments);
        this.supportedExtensions = [];
        this.formats = []
        this.initFormats(this.options.formats || ['JPEG', 'PNG', 'RAW']);
    },
    setViewer: function (viewer){
        Rawson.Control.Base.prototype.setViewer.apply(this, arguments);
        this.$el = this.viewer.$previewContainer;
    },
    _hideDragHint: function (){
        if (this.$dragHint){
            this.$dragHint.hide();
        }
    },
    _showDragHint: function (){
        if (this.$dragHint){
            this.$dragHint.show();
        }
        else {
            this.render();
        }
    },
    initFormats: function (formats){
        for (var i = 0; i < formats.length; i++) {
            var format = new Rawson.Format[formats[i]];
            this.formats.push(format);
            this.supportedExtensions = this.supportedExtensions.concat(format.fileExtensions);
        }
    },
    activate: function (){
        var handlers = {};
        handlers['dragenter.' + this.id] = jQuery.proxy(this.dragEnter, this);
        handlers['dragover.' + this.id] = jQuery.proxy(this.dragOver, this);
        handlers['drop.' + this.id] = jQuery.proxy(this.drop, this);
        
        this.viewer.$previewContainer.bind(handlers);
    },
    deactivate: function (){
        this.viewer.$previewContainer.unbind('.' + this.id);
    },
    destroy: function (){
        this.viewer.$previewContainer.unbind('.' + this.id);
        this.$dragHint.remove();
    },
    dragEnter: function (e){
        e.stopPropagation();
        e.preventDefault();   
    },
    dragOver: function (e){
        e.stopPropagation();
        e.preventDefault();   
    },
    drop: function (e){
        e.stopPropagation();
        e.preventDefault();
        var dt = e.originalEvent.dataTransfer;  
        var files = dt.files;    
        this.handleFiles(files);
    },
    handleFiles: function (files){
        this.viewer.events.trigger('files:chosen', files); //the yet unopened files go here 
        var files = this.files || files;
        for (var i=0; i < files.length; i++){
            this.viewer.events.trigger('file:opened', files[i]);
        } // here too
    },
    render: function (){
        this.tpl = Handlebars.compile(this.template);
        var obj = {
            formats: this.supportedExtensions.join(', .')
        }
       
        this.$dragHint =  $(this.tpl(obj)).appendTo(this.$el);
        this.$dragHint.css({
            position: 'absolute',
            top: '50%',
            left: '50%',
        });
        this.$dragHint.appendTo(this.viewer.$previewContainer);
        this.$dragHint.css({
            marginTop: -(this.$dragHint.height()/2) + 'px',
            marginLeft: -(this.$dragHint.width()/2) + 'px'
        });
    }
});
