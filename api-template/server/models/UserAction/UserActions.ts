import UserAction from "./UserAction";

export default class UserActions {
    private readonly list: Array<UserAction>;
    constructor(userActions: Array<UserAction>) {
        this.list = userActions;
    }

    getAsArray() {
        return this.list.map(userAction=>userAction.getAsObject());
    }
}
