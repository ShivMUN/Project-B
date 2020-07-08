export default class AppError extends Error {

    isOperational: boolean;
    message: string;

    constructor(_message = "", _isOperational = true) {
        super();
        Error.call(this);
        Error.captureStackTrace(this);
        this.message = _message;
        this.isOperational = _isOperational;
        //this.name = this.constructor.name; // Optional
    }
}


// @@ implementation usage
// throw new AppError(errorManagement.commonErrors.InvalidInput, 'Describe here what happened', true);

