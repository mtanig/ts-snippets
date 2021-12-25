import Id from './Id';
import Action from './Action';
import UserId from './UserId';
import CreatedAt from './CreatedAt';
import UserActionDbAdapter from '../../adapters/db/UserActionDbAdapter';

export interface UserActionParams {
    id?: string,
    userId: string,
    action: string,
    createdAt?: Date,
}

export default class UserAction {
    private id: Id;
    private userId: UserId;
    private action: Action;
    private createdAt: CreatedAt;

    constructor(user: UserActionParams) {
        this.id = new Id(user.id);
        this.userId = new UserId(user.userId);
        this.action = new Action(user.action);
        this.createdAt = new CreatedAt(user.createdAt);
    }

    async register(adapter: UserActionDbAdapter) {
        await adapter.registerUserAction(this);
    }

    getAsObject(): Required<UserActionParams> {
        return {
            id: this.id.getAsString(),
            userId: this.userId.getAsString(),
            action: this.action.getAsString(),
            createdAt: this.createdAt.getAsDate(),
        };
    }

    getId() {
        return this.id.getAsString()
    }

    getUserId() {
        return this.userId.getAsString()
    }

    getAction() {
        return this.action.getAsString()
    }

    getCreatedAt() {
        return this.createdAt.getAsDate()
    }
}