const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');








const s3 = new AWS.S3({
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function listAllObjectsFromS3Bucket(bucket, prefix, filter = /.*/,command=(item)=>{}) {
  let isTruncated = true;
  let marker;
  while(isTruncated) {
    let params = { Bucket: bucket };
    if (prefix) params.Prefix = prefix;
    if (marker) params.Marker = marker;
    try {
      const response = await s3.listObjects(params).promise();
      response.Contents.forEach(item => {
        !item.Key.match(filter) || ((console.log(item.Key) && result.push(item.Key)));
        command(item.Key);
      });
      isTruncated = response.IsTruncated;
      if (isTruncated) {
        marker = response.Contents.slice(-1)[0].Key;
      }
  } catch(error) {
      throw error;
    }
  }


}






const filePath = "./data/file.txt";

//configuring parameters
var params = {
  Bucket: 'lcloud-427-ag',
  Body : fs.createReadStream(filePath),
  Key : "folder/"+Date.now()+"_"+path.basename(filePath)
};


s3.upload(params, function (err, data) {
  //handle error
  if (err) {
    console.log("Error", err);
  }

  //success
  if (data) {
    console.log("Uploaded in:", data.Location);
  }
});


//listAllObjectsFromS3Bucket('lcloud-427-ag',null);






listAllObjectsFromS3Bucket('lcloud-427-ag',null,/410756/,deleteFile);

function deleteFile(item){
  const params = {
  Bucket: 'lcloud-427-ag',
  Key: item

};

s3.deleteObject(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
    //console.log(toRemove);
}


//process.exit();

// const deleteParam = {
//     Bucket: 'lcloud-427-ag',
//     Delete: {
//         Objects: [
//             {Key: 'a.txt'},
//             {Key: 'b.txt'},
//             {Key: 'c.txt'}
//         ]
//     }
// };
// s3.deleteObjects(deleteParam, function(err, data) {
//     if (err) console.log(err, err.stack);
//     else console.log('delete', data);
// });
