Rawson.Plugin.ModifyImage = Rawson.Plugin.Base.extend({
    menuNode: '#image-menu',
    onClick: function (){
        if (this.modifyImage){
            this.modifyImage(this.viewer.getActivePreview(),this.settings);
        }
    },
    modifyImage: function (rawsonPreview, settings){
        //in-place modification of the image happens here
    }
});
