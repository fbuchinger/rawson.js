Rawson.Control.MetadataTable = Rawson.Control.Base.extend({
    container: '#2',
    metadata: [],
    template: '<h3>Image Metadata</h3>\
             <table id="metadata-info" class="table-condensed table-striped">\
                <thead>\
                  <tr>\
                    <th>Field</th>\
                    <th>Value</th>\
                  </tr>\
                </thead>\
                <tbody>\
                    {{#each metadata}}\
                    <tr><td>{{this.key}}</td><td>{{this.value}}</td></tr>\
                    {{/each}}\
                </tbody>\
             </table>',
    viewerEvents: {
        'preview:show': '_renderMetadata',
        'preview:hide': '_clearMetadata'
    },          
    _renderMetadata: function (preview){
        this.metadata = preview.getMetadata();
        this.render();
    },
    _clearMetadata: function (preview){
        this.metadata = [];
        this.render();
    },
    render: function(){
        this.tpl = Handlebars.compile(this.template);
        var obj = {
            metadata: this.metadata
        }
        //TODO: add the rendering of menu items
        this.$el.html(this.tpl(obj));
    }
});
