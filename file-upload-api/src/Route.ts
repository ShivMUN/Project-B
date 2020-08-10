import * as fsExtra from "fs-extra";
import path from "path";
import express, { Application, Router, NextFunction, Response, Request } from "express";
import multer from "multer";
import mongoose from "mongoose";

import { getUserbyId, athenticateUser } from "./services/user";
import { generateHash } from "./services/hash";
import { hashIndexModel } from "./models/HashIndex";
import { fileMappingModel, IfileMapping } from "./models/FileMapping";
import config from "./config";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(__dirname, "../", "temp");
        cb(null, destinationPath)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now().toString()}_${file.originalname}`) // Appending file name and extension
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

// route download files
route.get("/download/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: fileId } = req.params;  // fetch properties from the request body of http request
        const dbRes = await hashIndexModel.findById({ _id: fileId });  // fidn the file by id in the handindexTable
        if (dbRes) {
            if (await fsExtra.pathExists(dbRes.filePath)) { // check the file path exists
                res.sendFile(dbRes.filePath);  // send the file as a response
            }
        }
        else {
            res.send({});
        }

    } catch (error) {
        res.send(error.message);
    }
});


// route list of files
route.delete("/delete/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: fileId } = req.params;  // fetch properties from the request body of http request
        const deleteRes = await fileMappingModel.findByIdAndDelete({ _id: fileId });   // delete the file of the user from the mapping table.
        if (deleteRes) {
            const duplicateRes = await fileMappingModel.findOne({ hashId: deleteRes.hashId });  // check the same file exist for the other users as well.
            if (!duplicateRes) {   // if no reference of the file exists in the db for the other users.
                const hashRes = await hashIndexModel.findByIdAndDelete({ _id: deleteRes.hashId });  // delete the file from hash index pointer Table.
                if (hashRes) {
                    if (await fsExtra.pathExists(hashRes.filePath)) {  // check the file path exists in the storage.
                        await fsExtra.remove(hashRes.filePath);   // delete the file from the fileStorage as well.
                    }
                }
            }
        }

        res.send(deleteRes ?? {}); // send the response back to the client.
    } catch (error) {
        res.send(error.message);
    }
});


// route delete of files
route.get("/files/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: userId } = req.params;  // fetch properties from the request body of http request

        // join query of the mongodb
        const aggregationJoinQuery = [
            {
                "$match": {
                    "fileOwnerId": mongoose.Types.ObjectId.createFromHexString(userId)
                }
            }, {
                "$lookup": {
                    "from": "hashindexes",
                    "localField": "hashId",
                    "foreignField": "_id",
                    "as": "hashindexes"
                }
            }, {
                "$unwind": {
                    "path": "$hashindexes",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$project": {
                    "fileName": 1,
                    "fileOwnerId": 1,
                    "filePath": "$hashindexes.filePath",
                    "id": "$hashindexes._id",
                    "contentType": "$hashindexes.contentType",
                    "size": "$hashindexes.size",
                    "_id": 1
                }
            }
        ];

        const dbRes = await fileMappingModel.aggregate(aggregationJoinQuery);
        res.send(dbRes ?? {});
    } catch (error) {
        res.send(error.message);
    }
});


route.post("/upload", upload.single("upload_file"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userSession } = req.body; // get the userSession string from the request object
        const uploadRes = await validatefile(req.file, JSON.parse(userSession)); // convert Json string to javascript Object.
        res.send(uploadRes);
    } catch (error) {
        res.send(error.message).status(500);
    }
});



async function validatefile(fileObject: any, userSession: any): Promise<responseMessage> {
    try {
        const response: responseMessage = {
            success: true
        };

        console.log(fileObject);
        const fileHash = await generateHash(fileObject.path);  // get the hash of the file by passing file path of the file stored in temp folder.
        const dbRes = await hashIndexModel.findOne({ hash: fileHash }); // check the file hash exist in the db
        if (dbRes) { // If hash exists then replace the file in the server
            if (await fsExtra.pathExists(dbRes.filePath)) { // check path exists in server
                const from = fileObject.path;
                await fsExtra.remove(from);   // delete the file from the temporary folder to the sevrver storage.

                // update the Hash pointer to the mapping (users) in the table
                const updateModel: IfileMapping = {
                    hashId: dbRes.id ?? dbRes._id,
                    fileName: fileObject.originalname,
                    fileOwnerId: userSession._id
                };

                //  filter find in the table by userIf and HashId.
                const filter = { fileOwnerId: userSession._id, hashId: dbRes.id ?? dbRes._id };
                // update query for mongoDb
                const updateRes = await fileMappingModel.findOneAndUpdate(filter, updateModel, {
                    upsert: true,  // if record  exists then updated the record else creates a new record
                    new: true  // return the full document back
                });
                response.message = "file already exists in storage ! ....uploaded successfully!";
            }

        } else { //  upload the file in the server
            const from = fileObject.path;
            const to = `${config.fileStorageDirectory}/${fileObject.filename}`;
            await fsExtra.move(from, to);  // move file from the temporary folder to the sevrver storage.
            console.log(`moved file from ${from}  - to ${to}`);

            // save the hash and the file details in the database.
            const hashModel = new hashIndexModel({
                hash: fileHash,
                fileName: fileObject.filename,
                filePath: to,
                contentType: fileObject.mimetype,
                size: fileObject.size,
            });
            const hashResponse = await hashModel.save(); // save the hash index and pointer in the mongoDb table.

            // save the hash Id with originalfile name and User's Id in the database
            const filesHashModel = new fileMappingModel({
                hashId: hashResponse.id ?? hashResponse._id,
                fileName: fileObject.originalname,
                fileOwnerId: userSession._id
            });
            const fileResponse = await filesHashModel.save(); // save the file user mapping to the table.
            response.message = "file uploaded successfully!";
        }
        return response;
    } catch (error) {
        throw error;
    }
}


type responseMessage = {
    success?: boolean,
    message?: string,
    data?: any
}





