// const AWS = require('aws-sdk');

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const bucketName = process.env.BUCKET_NAME
const s3 = new S3Client({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        signatureVersion: 'v4',
        region: 'ap-south-1' // Set the correct region here

});

// const AWS = require('aws-sdk');
// const bucketName = process.env.BUCKET_NAME
// const s3 = new AWS.S3({
//         accessKeyId: process.env.ACCESS_KEY_ID,
//         secretAccessKey: process.env.SECRET_ACCESS_KEY,
//         signatureVersion: 'v4',
//         region: 'ap-south-1' // Set the correct region here

// });

module.exports = {s3, bucketName};