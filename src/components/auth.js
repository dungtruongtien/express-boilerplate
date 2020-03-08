import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
    encryptSymmetricKey,
    encrypt,
    decryptSymmetricKey,
    decrypt
} from '../utils';
import { AuthenticationError, AuthorizationError } from '../errors/BusinessErrors';

export function permitRole(...allowed) {
    return (req, res, next) => {
        const userData = res.locals.user;
        const isAllowed = role => allowed.indexOf(role) > -1;
        const allow = userData.account.roles ? userData.account.roles
            .find((key) => isAllowed(key)) : undefined;
        if (!allow) {
            throw new AuthorizationError('Your Role is not allowed');
        }
        next();
    };
}

export function verifyJWT(jwtSecrect) {
    return (req, res, next) => {
        if (res.locals.user) {
            return next();
        }
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        jwt.verify(token, jwtSecrect, (err, decoded) => {
            if (err) {
                throw new AuthenticationError(err);
            }
            const userData = {
                account: decoded.account,
                staff: decoded.staff ? decoded.staff : null
            };
            if (!userData || !userData.account.id) {
                throw new AuthorizationError('Invalid Data for authorization');
            }
            res.locals.user = userData; //eslint-disable-line
            next();
        });
    };
}

export function permitAction(...allowed) {
    return (req, res, next) => {
        const isAllowed = role => allowed.indexOf(role) > -1;
        const userData = res.locals.user;
        const allow = userData.roles ? Object.entries(userData.roles)
            .find(e => e[1].find((act) => isAllowed(act)) !== undefined) : undefined;
        if (!allow) {
            throw new AuthorizationError('Your Role Action is not allowed');
        }
        next();
    };
}

function decryptRequestData(req, publicKey, algorithm) {
    if (req.method === 'GET' || req.method === 'DELETE') return null;
    const { encryptedData, encryptedKey } = req.body;
    if (!encryptedData || !encryptedKey) {
        throw new AuthenticationError('encrypted data, encrypted key cannot null');
    }
    try {
        const { key, iv } = JSON.parse(decryptSymmetricKey(publicKey, encryptedKey));
        const decryptedData = decrypt(encryptedData, key, iv, algorithm);
        return JSON.parse(decryptedData);
    } catch (error) {
        throw new AuthenticationError(error.message);
    }
}

export function verifyApiKey(algorithm) {
    return async (req, res, next) => {
        try {
            const apiKey = req.body['api-key'] ||
                req.query['api-key'] || req.headers['api-key'] || null;
            const apiData = await req.app.locals.redis.get(apiKey);
            const userData = JSON.parse(apiData);
            const jwtToken = req.body.token || req.query.token || req.headers['x-access-token'];
            if (!userData && !jwtToken) {
                throw new AuthenticationError({
                    message: 'invalid API Key',
                    name: 'AuthenticationError'
                });
            }
            if (!userData && jwtToken) {
                return next();
            }
            req.body = await decryptRequestData(req, userData.publicKey, algorithm); //eslint-disable-line
            delete userData.publicKey;
            res.locals.externalParty = true // eslint-disable-line
            res.locals.user = userData; //eslint-disable-line
            next();
        } catch (err) {
            next(err);
        }
    };
}

export async function encryptResponse(redis, responseData, apiKey, algorithm) {
    const apiData = await redis.get(apiKey);
    const { publicKey } = JSON.parse(apiData);
    const symmetricKey = crypto.randomBytes(32).toString('hex').slice(0, 32);
    const iv = crypto.randomBytes(16).toString('hex').slice(0, 16);
    // eslint-disable-next-line max-len
    const encryptedData = encrypt(JSON.stringify(responseData), symmetricKey, iv, algorithm);
    const encryptedKey = encryptSymmetricKey(
        publicKey,
        JSON.stringify({ key: symmetricKey, iv })
    );
    return { encryptedData, encryptedKey };
}