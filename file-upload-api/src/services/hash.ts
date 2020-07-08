import crypto from "crypto";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const config = {
    hashingAlgo: "Whirlpool" // MD5 or Whirlpool
}
const readFileAsync = promisify(fs.readFile);
const existsAsync = promisify(fs.exists);

export async function generateHash(filePath: string) {
    try {
        const resolvedFilePath = path.resolve(filePath); // get the absolute path before accessing the file in system
        if (await existsAsync(resolvedFilePath)) { // check the file or directory exist before accessing it.
            console.log(`hashing file from path - ${resolvedFilePath}`);
            const fileBuffer: Buffer = await readFileAsync(resolvedFilePath);  // read the file content and store in Buffer
            const sum = crypto.createHash(config.hashingAlgo);  //  create the hashing function ,, get the hashing alogrith from the config file.
            sum.update(fileBuffer);   // pass the buffer of the file to generate the hash
            const hex = sum.digest('hex');
            console.log(`hash - ${hex}`);   // print the hash
            return hex;
        }
        else
            return null;
    } catch (error) {
        throw error;
    }
}