const { S3 } = require('aws-sdk');
const AWS = require('aws-sdk');

const s3Bucket = new AWS.S3({
    accessKeyId: process.env.awsAccessKey,
    secretAccessKey: process.env.awsSecretkey,
    region: process.env.region,
});

function uploadOnS3(file, filename, contentType) {
    var date = new Date();
    var parentFolder = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    const params = {
        Bucket: process.env.bucket,
        Key: parentFolder + '/' + filename,
        Body: file,
        // ContentType: contentType
    };
    return new Promise(function (resolve, reject) {
        s3Bucket.upload(params, function (err, data) {
            if (err) {
                console.log('Error =>' + err);
                reject(null);
            }
            if (data != null) {
                console.log('File uploaded to S3:' + data.Location);
                resolve(data.Location);
            }
        });
        });
    }
module.exports = uploadOnS3;