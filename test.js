



var Module = {
      noInitialRun: true,
      printErr: function(data){alert(data)}
    };  

var fs = require('fs');
var dcraw = require('./build/dcraw.js');
var dcraw_wrapper = require('./lib/dcraw-wrapper.js');
//var libraw = require('./lib/dcraw_raw_to_ppm.js');

//libraw.run(['samples/RAW_CANON_G2.CRW'])

// Force encoding to ascii text
var filename = 'RAW_CANON_G2.CRW';
fs.readFile('samples/' + filename, function(err,data){
  if(err) {
    console.error("Could not open file: %s", err);
    process.exit(1);
  }

  rawFile = new dcraw_wrapper.DCRawFile(filename, data);
  outputBuffer = rawFile.toBitmap();
  console.log(outputBuffer.slice(15,30));
  var outfile = filename.split('.')[0] + '.ppm';
  var pnmOut = '';
  for (var i = 0, ii = outputBuffer.length;i < ii; i++){
    pnmOut += String.fromCharCode(outputBuffer[i]);
  }
  fs.writeFile(outfile, pnmOut,'binary',function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
  }); 
  //console.log(rawFile.getMetadata());
});



