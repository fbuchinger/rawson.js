// Rawson.Format
// 
// base class for reading and writing image formats in rawson
// subclasses need to specify a read and write method as well as the 
// mimeType and fileExtensions for the format
//

Rawson.Format = {};

Rawson.Format.Base = Rawson.Class.extend({
    // valid mime type for the format, leave undefined if not available
    mimeType: null,
    // array of valid file extensions for the given format
    fileExtensions: [],
    // read function receives a html5 file objects plus settings
    // and converts it into a Rawson.Preview object
    read: function (html5File, settings){
        return new Rawson.Preview();
    },
    // write function converts a rawson preview object 
    // into a base64 encoded image string
    //write: function (rawsonPreview, settings){
    //  return base64String;
    //},
    // helper function to download the converted image
    downloadImage: function (base64ImgData){
        var downloadMime = "image/octet-stream";
        //TODO: replace image mime type with regex
        if (base64ImgData.indexOf('image/jpeg') > -1){
            location.href = base64ImgData.replace("image/jpeg", downloadMime);
        }
        else  if (base64ImgData.indexOf('image/png') > -1) {
            location.href = base64ImgData.replace("image/png", downloadMime);
        }
    }
});



Rawson.Format.JPEG = Rawson.Format.Base.extend({
    mimeType: 'image/jpeg',
    fileExtensions: ['jpeg', 'jpg','jpe'],
    read: function (html5File, settings){
        
    },
    write: function (rawsonPreview, settings){
        return rawsonPreview.toImage('jpeg');
    },
    //conversion hook for image data (?)
    fileToImage: function (html5file, settings){
        return html5file;
    }
});

// PNG export not yet working
Rawson.Format.PNG = Rawson.Format.Base.extend({
    mimeType: 'image/png', 
    fileExtensions: ['png'],
    read: function (html5File, settings){
        
    },
    write: function (rawsonPreview, settings){
        return rawsonPreview.toImage('png');
    }
});


Rawson.Format.RAW = Rawson.Format.Base.extend({
    fileExtensions: [
        '3fr', 'ari', 'arw',
        'bay','crw','cr2','cap',
        'dcs', 'dcr','dng', 'drf',
        'eip','erf','fff', 'iiq',
        'k25', 'kdc',
        'mef', 'mos', 'mrw',
        'nef', 'nrw',
        'obm', 'orf',
        'pef', ,'ptx', 'pxn',
        'r3d', 'raf', 'raw', 'rwl', 'rw2','rwz',
        'sr2', 'srf', 'srw',
        'x3f'
    ],
    //takes html5 file data and converts it to a canvas-viewable image
    fileToImage: function (html5File, settings){
        var rawFile  = new Rawson.File(html5File, fileData);
        return rawFile.extractThumbnail();
    },
    read: function (html5File, settings){
        
    },
});
