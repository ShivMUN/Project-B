import winston from "winston";

class Logger {

    private log: boolean;
    private logger: winston.Logger;


    constructor() {
        this.log = Boolean(process.env.LOG) || false;  // Rnd
        this.logger = this.initLogger();
    }


    initLogger() {
        const _logger = winston.createLogger();

        _logger.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.colorize({ all: true })
            ),
        }));

        return _logger;
    }

    info(message: any): void {
        if (this.log) this.logger.info(message);
    }

    warn(message: any): void {
        if (this.log) this.logger.warn(message);
    }

    error(message: any): void {
        if (this.log) this.logger.error(message);
    }

    debug(message: any): void {
        if (this.log) this.logger.debug(message);
    }

}

export default new Logger();
