Rawson.Control.ImageSaver = Rawson.Control.Base.extend({
    autoActivate: false,
    CLASS_NAME: 'Rawson.Control.ImageSaver',
    viewerEvents: {
        'file:load': 'activate',
        'file:unload': 'deactivate',
    },
    menuItems: function (){
        var saveFileEntries = [];
        for (format in Rawson.Format){
            var formatInst = new Rawson.Format[format];
            if (formatInst.write){
                saveFileEntries.push({parentItem: 'file', label:'Save as ' + format, id: 'save-as-' + format, action: this.writeBlob, actionParams: {format: format}});
            }
        }
        return saveFileEntries;
    },
    writeBlob: function (params){
        var formatInst = new Rawson.Format[params.format];
        var imageBlob = formatInst.write(this.viewer.getActivePreview());
        var downloadMime = "image/octet-stream";
        location.href = imageBlob.replace(formatInst.mimeType, downloadMime);
    },
    //TODO: save all opened files by stuffing them into a zip archive
    saveAll: function (){
        
    }
});
