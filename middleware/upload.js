import multer from "multer";
import * as util from "util";
import { GridFsStorage } from "multer-gridfs-storage";
import dbConfig from "../config.json" assert { type: "json" };

const generateFilename = (file) =>
  `${Date.now()}-istvshop-${file.originalname}`;

const isFileTypeValid = (file) => {
  const validTypes = ["image/png", "image/jpeg"];
  return validTypes.includes(file.mimetype);
};

const storage = new GridFsStorage({
  url: `${dbConfig.url}/${dbConfig.database}`,
  file: (req, file) => {
    if (!isFileTypeValid(file)) {
      return generateFilename(file); // Retorna nome do arquivo se o tipo for inválido
    }

    return {
      bucketName: dbConfig.imgBucket, // Nome do bucket
      filename: generateFilename(file), // Nome do arquivo gerado
    };
  },
});

const uploadFiles = multer({ storage }).array("file", 10);
const upload = util.promisify(uploadFiles);

export default upload;
