import UserActionDbAdapter from "./UserActionDbAdapter";
import UserAction from '../../models/UserAction/UserAction';
import UserActions from '../../models/UserAction/UserActions';
import UserId from '../../models/UserAction/UserId';

describe('UserActionDbAdapter', () => {
    let adapter: UserActionDbAdapter;
    let executeStub: jest.SpyInstance<any, unknown[]>;

    const TEST_ID = 'f4091c23-5eee-acec-8c50-305503463313';
    const TEST_USER_ID = '0012a745-80eb-ddae-c24c-32a132bf248f';
    const TEST_ACTION = 'login';
    const TEST_CREATED_AT = new Date(2020, 1, 1, 10, 0, 0);

    beforeEach(async () => {
        adapter = new UserActionDbAdapter();
        executeStub = jest.spyOn(adapter._dbClient, 'execute');
    });

    describe('registerUserAction()', () => {
        const TEST_USER_ACTION = new UserAction({
            id: TEST_ID,
            userId: TEST_USER_ID,
            action: TEST_ACTION,
            createdAt: TEST_CREATED_AT,
        })

        beforeEach(async () => {
            executeStub.mockReturnValue(true);
            await adapter.registerUserAction(TEST_USER_ACTION)
        });

        it('calls execute() with params', () => {
            const EXPECTED_QUERY = 'INSERT INTO useractions (id, userid, action, createdat) VALUES(?, ?, ?, ?) USING TTL 64800000';
            const EXPECTED_PARAMS = Object.values(TEST_USER_ACTION.getAsObject());
            const EXPECTED_OPTION = {"prepare": true}

            expect(executeStub).toHaveBeenCalledTimes(1);
            expect(executeStub).toHaveBeenCalledWith(EXPECTED_QUERY, EXPECTED_PARAMS, EXPECTED_OPTION);
        });
    });

    describe('getUserActions()', () => {
        let res: UserActions | false;

        const TEST_DB_RESULT = {
            rows: [
                {
                    id: TEST_ID,
                    userid: TEST_USER_ID,
                    action: TEST_ACTION,
                    createdat: TEST_CREATED_AT,
                },
                {
                    id: '699f0a7d-fc27-3771-a40d-6e70afe11f73',
                    userid: TEST_USER_ID,
                    action: 'logout',
                    createdat: new Date(2020, 12, 12, 10, 0, 0),
                },
            ]
        };

        const EXPECTED_RESULT_RAW = TEST_DB_RESULT.rows.map(row => (
            new UserAction({
                id: row.id,
                userId: row.userid,
                action: row.action,
                createdAt: row.createdat,
            }))
        );
        const EXPECTED_RESULT = new UserActions(EXPECTED_RESULT_RAW);

        beforeEach(async () => {
            executeStub.mockReturnValue(TEST_DB_RESULT);

            res = await adapter.getUserActions(new UserId(TEST_USER_ID));
        });

        it('calls execute() with params', () => {
            const EXPECTED_QUERY = 'SELECT id, userid, action, createdat FROM useractions WHERE (userid = ?)';
            const EXPECTED_PARAMS = [TEST_USER_ID]

            expect(executeStub).toHaveBeenCalledTimes(1);
            expect(executeStub).toHaveBeenCalledWith(EXPECTED_QUERY, EXPECTED_PARAMS);
        });

        it('returns UserActions', () => {
            expect(res).toEqual(EXPECTED_RESULT);
        });
    });
});
