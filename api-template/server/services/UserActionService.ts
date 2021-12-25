import UserActionDbAdapter from "../adapters/db/UserActionDbAdapter";
import UserAction from '../models/UserAction/UserAction';
import UserId from '../models/UserAction/UserId';
import UserActions from '../models/UserAction/UserActions';

export default class UserActionService {
    private userActionDbAdapter: UserActionDbAdapter;
    constructor() {
        this.userActionDbAdapter = new UserActionDbAdapter();
    }

    async get(userId: UserId): Promise<UserActions | false> {
        const userActions: UserActions | false = await this.userActionDbAdapter.getUserActions(userId);

        return userActions;
    }

    async register(userAction: UserAction): Promise<void> {
        await this.userActionDbAdapter.registerUserAction(userAction);
    }
}
