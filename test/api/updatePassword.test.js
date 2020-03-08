import { describe } from 'ava-spec';
import validator from 'validator';
import request from 'supertest';
import { loadFixtures } from '../helpers';
import app from '../../src/app';

const fixtures = ['accounts'];

const URI = '/accounts/updatePassword';

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

describe.serial('UpdatePassword API', it => {
    it.beforeEach(() => loadFixtures(fixtures));
    it('cannot update password without company_admin role', async t => {
        const accountData = {
            username: 'sm_staff@gmail.com',
            password: 'savemoney321',
            confirmPassword: 'savemoney321',
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .put(URI).send(accountData)
            .set(staffHeader)
            .expect(403)
            .then(res => res.body);
        t.is(response.name, 'AuthorizationError');
        t.is(response.message, 'Your Role is not allowed');
    });
    it('can update password with valid request', async t => {
        const accountData = {
            username: 'sm_staff@gmail.com',
            password: 'newPassword',
            confirmPassword: 'newPassword',
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        await request(app)
            .put(URI).send(accountData)
            .set(companyAdminHeader)
            .expect(200)
            .then(res => res.body);
        t.is(true, true);
    });
    it('cannot update password with invalid username', async t => {
        const accountData = {
            username: 'sm_staff',
            password: 'newPassword',
            confirmPassword: 'newPassword',
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .put(URI).send(accountData)
            .set(companyAdminHeader)
            .expect(400)
            .then(res => res.body);
        t.is(validator.isEmail(accountData.username), false);
        t.is(response.name, 'RequestBodyValidationError');
    });
    it('cannot update password with password less than 6 characters', async t => {
        const accountData = {
            username: 'sm_staff@gmail.com',
            password: 'new',
            confirmPassword: 'new',
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .put(URI).send(accountData)
            .set(companyAdminHeader)
            .expect(400)
            .then(res => res.body);
        t.is(accountData.password.length < 6, true);
        t.is(response.name, 'RequestBodyValidationError');
    });
    it('must throw error when username not exist', async t => {
        const accountData = {
            username: 'sm_staff_not_exist@gmail.com',
            password: 'savemoney123',
            confirmPassword: 'savemoney123',
            tenantId: '2ba90f30-6975-11e8-8b90-9b391703c11a'
        };
        const response = await request(app)
            .put(URI).send(accountData)
            .set(companyAdminHeader)
            .expect(404)
            .then(res => res.body);
        t.is(response.name, 'ResourceNotFoundError');
    });
});
