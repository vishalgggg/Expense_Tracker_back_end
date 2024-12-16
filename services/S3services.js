require('dotenv').config()
const AWS = require("aws-sdk")


const S3Services = {
    uploadtoS3(data, filename) {
        return new Promise((resolve, reject) => {
            const BUCKET_NAME = "expensetracker24323"
            const IAM_USER_KEY = process.env.AWS_IAM_USER_KEY
            const IAM_USER_SECRET = process.env.AWS_IAM_USER_SECRET

            const s3Bucket = new AWS.S3({
                accessKeyId: IAM_USER_KEY,
                secretAccessKey: IAM_USER_SECRET
            })

            // parmas object 
            let params = {
                Bucket: BUCKET_NAME,
                Key: filename,
                Body: data,
                ACL: "public-read"
            }

            // s3 uplaod function 
            s3Bucket.upload(params, (err, s3Response) => {
                if (err) {
                    console.log("Something went Wrong ", err)
                    // if there are any error 
                    reject(err)
                }
                else {
                    // now we are resolving the promise
                    resolve(s3Response.Location)
                }
            })
        })
    }


}

module.exports = S3Services