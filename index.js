const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');



const filePath = "./data/file.txt";
const params = {
  Bucket: 'lcloud-427-ag',
  Body: fs.createReadStream(filePath),
  Key: "folder/" + Date.now() + "_" + path.basename(filePath)
};
const s3 = new AWS.S3({
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});




async function listAllObjectsFromS3Bucket(bucket, prefix, filter = /.*/, command = (item) => {}) {
  let isTruncated = true;
  let marker;

  
  while (isTruncated) {

    let params = {
      Bucket: bucket
    };

    if (prefix) {
      params.Prefix = prefix;
    };

    if (marker) {
      params.Marker = marker;
    };

    try {

      const response = await s3.listObjects(params).promise();

      response.Contents.forEach(item => {
        console.log(item.Key);
        !item.Key.match(filter) || ((console.log(item.Key) && result.push(item.Key)));
        command(item.Key);
      });

      isTruncated = response.IsTruncated;

      if (isTruncated) {
        marker = response.Contents.slice(-1)[0].Key;
      }

    } catch (error) {
      throw error;
    }
  }
}



s3.upload(params, (err, data) => {
  if (err) {
    console.log("Error", err);
    return;
  }
  if (data) {
    console.log("Uploaded in:", data.Location);
  }
});



listAllObjectsFromS3Bucket('lcloud-427-ag',null).then(
()=>{
  listAllObjectsFromS3Bucket('lcloud-427-ag', null, /11/, deleteFile);
}

);




function deleteFile(item) {
  const params = {
    Bucket: 'lcloud-427-ag',
    Key: item
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.log("Error", err);
      return;
    }

    if (data) {
      console.log(data);
    }
  });

}
