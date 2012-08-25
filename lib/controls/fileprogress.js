Rawson.Control.FileProgress = Rawson.Control.Base.extend({
    autoActivate: true,
    container: 'body',
    CLASS_NAME: 'Rawson.Control.FileProgress',
    template: '<div id="{{controlId}}-progressmodal" class="modal hide" style="display: none; "> \
        <div class="modal-header"> \
            <button type="button" class="close" data-dismiss="modal">×</button> \
            <h3>Opening Files</h3> \
        </div> \
        <div class="modal-body"> \
            <h4>Reading file <span class="filename">{{fileName}}</span></h4><br /> \
                <div class="progress progress-striped"> \
                    <div class="bar" style="width: 0%;"></div> \
                </div> \
        </div> \
        <div class="modal-footer"> \
            <a href="#" class="btn" data-dismiss="modal">Cancel</a> \
        </div> \
    </div> ',
    viewerEvents: {
        'file:load': '_openProgressDialog',
        'file:loadprogress': '_updateProgressDialog',
        'file:loaded': '_closeProgressDialog'
    },
    constructor: function (options){
        Rawson.Control.Base.prototype.constructor.apply(this, arguments);
    },
    _openProgressDialog: function (file){
        var modalDialogTpl = Handlebars.compile(this.template);
        $('body').append(modalDialogTpl({controlId: this.id, fileName: file.fileName}));
        this.$progressModal = $('#' + this.id + '-progressmodal');
        this.$progressModal.modal();
    },
    _updateProgressDialog: function (file, progressEvent){
        var $progressBar = this.$progressModal.find('.bar');
        var percentComplete = progressEvent.loaded / progressEvent.total;
        var totalProgress = this.$progressModal.find('.progress').width();
        var relativeProgress = totalProgress * percentComplete;
        $progressBar.width($progressBar.width() + relativeProgress);
        this.$progressModal.find('.filename').html(file.fileName);
    },
    _closeProgressDialog: function (){
        this.$progressModal.modal('hide');
        this.$progressModal.remove();
    },
    render: function (){
        
    },
});
