export default class Action {
    private readonly action: string;

    static Login = 'login';
    static Logout = 'logout';

    static List = [Action.Login, Action.Logout]

    constructor(action: string) {
        if (typeof action !== 'string') {
            throw new TypeError(`action is not string.`);
        }
        if (!Action.List.includes(action)) {
            throw new TypeError(`action is not allowed.`);
        }

        this.action = action;
    }

    getAsString(): string {
        return this.action;
    }
}