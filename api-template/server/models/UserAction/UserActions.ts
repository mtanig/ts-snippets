import UserAction from "./UserAction";
import UserActionDbAdapter from '../../adapters/db/UserActionDbAdapter';
import UserId from './UserId';

export default class UserActions {
    private readonly list: Array<UserAction>;
    constructor(userActions: Array<UserAction>) {
        this.list = userActions;
    }

    getAsArray() {
        return this.list.map(userAction=>userAction.getAsObject());
    }

    static async getByUserId(adapter: UserActionDbAdapter, userId: UserId) {
        return await adapter.getUserActions(userId);
    }
}
