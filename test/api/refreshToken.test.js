/* eslint-disable max-len */
import { describe } from 'ava-spec';
import { redisClient } from 'firis-service-sdk-test2/redis';
import jwt from 'jsonwebtoken';
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
const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiYmFhOWU1NzAtMjA4MC0xMWU5LWJhNzUtMmI4Y2Y4NjUxZWNjIiwidG9rZW5UeXBlIjoicmVmcmVzaF90b2tlbiIsImlhdCI6MTU0ODQwNzI4N30.l_onU6bg27q16QKPwJGzvsjKj0SYcOLOjlRu9TzMERg';
const invalidRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJyZWZyZXNoX3Rva2VuIiwiaWF0IjoxNTQ3MTAyNTQxfQ.MbVa8I4ot7UydqGVKhKB2pPvFpBFd2dn66M-V0MpMbs';
const URI = '/accounts/refreshToken';

const verifyToken = (token) =>
jwt.verify(token, config.jwtSecrect, (err, decoded) => {
    if (err) {
        return;
    }
    return decoded;
});

describe.serial('refreshToken API', it => {
    it.beforeEach(() => loadFixtures(fixtures));
    it('can return new accessToken', async t => {
        const tokenId = 'baa9e570-2080-11e9-ba75-2b8cf8651ecc';
        const accountData = {
            accountId: '0ca0e2a0-a441-11e8-b4db-853c407bd607',
            refreshToken,
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        await redis.set(accountData.accountId,
            tokenId,
            'EX',
            config.refreshTokenExpiration);
        await request(app)
            .post(URI).send(accountData)
            .expect(200)
            .then(res => res.body);
        const tokenIdFromRedis = await redis.get(accountData.accountId);
        const refreshTokenData = await verifyToken(refreshToken);
        t.is(tokenIdFromRedis, refreshTokenData.tokenId);
        await redis.del(accountData.accountId);
    });
    it('cannot return new accessToken with invalid refreshToken', async t => {
        const accountData = {
            accountId: '41a73584-eddf-498b-8e78-1759d66566f4',
            refreshToken: invalidRefreshToken,
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .expect(401)
            .then(res => res.body);
        const refreshTokenData = await verifyToken(invalidRefreshToken);
        t.is(response.name, 'TokenError');
        t.is(refreshTokenData.tokenId, undefined);
    });
    it('must throw error when refreshToken does not exist in redis', async t => {
        const accountData = {
            accountId: '41a73584-eddf-498b-8e78-1759d66566f4',
            refreshToken,
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .expect(401)
            .then(res => res.body);
        const tokenIdFromRedis = await redis.get(accountData.accountId);
        t.is(tokenIdFromRedis, null);
        t.is(response.name, 'TokenError');
        t.is(response.message, 'refreshToken does not exist in redis');
    });
    it('must throw error when refreshToken does not match with token in redis', async t => {
        const tokenId = '6a84efda-5cb0-44f5-aba8-9d1fa887d319';
        const accountData = {
            accountId: '41a73584-eddf-498b-8e78-1759d66566f4',
            refreshToken,
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        await redis.set(accountData.accountId,
            tokenId,
            'EX',
            config.refreshTokenExpiration);
        const response = await request(app)
            .post(URI).send(accountData)
            .expect(401)
            .then(res => res.body);
        const tokenIdFromRedis = await redis.get(accountData.accountId);
        const refreshTokenData = await verifyToken(refreshToken);
        t.is(tokenIdFromRedis !== refreshTokenData.tokenId, true);
        t.is(response.name, 'TokenError');
        t.is(response.message, 'refreshToken does not match with token in redis');
        await redis.del(accountData.accountId);
    });
});
