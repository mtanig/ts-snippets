import express from 'express'
import logger from '../../libs/Logger';
import { ApiError } from '../../libs/ApiError';

export function clientErrorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!err.code || err.code && err.code >= 500) {
        logger.error({err});
    } else {
        logger.warn({err});
    }

    if (
        err instanceof ApiError &&
        err.code && err.message && err.detail
    ) {
        res.status(err.code).json({
            error: {
                message: err.message,
                detail: err.detail,
                code: err.code,
            }
        });
    } else {
        res.status(500).json({
            error: {
                message: err.message,
                detail: err.detail,
                code: err.code,
            }
        });
    }
}
