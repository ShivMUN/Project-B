import { Application } from "express";
import http, { Server as httpServer } from "http";
import dotenv from "dotenv";
dotenv.config();
import app from "./App";
import logger from "./core/utility/Logger";
import config from "./config";
import dbConnection from "./core/utility/DbConnection";


const PORT: number = process.env.PORT || config.port; // get the server port number from the config File
const HOST: number = process.env.HOST || config.host; // get the server host number from the config File

const application: Application = new app().init();
const server: httpServer = http.createServer(application);



const listen = (): void => {
  server.listen(PORT,
    () => {
      logger.warn(`${config.apiName} is running in IP: ${HOST}  PORT : ${PORT}`);
      logger.info(`Worker ${process.pid} started`);
    });
};


const stopServer = (): void => {
  dbConnection.disConnect().then(() => {
    logger.info("####### MongoDb Disconnected #######");
    server.close(() => {
      logger.warn(`${config.apiName}is Stopped in IP: ${HOST}  PORT : ${PORT}`);
    });
  });
};


const startServer = (): void => {
  // *** If Db connection SuccessFul then Start the Server Else Shutdown
  const mongoUri = config.mongo.connectionUri;
  dbConnection.connect({
    connectionUri: mongoUri,
    configurations: config.mongo.options
  }).then(async () => {
    logger.info(`####### MongoDb Connected : ${mongoUri} #######`);
    listen();
  }).catch((err: Error) => {
    logger.error(err.message);
  });

};


export {
  startServer,
  stopServer
};
