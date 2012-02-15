



var Module = {
      noInitialRun: true,
      printErr: function(data){alert(data)}
    };  

var fs = require('fs');
//var dcraw = require('./lib/dcraw.min.js');
var dcraw_wrapper = require('./lib/dcraw-wrapper.js');

// Force encoding to ascii text
fs.readFile('samples/RAW_CANON_G2.CRW', function(err,data){
  if(err) {
    console.error("Could not open file: %s", err);
    process.exit(1);
  }
  rawFile = new dcraw_wrapper.DCRawFile('RAW_CANON_G2.CRW', data);
  rawFile.dcraw.run(['-h','/RAW_CANON_G2.CRW']);
  var outputBuffer = rawFile.FS.root.contents['RAW_CANON_G2.ppm'].contents;
  console.log(outputBuffer.slice(15,30));
  var pnmOut = '';
  for (var i = 0, ii = outputBuffer.length;i < ii; i++){
    pnmOut += String.fromCharCode(outputBuffer[i]);
  }
  fs.writeFile("test.ppm", pnmOut,'ascii',function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
  }); 
  //console.log(rawFile.getMetadata());
});


