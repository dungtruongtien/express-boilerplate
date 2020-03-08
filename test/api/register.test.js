import validator from 'validator';
import { describe } from 'ava-spec';
import request from 'supertest';
import { loadFixtures } from '../helpers';
import app from '../../src/app';

const fixtures = ['accounts'];

const URI = '/accounts';

const companyAdminHeader = {
    'x-access-token':
    // eslint-disable-next-line
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50Ijp7ImlkIjoiOWYwM2VjNDctMmI5MS00YzIxLTlmNTYtN2VmOWZlM2Y5YzE3Iiwicm9sZXMiOlsiY29tcGFueV9hZG1pbiJdLCJ0ZW5hbnRfaWQiOiIyYmE5MGYzMC02OTc1LTExZTgtOGI5MC05YjM5MTcwM2MxMWEifSwic3RhZmYiOnsiaWQiOiI1NzcwM2M0Ni0zNTE2LTQxMDUtOTA1OS00NWQ0ZDhlYTI2MjkiLCJicmFuY2hfaWQiOiI5ZGRiYjhiYS1iNTI1LTQ5MzEtOTIwYS01YWY5NDFmMWIwOTMiLCJ0ZW5hbnRfaWQiOiIyYmE5MGYzMC02OTc1LTExZTgtOGI5MC05YjM5MTcwM2MxMWEifSwidG9rZW5UeXBlIjoiYWNjZXNzX3Rva2VuIiwiaWF0IjoxNTQ3MTAyMzE1fQ.73SuSYP8gDQeVAdVAJXkcBR6CDfygrF_vaJhRyQQGCs'
};
const staffHeader = {
    'x-access-token':
    // eslint-disable-next-line
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50Ijp7ImlkIjoiOTRhNWJjYjAtNjUyNC0yNGU5LWI5N2QtYmZkZGMwOWFhNzg1Iiwicm9sZXMiOlsidXdfc3RhZmYiXSwidGVuYW50X2lkIjoiMmJhOTBmMzAtNjk3NS0xMWU4LThiOTAtOWIzOTE3MDNjMTFhIn0sInN0YWZmIjp7ImlkIjoiNzEyNmUwZWYtOGRhYi00Zjc2LWIxMzgtOGU0YjZlNGZmNTE3IiwiYnJhbmNoX2lkIjoiOWRkYmI4YmEtYjUyNS00OTMxLTkyMGEtNWFmOTQxZjFiMDkzIiwidGVuYW50X2lkIjoiMmJhOTBmMzAtNjk3NS0xMWU4LThiOTAtOWIzOTE3MDNjMTFhIn0sInRva2VuVHlwZSI6ImFjY2Vzc190b2tlbiIsImlhdCI6MTU0NzEwMTc3Nn0.9FkK-sruHFn0GcMKs01YoLXNpiOrr0X9ZCC1BwU8RAI'
};

describe.serial('Register API', it => {
    it.beforeEach(() => loadFixtures(fixtures));
    it('cannot register without company_admin role', async t => {
        const accountData = {
            username: 'test_permission@gmail.com',
            password: 'savemoney123',
            roles: ['uw_staff'],
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .set(staffHeader)
            .expect(403)
            .then(res => res.body);
        t.is(response.name, 'AuthorizationError');
    });
    it('can register an company_admin account', async t => {
        const accountData = {
            username: 'unit_test_company_admin@gmail.com',
            password: 'savemoney123',
            roles: ['company_admin'],
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .set(companyAdminHeader)
            .expect(200)
            .then(res => res.body);
        const accountRoles = Array.isArray(response.roles)
        ? response.roles.map(item => item.role) : [];
        t.is(accountRoles.indexOf('company_admin'), accountData.roles.indexOf('company_admin'));
    });
    it('can register an uw_admin account', async t => {
        const accountData = {
            username: 'unit_test_uw_admin@gmail.com',
            password: 'savemoney123',
            roles: ['uw_admin'],
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .expect(200)
            .set(companyAdminHeader)
            .then(res => res.body);
        const accountRoles = Array.isArray(response.roles)
            ? response.roles.map(item => item.role) : [];
        t.is(accountRoles.indexOf('uw_admin'), accountData.roles.indexOf('uw_admin'));
    });
    it('can register an uw_staff account', async t => {
        const accountData = {
            username: 'unit_test_uw_staff@gmail.com',
            password: 'savemoney123',
            roles: ['uw_staff'],
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .expect(200)
            .set(companyAdminHeader)
            .then(res => res.body);
        const accountRoles = Array.isArray(response.roles)
            ? response.roles.map(item => item.role) : [];
        t.is(accountRoles.indexOf('uw_staff'), accountData.roles.indexOf('uw_staff'));
    });
    it('can register an company_sale account', async t => {
        const accountData = {
            username: 'unit_test_company_sale@gmail.com',
            password: 'savemoney123',
            roles: ['company_sale'],
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .set(companyAdminHeader)
            .expect(200)
            .then(res => res.body);
        const accountRoles = Array.isArray(response.roles)
            ? response.roles.map(item => item.role) : [];
        t.is(accountRoles.indexOf('company_sale'), accountData.roles.indexOf('company_sale'));
    });
    it('can register an uw_manager account', async t => {
        const accountData = {
            username: 'unit_test_uw_manager@gmail.com',
            password: 'savemoney123',
            roles: ['uw_manager'],
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .set(companyAdminHeader)
            .expect(200)
            .then(res => res.body);
        const accountRoles = Array.isArray(response.roles)
            ? response.roles.map(item => item.role) : [];
        t.is(accountRoles.indexOf('uw_manager'), accountData.roles.indexOf('uw_manager'));
    });
    it('can not register with invalid roles', async t => {
        const accountData = {
            username: 'unit_test_roles@gmail.com',
            password: 'savemoney123',
            roles: ['uw_wrong_role'],
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .set(companyAdminHeader)
            .expect(400)
            .then(res => res.body);
        t.is(response.name, 'RequestBodyValidationError');
    });
    it('cannot register usename without email format', async t => {
        const accountData = {
            username: 'unit_test_username@gmail',
            password: 'savemoney123',
            roles: ['uw_manager'],
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        await request(app)
            .post(URI).send(accountData)
            .set(companyAdminHeader)
            .expect(400)
            .then(res => res.body);
        t.is(validator.isEmail(accountData.username), false);
    });
    it('cannot register with password less than 6 characters', async t => {
        const accountData = {
            username: 'unit_test_password@gmail',
            password: 'save',
            roles: ['uw_manager'],
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .post(URI).send(accountData)
            .set(companyAdminHeader)
            .expect(400)
            .then(res => res.body);
        t.is(accountData.password.length < 6, true);
        t.is(response.name, 'RequestBodyValidationError');
    });
    it('can register new valid publicKey', async t => {
        const accountData = {
            accountId: '2bab0b00-6975-11e8-8b90-9b391703c11a',
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a',
            publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAthdL4uXk7IyUk+HMV8Fx\n6g2IQrtWqCB0d3tzm3uSWQJkyngeK3jWEpvNLKpu7Or1O/mUiZjV4Jz9bNciG65J\nJBPXYza5XXXztbK0cH+Q886f2W+LYSBnVS/nhjIFDGyXaOFO64jZs9D0uteedZGu\nFGf0ZjftJ6WDyBaCXgqld+u47+OsTIecDgy4wn1c/z197EFiyqFiZhpajo3kz4f9\nED2+VH3rSGaAlvWhkP1KQZ0OLMYx0Nurpxf7xyrFluMICL+02cL3N0jMcYqH9opU\noeiqV2Rjngl80O6PznE8Yr8EGQwprY1mETV2u11QkOwa9YhLIpxymVnLx9uvA6kU\nCQIDAQAB\n-----END PUBLIC KEY-----' // eslint-disable-line
        };
        await request(app)
            .post(`${URI}/setPublicKey`)
            .send(accountData)
            .set(companyAdminHeader)
            .expect(200)
            .then(res => res.body);
        t.is(true, true);
    });
});
