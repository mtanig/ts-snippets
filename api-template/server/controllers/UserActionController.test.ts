import {AppFactory} from '../AppFactory';
import UserActionController from "./UserActionController";
import UserActionDbAdapter from "../adapters/db/UserActionDbAdapter";
import { cloneDeep } from 'lodash';
import Id from '../models/UserAction/Id';
import UserId from '../models/UserAction/UserId';
import CreatedAt from '../models/UserAction/CreatedAt';
import Action from '../models/UserAction/Action';
import UserActions from '../models/UserAction/UserActions';
import UserAction  from '../models/UserAction/UserAction';

jest.mock("../adapters/db/UserActionDbAdapter");
const UserActionDbAdapterMock = UserActionDbAdapter as jest.MockedClass<typeof UserActionDbAdapter>;

const request = require('supertest');

describe('UserActionController', () => {
    let app: any;
    let res: any;

    const TEST_BODY_RAW = require('../../tests/UserAction/postBody.json');

    beforeEach(async () => {
        app = await (new AppFactory()).create();
    });

    describe('/v1/userActions (POST)', () => {
        describe('valid input',()=>{
            const TEST_BODY = cloneDeep(TEST_BODY_RAW);
            const EXPECTED_USER_ID = {
                id: expect.any(Id),
                userId: new UserId(TEST_BODY.userId),
                action: new Action(TEST_BODY.action),
                createdAt: expect.any(CreatedAt),
            }

            beforeEach(async ()=>{
                res = await request(app)
                    .post(`/v1/userActions`)
                    .send(TEST_BODY);
            });

            it('returns 204', () => {
                expect(res.status).toBe(204);
            });

            it('calls UserActionDbAdapter.registerUserAction() with valid params', () => {
                expect(UserActionDbAdapterMock.prototype.registerUserAction).toHaveBeenCalledTimes(1);
                expect(UserActionDbAdapterMock.prototype.registerUserAction).toHaveBeenCalledWith(
                    expect.objectContaining(EXPECTED_USER_ID)
                );
            });
        });

        describe('invalid input', ()=>{
            describe('userId is not uuid', ()=>{
                const TEST_BODY = cloneDeep(TEST_BODY_RAW);
                TEST_BODY.userId = '12345678-12345678';

                beforeEach(async () => {
                    res = await request(app)
                        .post(`/v1/userActions`)
                        .send(TEST_BODY);
                });

                it('returns 400', ()=> {
                    expect(res.status).toBe(400);
                });

                it('returns error response', ()=> {
                    expect(res.body.error).toMatchObject({
                        message: "Bad Request.",
                        detail: "userId is not uuid."
                    });
                });
            });
        });
    });

    describe('/v1/userIds/:userId/userActions (GET)', () => {
        const EXPECTED_RESPONSE_RAW = require('../../tests/UserAction/getResponse.json');
        const EXPECTED_RESPONSE = cloneDeep(EXPECTED_RESPONSE_RAW);

        const TEST_USER_ID = EXPECTED_RESPONSE.userActions[0].userId;
        const TEST_USER_ACTIONS = new UserActions(EXPECTED_RESPONSE.userActions.map((userActionRaw: any)=>new UserAction({...userActionRaw, createdAt: new Date(userActionRaw.createdAt)})))

        beforeEach(() => {
            UserActionDbAdapterMock.mockClear();
        });

        describe('valid input', ()=>{
            describe('db records are found', ()=>{
                beforeEach(async ()=>{
                    UserActionDbAdapterMock.prototype.getUserActions.mockResolvedValue(TEST_USER_ACTIONS);

                    res = await request(app)
                        .get(`/v1/userIds/${TEST_USER_ID}/userActions`)
                });

                it('returns 200', () => {
                    expect(res.status).toBe(200);
                });

                it('calls UserActionDbAdapterMock.getUserActions() with params', () => {
                    expect(UserActionDbAdapterMock.prototype.getUserActions).toHaveBeenCalledTimes(1);
                    expect(UserActionDbAdapterMock.prototype.getUserActions).toHaveBeenCalledWith(new UserId(TEST_USER_ID));
                });

                it('returns response', () => {
                    expect(res.body).toEqual(EXPECTED_RESPONSE)
                });
            });

            describe('when db record is not found', ()=>{
                beforeEach(async ()=>{
                    UserActionDbAdapterMock.prototype.getUserActions.mockResolvedValue(false);

                    res = await request(app)
                        .get(`/v1/userIds/${TEST_USER_ID}/userActions`)
                });

                it('returns 404', () => {
                    expect(res.status).toBe(404);
                });

                it('returns error response', () => {
                    expect(res.body.error).toMatchObject({
                        message: "Not Found.",
                        detail: "DB record is not found."
                    });
                });
            });
        });

        describe('when invalid input', ()=>{
            describe('when userId is not uuid', ()=>{
                beforeEach(async()=>{
                    UserActionDbAdapterMock.prototype.getUserActions.mockResolvedValue(TEST_USER_ACTIONS);

                    res = await request(app)
                        .get(`/v1/userIds/INVALID_USER_ID/userActions`)
                });

                it('returns 400', ()=> {
                    expect(res.status).toBe(400);
                });

                it('returns error response', ()=> {
                    expect(res.body.error).toMatchObject({
                        message: "Bad Request.",
                        detail: "userId is not uuid."
                    });
                });
            });
        });
    });
});
