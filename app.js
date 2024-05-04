const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand,PutObjectCommand,ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    }
});

async function getObjectUrl(key) {
    const command = new GetObjectCommand({
        Bucket: "public-bucket-vaneet",
        Key: key
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 20 });  //3600 -- 1 hour
    return url;
}

async function putObjectUrl(fileName,contentType){
    const command= new PutObjectCommand({
        Bucket:"public-bucket-vaneet",
        Key:`upload/${Date.now()}.jpg`,
        ContentType:contentType
    })
    const url=await getSignedUrl(s3Client,command,{expiresIn:20}) //20 second
    return url;
}

async function listObjectUrl(){
    let data=new ListObjectsV2Command({
        Bucket: "public-bucket-vaneet",
        Key:'/'
    })
    const result=await s3Client.send(data)
    return result;
}

async function deleteObject(key){
    const command=new DeleteObjectCommand({
        Bucket: "public-bucket-vaneet",
        Key:key  // to whome delete
    })
    await s3Client.send(command)
    return true
}

async function init() {
    try {
        console.log("Url of image", await getObjectUrl("finddit1.png"));
        console.log("Url of put vidio", await putObjectUrl(`vidio-${Date.now()}.mp4`,"vidio/mp4"));
        console.log("Url of put image", await putObjectUrl(`image-${Date.now()}.jpeg`,"image/jpeg"));
        console.log("All upload files in specific bucket",await listObjectUrl())
        await deleteObject("finddit1.png")

    } catch (error) {
        throw new Error("Error getting signed URL: " + error.message);
    }
}

init().catch(error => {
    console.error("Error initializing:", error);
});
