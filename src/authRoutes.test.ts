const request = require('sync-request');
import { url, port } from './config.json';
import { clearV1 } from './other';
import { getData } from './dataStore';

beforeEach(() => {
  clearV1();
});

afterEach(() => {
  clearV1();
});

describe('auth/logout/v1', () => {
  test('Successful', () => {
    const res0 = request(
      'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json:
          {
            email: 'example@email.com',
            password: 'password',
            nameFirst: 'First',
            nameLast: 'Last'
          }
        }
    );

    const auth = JSON.parse(res0.getBody() as string);
    const res1 = request(
      'POST',
        `${url}:${port}/auth/logout/v2`,
        {
          json: {},
          headers: {
            token: auth.token,
          }
        }
    );

    const parsed = JSON.parse(res1.getBody() as string);
    expect(parsed).toStrictEqual({});
    const data = getData();
    expect(data.users[0].token).toStrictEqual([]);
  });

  test('invalid token', () => {
    const res0 = request(
      'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json:
          {
            email: 'example@email.com',
            password: 'password',
            nameFirst: 'First',
            nameLast: 'Last'
          }
        }
    );

    expect(res0.statusCode).toBe(200);

    const res1 = request(
      'POST',
        `${url}:${port}/auth/logout/v2`,
        {
          json: {},
          headers: {
            token: 'abc',
          }
        }
    );

    expect(res1.statusCode).toBe(403);
  });
});

describe('Test auth/passwordreset/request/v1', () => {
  test('Successful', async () => {
    const res0 = request(
      'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json:
          {
            email: 'example@email.com',
            password: 'password',
            nameFirst: 'First',
            nameLast: 'Last'
          }
        }
    );
    expect(res0.statusCode).toBe(200);
    const auth = JSON.parse(res0.getBody() as string);

    const res1 = request(
      'POST',
        `${url}:${port}/auth/logout/v2`,
        {
          json: {},
          headers: {
            token: auth.token,
          }
        }
    );
    expect(res1.statusCode).toBe(200);
    const res2 = request(
      'POST',
        `${url}:${port}/auth/passwordreset/request/v1`,
        {
          json:
          {
            email: 'example@email.com'
          }
        }
    );
    expect(res2.statusCode).toBe(200);
    await new Promise((r) => setTimeout(r, 3000));
  });
});

describe('Test auth/passwordreset/reset/v1', () => {
  test('invalid password', async () => {
    const res0 = request(
      'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json:
          {
            email: 'example@email.com',
            password: 'password',
            nameFirst: 'First',
            nameLast: 'Last'
          }
        }
    );
    expect(res0.statusCode).toBe(200);
    const auth = JSON.parse(res0.getBody() as string);
    const res1 = request(
      'POST',
        `${url}:${port}/auth/logout/v2`,
        {
          json: {},
          headers: {
            token: auth.token,
          }
        }
    );
    expect(res1.statusCode).toBe(200);
    const res2 = request(
      'POST',
        `${url}:${port}/auth/passwordreset/request/v1`,
        {
          json:
          {
            email: 'example@email.com'
          }
        }
    );
    expect(res2.statusCode).toBe(200);
    const res3 = request(
      'POST',
        `${url}:${port}/auth/passwordreset/reset/v1`,
        {
          json:
          {
            resetCode: 0,
            newPassword: '123'
          }
        }
    );
    expect(res3.statusCode).toBe(400);
    await new Promise((r) => setTimeout(r, 3000));
  });

  test('invalid resetCode', async () => {
    const res0 = request(
      'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json:
          {
            email: 'example@email.com',
            password: 'password',
            nameFirst: 'First',
            nameLast: 'Last'
          }
        }
    );
    expect(res0.statusCode).toBe(200);
    const auth = JSON.parse(res0.getBody() as string);

    const res1 = request(
      'POST',
        `${url}:${port}/auth/logout/v2`,
        {
          json: {},
          headers: {
            token: auth.token,
          }
        }
    );
    expect(res1.statusCode).toBe(200);
    const res2 = request(
      'POST',
        `${url}:${port}/auth/passwordreset/request/v1`,
        {
          json:
          {
            email: 'example@email.com'
          }
        }
    );
    expect(res2.statusCode).toBe(200);
    const res3 = request(
      'POST',
        `${url}:${port}/auth/passwordreset/reset/v1`,
        {
          json:
          {
            resetCode: -1,
            newPassword: 'password'
          }
        }
    );
    expect(res3.statusCode).toBe(400);
    await new Promise((r) => setTimeout(r, 3000));
  });
});
