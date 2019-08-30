//library for storing and editing data
var fs = require('fs');
var path = require('path');

//container for the module [to be exported]
var lib = {};

//base directory
lib.baseDir = path.join(__dirname, '/../.data/');

//write to files
lib.create = (dir, file, data, callback)=>{
  //open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',(err, fileDescriptor)=>{
    if(!err && fileDescriptor){
      var stringData = JSON.stringify(data);

      fs.writeFile(fileDescriptor, stringData, (err)=>{
        if(!err){
          fs.close(fileDescriptor, (err)=>{
            if(!err){
              callback(false);
            }
            else{
              callback('error closing the new file');
            }
          })
        }
        else{
          callback('could not write to the new file');
        }
      })
    }
    else{
      //could not create a newfile it may already exists
      callback('could not create a new File');
    }
  })
};

//read
lib.read = (dir, file, callback)=>{

  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',(err, data)=>{
    if(!err){
      callback(err, data);
    }
    else{
      callback(err);
    }
  })
};

lib.update = (dir, file, data, callback)=>{

   fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', (err, fileDescriptor)=>{
     if(!err && fileDescriptor){

       var stringData = JSON.stringify(data);

       fs.ftruncate(fileDescriptor, (err)=>{
         if(!err){
           fs.writeFile(fileDescriptor, stringData, (err)=>{
             if(!err){
               callback(false);
             }
             else{
               callback(err);
             }
           })
         }
         else{
           callback(err);
         }
       })

     }
   })
};
//module exports
module.exports = lib;
