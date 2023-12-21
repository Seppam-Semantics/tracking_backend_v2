
var service = require('../config/s3');
const { v4: uuidv4 } = require('uuid');

async function uploadS3(attachment) {
    return new Promise((resolve, reject) => {
        const folderName = 'attachments';
        const objectKey = `${folderName}/${uuidv4()}/${attachment.name}`;

        const params = {
            Bucket: service.bucketName,
            Key: objectKey,
            Body: attachment.data
        };

        service.s3.upload(params, function (err, data) {
            if (err) {
                resolve('')
            } else {
                resolve(data)
            }
        });
    });
}
async function uploadS3Task(attachment) {
    return new Promise((resolve, reject) => {
        const folderName = 'task-attachments';
        const objectKey = `${folderName}/${uuidv4()}/${attachment.name}`;

        const params = {
            Bucket: service.bucketName,
            Key: objectKey,
            Body: attachment.data
        };


        service.s3.upload(params, function (err, data) {
            if (err) {
                resolve('')
            } else {
                resolve(data)
            }
        });
    });
}

async function uploadS3SuratTask(attachment) {
    return new Promise((resolve, reject) => {
        const folderName = 'surat-attachments';
        const objectKey = `${folderName}/${uuidv4()}/${attachment.name}`;

        const params = {
            Bucket: service.bucketName,
            Key: objectKey,
            Body: attachment.data
        };

        service.s3.upload(params, function (err, data) {
            if (err) {
                resolve('')
            } else {
                resolve(data)
            }
        });
    });
}


//multiple attachment send n s3 using loop
async function uploadTaskS3(attachments) {
    const uploadedAttachments = [];

    for (const attachment of attachments) {
        const folderName = 'taskAttachments';
        const objectKey = `${folderName}/${uuidv4()}/${attachment.name}`;

        const params = {
            Bucket: service.bucketName,
            Key: objectKey,
            Body: attachment.data
        };

        try {
            // Validate the Body parameter
            if (!params.Body) {
                throw new Error('Attachment data (params.Body) is required.');
            }

            const data = await service.s3.upload(params).promise();
            uploadedAttachments.push(data);
        } catch (err) {
            console.error('Error uploading attachment:', err.message);
        }
    }

    return uploadedAttachments;
}




async function downloadS3(storageId) {

    const params = {
        Bucket: service.bucketName,
        Key: storageId,
    };

    return new Promise((resolve, reject) => {
        service.s3.getObject(params, (err, data) => {
            if (err) {
                console.log(err)
                resolve('')
            } else {
                console.log("data.Body")
                resolve(data.Body)
            }
        });
    });
}

async function downloadOtoboxApp() {

    const params = {
        Bucket: 'dev.otomatelog.com',
        Key: 'otobox-exe/otobox Setup 1.0.0.exe',
    };

    return new Promise((resolve, reject) => {
        service.s3.getObject(params, (err, data) => {
            if (err) {
                console.log(err)
                resolve('')
            } else {
                console.log("data.Body")
                resolve(data.Body)
            }
        });
    });
}

async function downloadS3FullData(storageId) {

    const params = {
        Bucket: service.bucketName,
        Key: storageId,
    };

    return new Promise((resolve, reject) => {
        service.s3.getObject(params, (err, data) => {
            if (err) {
                console.log(err)
                resolve('')
            } else {
                console.log("data")
                resolve(data)
            }
        });
    });
}

async function uploadS3logs(attachment) {
    return new Promise((resolve, reject) => {
        const folderName = 'logs';
        const objectKey = `${folderName}/${uuidv4()}/${attachment.name}`;

        const params = {
            Bucket: service.bucketName,
            Key: objectKey,
            Body: attachment.data
        };

        service.s3.upload(params, function (err, data) {
            if (err) {
                resolve('')
            } else {
                resolve(data)
            }
        });
    });
}

async function deleteS3(objectKey) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: service.bucketName,
            Key: objectKey
        };

        service.s3.deleteObject(params, function (err, data) {
            if (err) {
                reject(err); // If there's an error, reject the promise
            } else {
                resolve(data); // If successful, resolve the promise
            }
        });
    });
}

async function generateS3ViewLink(storageId) {
    const params = {
        Bucket: service.bucketName,
        Key: storageId,
    };

    // Generate pre-signed URL 
    const url = service.s3.getSignedUrl('getObject', {
        Bucket: params.Bucket,
        Key: params.Key,
        Expires:  86400 ,
        ResponseContentDisposition: 'inline',
    });

    return url;
}
module.exports = { uploadS3, deleteS3,uploadTaskS3, downloadS3, downloadS3FullData, uploadS3logs, downloadOtoboxApp, uploadS3Task ,uploadS3SuratTask,generateS3ViewLink};
