import mongoose, { Schema, Document } from "mongoose";

export interface IUser {
    id: string;
    name: string;
    userName: string;
    password: string;
    picture: string;
}

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        required: true,
        type: String
    },
    picture: {
        type: String,
    }

});


export type UserDocument = mongoose.Document & IUser;
export const user = mongoose.model<UserDocument>("user", userSchema);


