import Cassandra from '../../../libs/Cassandra';
import UserAction from '../../models/UserAction/UserAction';
import UserId from '../../models/UserAction/UserId';
import UserActions from '../../models/UserAction/UserActions';

export interface UserActionsDbParams {
    id: string;
    userid: string;
    action: string,
    createdat: Date;
}

export default class UserActionDbAdapter {
    public _dbClient;
    readonly TTL_SEC = 750 * 24 * 60 * 60;

    constructor() {
        this._dbClient = Cassandra.getInstance(
            JSON.parse(process.env.USER_ACTION_DB_SERVICE || '{}')
        );
    }

    async registerUserAction(user: UserAction): Promise<void> {
        const row: UserActionsDbParams = {
            id: user.getId(),
            userid: user.getUserId(),
            action: user.getAction(),
            createdat: user.getCreatedAt(),
        };

        await this._dbClient.execute(
            `INSERT INTO useractions (id, userid, action, createdat) VALUES(?, ?, ?, ?) USING TTL ${this.TTL_SEC}`,
            [
                row.id,
                row.userid,
                row.action,
                row.createdat,
            ],
            { prepare: true },
        );
    }

    async getUserActions(userId: UserId) :  Promise<UserActions | false> {
        const dbResult = await this._dbClient.execute(
            'SELECT id, userid, action, createdat FROM useractions WHERE (userid = ?)',
            [
                userId.getAsString(),
            ]
        );

        if (dbResult.rows && dbResult.rows.length === 0) {
            return false;
        }

        const userActionsRaw = dbResult.rows.map((row: UserActionsDbParams)=>new UserAction({
            id: row.id.toString(),
            userId: row.userid.toString(),
            action: row.action.toString(),
            createdAt: row.createdat,
        }));

        return new UserActions(userActionsRaw);
    }
}
