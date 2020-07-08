import "reflect-metadata";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { route } from "./Route";
// import fileUpload from "express-fileupload";
import path from "path";
import fs from "fs";

import logger from "./core/utility/Logger";
import config from "./config/Index";

export default class App {

    private initRoutes(app: Application) {
        app.use(route);
        logger.info("########## Routes initialized ###########");
    }

    private initMiddleware(app: Application) {
        logger.info("########## Middleware initialized ###########");

    }

    private initSecurity(app: Application) {
        app.use(cors());
        app.use(helmet());
        logger.info("########## Security initialized ###########");

    }

    private initExternalModules(app: Application) {
        app.use(morgan("dev"));
        logger.info("########## External Modules initialized ###########");
    }

    private initFileUpload(app: Application) {
        if (!fs.existsSync(config.filePath)) {
            fs.mkdirSync(config.filePath);
        }
        // app.use(express.static(config.filePath));
        // app.use(fileUpload({
        //     useTempFiles: false,
        //     tempFileDir: path.resolve(config.filePath)
        // }));

        app.use(express.static(path.join(__dirname, config.filePath))); //serve static files of server
        //  app.use(fileUpload());
    }


    public init(): Application {
        const app: Application = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        this.initExternalModules(app);
        this.initFileUpload(app);
        this.initSecurity(app);
        this.initRoutes(app);
        this.initMiddleware(app);
        return app;
    }
}