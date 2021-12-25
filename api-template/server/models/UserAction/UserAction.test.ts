import UserAction from './UserAction';
import UserActionDbAdapter from '../../adapters/db/UserActionDbAdapter';

jest.mock("../../adapters/db/UserActionDbAdapter");
const UserActionDbAdapterMock = UserActionDbAdapter as jest.MockedClass<typeof UserActionDbAdapter>;

describe('UserAction', () => {
    const TEST_ACTION = 'login';
    const TEST_USER_ID = '60a93192-2f4c-d07d-1088-85549dda4e69';

    describe('constructor()', () => {
        describe('id is given', () => {
            describe('id is valid', () => {
                const TEST_VALID_ID = '6a1c8918-9fb3-16cc-bfbe-be9ed65f551d';

                it('sets given id', () => {
                    expect(new UserAction({
                        userId: TEST_USER_ID,
                        action: TEST_ACTION,
                        id: TEST_VALID_ID
                    }).getAsObject()).toEqual({
                        action: TEST_ACTION,
                        id: TEST_VALID_ID,
                        userId: TEST_USER_ID,
                        createdAt: expect.any(Date),
                    })
                });
            });

            describe('id is invalid', () => {
                const TEST_INVALID_ID = 'hoge';
                it('throws error', () => {
                    expect(() => {
                        new UserAction({userId: TEST_USER_ID, action: TEST_ACTION, id: TEST_INVALID_ID})
                    }).toThrowError()
                });
            });
        });

        describe('id is not given', () => {
            it('sets generated id', () => {
                expect(new UserAction({
                    userId: TEST_USER_ID,
                    action: TEST_ACTION,
                }).getAsObject()).toEqual({
                    action: TEST_ACTION,
                    id: expect.any(String),
                    userId: TEST_USER_ID,
                    createdAt: expect.any(Date),
                })
            });
        });
    });

    describe('register()', ()=>{
        const adapter = new UserActionDbAdapter();
        const userAction = new UserAction({
            userId: TEST_USER_ID,
            action: TEST_ACTION,
        });

        beforeEach(async() =>{
            await userAction.register(adapter);
        })

        it('calls adapter.register() with params', ()=> {
            expect(UserActionDbAdapterMock.prototype.registerUserAction).toHaveBeenCalledTimes(1);
            expect(UserActionDbAdapterMock.prototype.registerUserAction).toHaveBeenCalledWith(
                expect.objectContaining(userAction)
            );
        });
    });
});