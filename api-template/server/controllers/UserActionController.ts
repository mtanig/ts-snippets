import express from 'express'
import UserActionService from "../services/UserActionService";
import UserAction, { UserActionParams } from '../models/UserAction/UserAction';
import { ApiError, ApiErrorType } from '../../libs/ApiError';
import UserId from '../models/UserAction/UserId';


export type UserActionPostBody = Omit<UserActionParams, "id" | "createdAt">
export interface UserActionsGetResponse {
    userActions: Array<Required<UserActionParams>>
}

export class UserActionController {
    private userActionService: UserActionService;

    constructor() {
        this.userActionService = new UserActionService();
    }

    async registerUserAction(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const body: UserActionPostBody = req.body;
            let userAction: UserAction;
            try {
                userAction = new UserAction(body);
            } catch (e: any) {
                throw new ApiError(ApiErrorType.BAD_REQUEST, e.message);
            }

            await this.userActionService.register(userAction);

            res.status(204).end();
        } catch (e) {
            next(e);
        }
    }

    async getUserActions(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            let userId: UserId;
            try {
                userId = new UserId(req.params.userId);
            } catch (e: any) {
                throw new ApiError(ApiErrorType.BAD_REQUEST, e.message);
            }

            const userActions = await this.userActionService.get(userId);

            if (!userActions) {
                throw new ApiError(ApiErrorType.NOT_FOUND, 'DB record is not found.');
            }

            const response: UserActionsGetResponse = {
                userActions: userActions.getAsArray(),
            };

            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }
}

export default UserActionController;
export const userActionController = new UserActionController();
