Rawson.Control.ThumbnailList = Rawson.Control.Base.extend({
    container: '#thumbnail-list',
    thumbnails: [],
    // thumbnail size in pixels
    thumbnailSize: 250,
    //TODO:
    template: '<ul class="thumbnails">\
               {{#each thumbnails}}\
                <li class="span6 rawson-thumbnail" data-previewid="{{this.previewId}}"> \
                    <div class="thumbnail"> \
                    <img src="{{this.thumbnailData}}" title="click on thumbnail to open in viewer" style="cursor:hand;cursor:pointer;"> \
                    <h5>{{this.filename}}</h5> \
                    </div>\
                </li>\
                {{/each}} \
              </ul>',
    uiEvents: {
        'click .rawson-thumbnail': 'loadPreview'
    },
    viewerEvents: {
        'file:loaded': '_addThumbnail',
        'file:unloaded': '_removeThumbnail'
    },
    _addThumbnail: function(preview) {
        var previewId = preview.getId();
        this.thumbnails.push({
            thumbnailData: preview.toImage('jpeg', this.thumbnailSize),
            previewId: previewId,
            filename: preview.getFilename()
        });
        this.render();
    },
    _removeThumbnail: function (preview){
        var previewId = preview.getId();
        for (var i=0; i< this.thumbnails.length; i++){
            if (this.thumbnails[i].previewId = previewId){
                this.thumbnails.splice(i,1);
            }
        }
        this.render();
    },
    loadPreview: function (e){
        var previewId = $(e.currentTarget).data('previewid');
        this.viewer.showOnCanvas(previewId);
    },
    render: function(){
        this.tpl = Handlebars.compile(this.template);
        //TODO: add the rendering of menu items
        this.$el.html(this.tpl({thumbnails: this.thumbnails}));
    },
    destroy: function (){
        //TODO: destroy control
    }
});
