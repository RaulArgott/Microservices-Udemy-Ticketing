export abstract class CustomError extends Error {
    abstract statusCode: number;
    /**
     * Abstract method to return an array of objects
     * each containing a message and optionally a field
     * property. The message is the error message and
     * the field property is the field that caused the
     * error.
     */
    abstract serializeErrors(): {
        message: string;
        field?: string;
    }[];

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}