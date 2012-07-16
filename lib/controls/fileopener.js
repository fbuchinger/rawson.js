Rawson.Control.FileOpener = Rawson.Control.Base.extend({
    autoActivate: true,
    CLASS_NAME: 'Rawson.Control.FileOpener',
    template: '',
    modalDialogTemplate: '<div id="{{controlId}}-progressmodal" class="modal hide fade" style="display: none; "> \
        <div class="modal-header"> \
            <button type="button" class="close" data-dismiss="modal">×</button> \
            <h3>Opening Files</h3> \
        </div> \
        <div class="modal-body"> \
            <h4>Reading file <span class="filename"></span></h4><br /> \
                <div class="progress progress-striped"> \
                    <div class="bar" style="width: 0%;"></div> \
                </div> \
        </div> \
        <div class="modal-footer"> \
            <a href="#" class="btn" data-dismiss="modal">Cancel</a> \
        </div> \
    </div> ',
    menuItems: [
        {parentItem: 'file', label:'Open'}
    ],
    viewerEvents: {
        'preview:show': '_hideDragHint',
        'preview:hide': '_showDragHint',
        'files:chosen': '_openProgressDialog',
        'file:opened': '_updateProgressDialog'
    },
    constructor: function (options){
        Rawson.Control.Base.prototype.constructor.apply(this, arguments);
        this.supportedExtensions = [];
        this.fileInputContainer = options.fileInputContainer; 
        this.formats = []
        this.initFormats(options.formats);
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
    _openProgressDialog: function (files){
        var modalDialogTpl = Handlebars.compile(this.modalDialogTemplate);
        $('body').append(modalDialogTpl({controlId: this.id}));
        this.$progressModal = $('#' + this.id + '-progressmodal');
        this.progressPerFile = 100/files.length;
        this.$progressModal.modal();
    },
    _updateProgressDialog: function (file){
        var $progressBar = this.$progressModal.find('.bar');
        $progressBar.css('width', $progressBar.width() + this.progressPerFile);
        this.$progressModal.find('.filename').html(file.fileName);
    },
    _closeProgressDialog: function (){
        this.$progressModal.modal('hide');
        this.$progressModal.remove();
    },
    handleFiles: function (files){
        this.viewer.events.trigger('files:chosen', files); //the yet unopened files
        var files = this.files || files;
        for (var i=0; i < files.length; i++){
            this.viewer.events.trigger('file:opened', files[i]);
        }
        //TODO: an event for closing the dialog
    },
    render: function (){
        this.$dragHint = $('<div class="" style="width:30%; border: 3px dashed #bbb; padding:5px;"><h3>Drag file(s) here</h3><p style="font-size:14px;">Supported Formats: ' + this.supportedExtensions.join(', .') + '</p></div>');
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
        
        var self = this;
        
        var fiC = this.fileInputContainer;
        var $fileInputContainer = fiC ? $(fiC): this.viewer.$previewContainer;
         
        
        this.$fileInput = $('<input type="file" multiple="multiple" />').bind('change',function(e){
            self.handleFiles(e.originalEvent.target.files);
        }).appendTo($fileInputContainer);
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
    }
});
