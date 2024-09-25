import upload from "../middleware/upload.js"; // Middleware de upload
import config from "../config.json" assert { type: "json" };
import { MongoClient, GridFSBucket } from "mongodb";

const mongoClient = new MongoClient(config.mongoURI);

const baseUrl = "http://localhost:3000/files/";
const uploadFiles = async (req, res, next) => {
  try {
    await upload(req, res, (err) => {
      if (err) {
        return res.status(500).send({
          message: `Error when trying to upload files: ${err.message}`,
        });
      }

      if (req.files.length <= 0) {
        return res.status(400).send({ message: "You must select at least 1 file." });
      }

      // Continue to the next middleware/controller
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: `Error when trying to upload files: ${error.message}`,
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const images = database.collection(dbConfig.imgBucket + ".files");

    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const download = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucket,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};


export { uploadFiles, getListFiles, download };
