Rawson.Control.ImagePoster = Rawson.Control.Base.extend({
    menuItems: function (){
        var serviceEntries = [];
        for (service in Rawson.Service){
            var serviceInst = new Rawson.Service[service];
            if (serviceInst.requestURL){
                //TODO: repair scope issues w services
                serviceEntries.push({parent: 'file', label:'Post to ' + service, action: function(){
                     var previewBlob = this.viewer.getActivePreview().toBlob('jpeg'); //TODO: make this async
                     serviceInst.postData(serviceInst.requestURL, serviceInst.requestData(previewBlob, serviceInst.settings));
                }});
            }
        }
        return serviceEntries;
    }
});
