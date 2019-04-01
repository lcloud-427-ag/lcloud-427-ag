const AWS = require('aws-sdk');
const fs = require('fs');



const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Argparse example'
});
parser.addArgument(
  ['-l', '--list'], {
    help: 'List'
  }
);
parser.addArgument(
  ['-u', '--upload'], {
    help: 'Upload <file>'
  }
);
parser.addArgument(
  ['-d', '--delete'],

  {
    help: 'Delete <regexp>'
  }
);
const args = parser.parseArgs();


let params = null;

if (args.upload) {
  params = {
    Bucket: 'lcloud-427-ag',
    Body: fs.createReadStream(args.upload),
    Key: args.upload
  };

}

const s3 = new AWS.S3({
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


if (args.list) {
  listAllObjectsFromS3Bucket('lcloud-427-ag', null).then().catch(e => {
    console.log(error);
  });
  console.log('asas');
} else if (args.upload) {

  s3.upload(params, (err, data) => {
    if (err) {
      console.log("Error", err);
      return;
    }
    if (data) {
      console.log("Uploaded in:", data.Location);
    }
  });


} else if (args.delete) {
  listAllObjectsFromS3Bucket('lcloud-427-ag', null, new RegExp(args.delete), deleteFile)
}

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