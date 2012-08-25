Rawson.Control.FileOpener = Rawson.Control.Base.extend({
    autoActivate: true,
    CLASS_NAME: 'Rawson.Control.FileOpener',
    uiEvents: {
        'change input[type=file]': 'handleFiles'
    },
    constructor: function (options){
        Rawson.Control.Base.prototype.constructor.apply(this, arguments);
        this.fileInputContainer = options.fileInputContainer; 
    },
    handleFiles: function (e){
        var files = e.originalEvent.target.files;
        this.viewer.events.trigger('files:chosen', files); //the yet unopened files go here 
    },
    setViewer: function(viewer){
        var fiC = this.fileInputContainer;
        this.$el = fiC ? $(fiC): this.viewer.$previewContainer;
        Rawson.Control.Base.prototype.setViewer.apply(this, arguments);
    },
    render: function (){
        this.$fileInput = $('<input type="file" multiple="multiple" />').appendTo(this.$el);
    },
});
