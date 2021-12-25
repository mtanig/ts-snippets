export interface ErrorType {
    code: number;
    message: string;
}

export class ApiError extends Error {
    public code: number;
    public detail: string;

    constructor(e: ErrorType, detail: string = '') {
        super(e.message);

        this.name = new.target.name;
        // If the target ts is lower than es2015, you need the following line
        Object.setPrototypeOf(this, new.target.prototype);

        this.message = e.message;
        this.code = e.code;
        this.detail = detail;
    }
}

export class ApiErrorType {
    static SERVICE_UNAVAILABLE: ErrorType = {
        code: 503,
        message: 'Service Unavailable.'
    };
    static UNKNOWN: ErrorType = {
        code: 500,
        message: 'Internal Server Error.'
    };
    static PRECONDITION_REQUIRED = {
        code: 428,
        message: 'Precondition Required.'
    };
    static TOO_EARLY = {
        code: 425,
        message: 'Too Early.'
    };
    static LOCKED: ErrorType = {
        code: 424,
        message: 'Locked.'
    };
    static NOT_FOUND: ErrorType = {
        code: 404,
        message: 'Not Found.'
    };
    static FORBIDDEN: ErrorType = {
        code: 403,
        message: 'Forbidden.'
    };
    static UNAUTHORIZED: ErrorType = {
        code: 401,
        message: 'Unauthorized.'
    };
    static BAD_REQUEST: ErrorType = {
        code: 400,
        message: 'Bad Request.'
    };
}