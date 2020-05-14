require('dotenv/config');

import multer from 'multer';
import path from 'path';
import B2 from 'backblaze-b2';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import crypto from 'crypto';

import { extname } from 'path';


const storageTypes = {
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'keid',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                const fileName = hash.toString('hex') + extname(file.originalname);
                console.log(fileName);
                
                cb(null, fileName);
            })
        }
    }),
}

export = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes['s3'] ,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('invalid file type'));
        }
    }
}