import mongoose, { Schema, Document } from "mongoose";

export interface IfileMapping {
    hashId: string;
    fileName: string;
    fileOwnerId: string;
}

const schema = new Schema({
    hashId: {
        type: mongoose.Schema.Types.ObjectId
    },
    fileName: {
        type: String,
        required: true,
    },
    fileOwnerId: {
        type: mongoose.Schema.Types.ObjectId
    }
},
    { timestamps: true });


export type fileMappingDocument = mongoose.Document & IfileMapping;
export const fileMappingModel = mongoose.model<fileMappingDocument>("filemapping", schema);


