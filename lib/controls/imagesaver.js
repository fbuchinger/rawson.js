Rawson.Control.ImageSaver = Rawson.Control.Base.extend({
    autoActivate: false,
    CLASS_NAME: 'Rawson.Control.ImageSaver',
    menuItems: function (){
        var saveFileEntries = [];
        for (format in Rawson.Format){
            var formatInst = new Rawson.Format[format];
            if (formatInst.write){
                saveFileEntries.push({parentItem: 'file', label:'Save as ' + format, action: function(){
                    var imageBlob = formatInst.write(this.viewer.getActivePreview());
                    this.saveImage(formatInst.mimeType, imageBlob);
                }});
            }
        }
        return saveFileEntries;
    },
    //TODO: assign a filename when possible
    saveImage: function (mimeType,imageBlob){
         var downloadMime = "image/octet-stream";
         location.href = imageBlob.replace(mimeType, downloadMime);
    },
    //TODO: save all opened files by stuffing them into a zip archive
    saveAll: function (){
        
    }
});
