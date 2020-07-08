import { IUser, UserDocument, user } from "../models/User";




export async function athenticateUser(userName: string, password: string) {
    const res = await user.findOne({ userName, password });
    console.log(res);
    return res;
}


export async function getUserbyId(id: string) {
    const res = await user.find({ _id: id });
    console.log(res);
    return res;

}