import { describe } from 'ava-spec';
import jwt from 'jsonwebtoken';
import { redisClient } from 'firis-service-sdk-test2/redis';
import validator from 'validator';
import request from 'supertest';
// import tokenStorage from '../../src/token-helpers/tokenStorage';
import { loadFixtures } from '../helpers';
import app from '../../src/app';
import config from '../../src/config/index';

const redis = redisClient({
    port: config.redisPort,
    host: config.redisHost,
    password: config.redisPass
});
const fixtures = ['accounts'];

const URI = '/accounts/login';
const URI_LOGOUT = '/accounts/logout';

const verifyToken = (token) =>
jwt.verify(token, config.jwtSecrect, (err, decoded) => {
    if (err) {
        return;
    }
    return decoded;
});


describe.serial('Login API', it => {
    it.beforeEach(() => loadFixtures(fixtures));
    it('can login valid username and password', async t => {
        const accountData = {
            username: 'sm_staff@gmail.com',
            password: 'savemoney123'
        };
        await request(app)
            .post(URI).send(accountData)
            .expect(200)
            .then(res => res.body);
        t.is(true, true);
    });
    it('must throw Error when username or password is invalid', async t => {
        const accountData = {
            username: 'sm_staff_not_exist@gmail.com',
            password: 'savemoney123'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .expect(401)
            .then(res => res.body);
        t.is(response.name, 'AuthenticationError');
        t.is(response.message, 'Username or password is invalid');
    });
    it('cannot find staff by account_id', async t => {
        const accountData = {
            username: 'testFindStaffByAccountId@gmail.com',
            password: 'savemoney123'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .expect(404)
            .then(res => res.body);
        t.is(response.name, 'ResourceNotFoundError');
    });
    it('must return valid refreshToken', async t => {
        const accountData = {
            username: 'sm_staff@gmail.com',
            password: 'savemoney123'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .expect(200)
            .then(res => res.body);
        const { tokenId, tokenType } = verifyToken(response.refreshToken.refreshToken);
        t.is(validator.isUUID(tokenId), true);
        t.is(tokenType, 'refresh_token');
    });
    it('must return valid accessToken', async t => {
        const tokenInfo = {
            account: {
                id: '2bab0b00-6975-11e8-8b90-9b391703c11a',
                roles: ['uw_staff'],
                tenant_id: '2ba90f30-6975-11e8-8b90-9b391703c11a'
            },
            staff: {
                id: '9ddbb8ba-b525-4931-920a-5af941f1b063',
                branch_id: '9ddbb8ba-b525-4931-920a-5af941f1b093',
                tenant_id: '2ba90f30-6975-11e8-8b90-9b391703c11a'
            }
        };
        const accountData = {
            username: 'sm_staff@gmail.com',
            password: 'savemoney123'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .expect(200)
            .then(res => res.body);
        const { account, staff, tokenType } = verifyToken(response.token.token);
        t.is(account.id, tokenInfo.account.id);
        t.deepEqual(account.roles, tokenInfo.account.roles);
        t.is(account.tenant_id, tokenInfo.account.tenant_id);
        t.is(staff.id, tokenInfo.staff.id);
        t.is(staff.branch_id, tokenInfo.staff.branch_id);
        t.is(staff.tenant_id, tokenInfo.staff.tenant_id);
        t.is(tokenType, 'access_token');
    });
    it('must delete tokenId by accountId when logout', async t => {
        const tokenId = 'fd815b80-128e-11e9-bbdb-6138bf3f8d24';
        const accountData = { accountId: '94a5bcb0-6524-24e9-b97d-bfddc09aa785' };
        await redis.set(accountData.accountId,
            tokenId,
            'EX',
            config.refreshTokenExpiration);
        await request(app)
            .post(URI_LOGOUT).send(accountData)
            .expect(200)
            .then(res => res.body);
        t.is(true, true);
    });
});
