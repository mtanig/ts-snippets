import UserActionDbAdapter from "../adapters/db/UserActionDbAdapter";
import UserAction from '../models/UserAction/UserAction';
import UserId from '../models/UserAction/UserId';
import UserActions from '../models/UserAction/UserActions';

export default class UserActionService {
    private readonly userActionDbAdapter: UserActionDbAdapter;
    constructor() {
        this.userActionDbAdapter = new UserActionDbAdapter();
    }

    async get(userId: UserId): Promise<UserActions | false> {
        const userActions = await UserActions.getByUserId(this.userActionDbAdapter, userId);

        return userActions;
    }

    async register(userAction: UserAction): Promise<void> {
        await userAction.register(this.userActionDbAdapter);
    }
}
