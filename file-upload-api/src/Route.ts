import * as fsExtra from "fs-extra";
import path from "path";
import express, { Application, Router, NextFunction, Response, Request } from "express";
import multer from "multer";

import { getUserbyId, athenticateUser } from "./services/user";
import { generateHash } from "./services/hash";
import { hashIndexModel } from "./models/HashIndex";

const config = {
    fileStorageDirectory: path.resolve(path.join(__dirname, "../", "file-storage"))
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(__dirname, "../", "temp");
        cb(null, destinationPath)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now().toString()}_${file.originalname}`) //Appending file name and extension
    }
})

const upload = multer({ storage });

export const route = Router();

route.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName, password } = req.body;  // fetch properties from the request body of http request
        const userRes = await athenticateUser(userName, password);
        res.send(userRes ?? null);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

route.get("/index", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName, password } = req.body;  // fetch properties from the request body of http request
        const userRes = await getUserbyId("");
        res.send(userRes ?? null);
    } catch (error) {
        res.send(error.message);
    }
});

// route list of files
// route delete of files
// route download files

route.get("/allFilesBySession", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;  // fetch properties from the request body of http request
        const dbRes = await hashIndexModel.findOne({ fileOwnerId: userId });
        res.send(dbRes ?? {});
    } catch (error) {
        res.send(error.message);
    }
});


route.post("/upload", upload.single("upload_file"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userSession } = req.body; // get the userSession string from the request object
        await validatefile(req.file, JSON.parse(userSession)); // convert Json string to javascript Object.
        res.send({} ?? null);
    } catch (error) {
        res.send(error.message).status(500);
    }
});


async function validatefile(fileObject: any, userSession: any) {
    try {
        console.log(fileObject);
        const fileHash = await generateHash(fileObject.path);  // get the hash of the file by passing file path of the file stored in temp folder.
        // check the file hash exist in the db
        const exists = await hashIndexModel.exists({ hash: fileHash, fileOwnerId: userSession._id });
        if (exists) {

        } else {
            const from = fileObject.path;
            const to = `${config.fileStorageDirectory}/${userSession._id}/${fileObject.originalname}`;
            await fsExtra.move(from, to);
            console.log(`moved file from ${from}  - to ${to}`);
            const model = new hashIndexModel({
                hash: fileHash,
                fileName: fileObject.originalname,
                filePath: to,
                contentType: fileObject.mimetype,
                size: fileObject.size,
                fileOwnerId: userSession._id
            });
            await model.save();
        }
    } catch (error) {
        console.log(error);
    }
}










