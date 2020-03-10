/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import { syncDB } from '../src/db-helpers';
import app from '../src/app';

beforeEach(() => {
    syncDB();
});

describe('Post Endpoints', () => {
    it('should create a new post', async () => {
        const res = await request(app)
      .get('/cars/1');
        expect(res.status).toEqual(404);
    });
});
