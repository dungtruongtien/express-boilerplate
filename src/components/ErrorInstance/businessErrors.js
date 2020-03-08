import { AppError } from './appErrors';

export class BusinessError extends AppError {
    constructor(message = 'There is business error happened') {
        super(message);
        this.name = 'BusinessError';
        this.status = 400;
    }
}

/**
* pageNotFoundMiddleware - Returns a 404 Page not Found error it the route requested
* is not matched with any corresponding route.
*
* @param  {Object} req - Express request object
* @param  {Object} res - Express response object
* @return {Undefined}  - A 404 not found error
*/
export class APINotFoundError extends BusinessError {
    constructor(message = 'API not found') {
        super(message);
        this.name = 'APINotFoundError';
        this.status = 404;
    }
}

/**
* ValidationError - Returns an Error message for Sequelize validation with
* information about what's wrong
*
* @param  {Object} error - Validation error from  Sequelize
* @return {Object}  - A ValidationError object
*/
export class DataValidationError extends BusinessError {
    constructor(err, sequelize) {
        super(err.message);
        this.name = 'DataValidationError';
        this.status = 400;
        if (err instanceof sequelize.ValidationError) {
            this.payload = err.errors.reduce((finalErrors, itemError) => ({
                ...finalErrors,
                [itemError.path]: {
                    message: itemError.message,
                    type: itemError.validatorKey,
                    context: {
                        value: itemError.value,
                        agrs: itemError.validatorArgs
                    }
                }
            }), {});
        }
    }
}

/**
* CustomValidationError - Returns an Error message for general validation with
* message about what's wrong
*
* @param  {Object} error - Validation error from  Sequelize
* @return {Object}  - A ValidationError object
*/
export class CustomValidationError extends BusinessError {
    constructor(message = 'Bad request.') {
        super(message);
        this.message = message;
        this.name = 'CustomValidationError';
        this.status = 400;
    }
}

export class RequestValidationError extends BusinessError {
    constructor(err) {
        super(err.message);
        this.name = 'RequestValidationError';
        this.status = 400;
        this.payload = err.details.reduce((finalErrors, { path, message, context, type }) =>
            ({ ...finalErrors, [path]: { message, type, context } }), {});
    }
}

export class RequestParamValidationError extends RequestValidationError {
    constructor(err) {
        super(err);
        this.name = 'RequestParamValidationError';
    }
}

export class RequestQueryValidationError extends RequestValidationError {
    constructor(err) {
        super(err);
        this.name = 'RequestQueryValidationError';
    }
}

export class RequestBodyValidationError extends RequestValidationError {
    constructor(err) {
        super(err);
        this.name = 'RequestBodyValidationError';
    }
}

/**
* ResourceNotFoundError - Returns a 404 Entity not found error for when
* a client request an entity that isn't there
*
* @param  {String} entityType - The type of entity that isn't found
* @return {Object}  - Error object
*/
export class ResourceNotFoundError extends BusinessError {
    constructor(entityType = 'entity') {
        super(`Could not find ${entityType}`);
        this.name = 'ResourceNotFoundError';
        this.status = 404;
    }
}

/**
* AuthenticationError - Returns a 401 You need to authenicate to access this resource,
* implying that the user does not have enough premissions to complete this request.
*
* @param  {String} message - A message sent to the user why he/she is not authenticated
* @return {Object}  - Error object
*/
export class AuthenticationError extends BusinessError {
    constructor(message = 'You need to authenicate to access this resource') {
        super(message);
        this.name = 'AuthenticationError';
        this.status = 401;
    }
}
/**
* AuthorizationError - Returns a 400 You send invalid token to access this resource,
* implying that the user sends invalid token to complete this request.
*
* @param  {String} message - A message sent to the user why he/she is not authenticated
* @return {Object}  - Error object
*/
export class TokenError extends BusinessError {
    constructor(message = 'You need to provide valid token to access this resource') {
        super(message);
        this.name = 'TokenError';
        this.status = 401;
    }
}

/**
* AuthorizationError - Returns a 401 You are not authorized to access this resource,
* implying that the user does not have enough premissions to complete this request.
*
* @param  {String} message - A message sent to the user why he/she is not authenticated
* @return {Object}  - Error object
*/
export class AuthorizationError extends BusinessError {
    constructor(message = 'You are not authorized to access this resource') {
        super(message);
        this.name = 'AuthorizationError';
        this.status = 403;
    }
}
