// Rawson.Service
// 
// base class for plugins that post the current preview to various web services (e.g. img.ur)
// plugins need to overwrite the following methods and properties:
// 
//

Rawson.Service = {};

Rawson.Service.Base = Rawson.Class.extend({
    onClick: function (){
        var previewBlob = this.viewer.getActivePreview().toBlob('jpeg'); //TODO: make this async
        this.postData(this.requestURL, this.requestData(previewBlob, this.settings));
    },
    // onSuccess (ajaxResponse)
    //
    // callback that gets invoked when the request successfully completed
    onSuccess: function (response){
        
    },
    // onError (ajaxResponse)
    //
    // callback that gets invoked when the request triggered an error
    onError: function (response){
    
    },
    postData: function (url, data){
        var fd = new FormData();
        $.each(data, function (key, value){
           fd.append(key, value); 
        });
        
        $.ajax({
            url: url,
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            context: this,
            success: onSuccess,
            error: onError
        });
    },
    // requestURL
    //
    // API endpoint to which the request should be sent
    // can also be a passed in as a method requestURL (settings) {}
    // so that the requestURL can be determined dynamically, i.e. based on 
    // settings
    // requestURL: '',
    requestData: function (previewBlob, settings){
        return {}
    }
});


Rawson.Service.Imgur = Rawson.Service.Base.extend({
    settings : {
        api_key: '98998b9d9a3a7df943fe07238321f063' // use your own
    },
    requestURL: "http://api.imgur.com/2/upload.json",
    requestData: function (previewBlob, settings){
        return {
            image: previewBlob,
            key: settings.api_key
        }
    },
    onSuccess: function (response){
         alert("Sucessfully posted photo to" + response.upload.links.imgur_page);
    }, 
}); 

