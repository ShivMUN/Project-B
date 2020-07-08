import mongoose, { Schema, Document } from "mongoose";

export interface IhashIndex {
    hash: string;
    fileName: string;
    filePath: string;
    contentType: string;
    size: string;
}

const schema = new Schema({
    hash: {
        type: String,
        required: true,
        //   unique: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true
    },
    contentType: {
        required: true,
        type: String
    },
    size: {
        type: String,
    },
    fileOwnerId: {
        type: mongoose.Schema.Types.ObjectId
    }
},
    { timestamps: true });


export type hashIndexDocument = mongoose.Document & IhashIndex;
export const hashIndexModel = mongoose.model<hashIndexDocument>("hashindex", schema);


