const request = require('sync-request');
import { url, port } from './config.json';
const OK = 200;

describe('Test for /standup/start/v1', () => {
  // to reset the database
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );
  // to set the database for the test
  let auth0: any;
  let channel0: any;
  beforeEach(() => {
    const res0 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json:
        {
          email: 'example0@email.com',
          password: 'password0',
          nameFirst: 'First0',
          nameLast: 'Last0'
        }
      }
    );
    auth0 = JSON.parse(res0.getBody() as string);

    const res1 = request(
      'POST',
      `${url}:${port}/channels/create/v3`,
      {
        json:
        {
          name: 'AERO',
          isPublic: true
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    channel0 = JSON.parse(res1.getBody() as string);
  });

  afterEach(() => {
    request(
      'DELETE',
      `${url}:${port}/clear/v1`,
      {
        qs: {}
      }
    );
  });

  test('invalid channelId', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json: {
          channelId: -999,
          length: 1
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(400);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('invalid length', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json: {
          channelId: channel0.channelId,
          length: -999
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(400);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('a standup is active', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json: {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(200);
    const res3 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json: {
          channelId: channel0.channelId,
          length: 400
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res3.statusCode).toBe(400);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('authorised user is not a member of the channel', async () => {
    const res3 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json:
        {
          email: 'example1@email.com',
          password: 'password1',
          nameFirst: 'First1',
          nameLast: 'Last1'
        }
      }
    );
    const auth1 = JSON.parse(res3.getBody() as string);

    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: auth1.token,
        }
      }
    );
    expect(res2.statusCode).toBe(403);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('invalid token', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: 'abc',
        }
      }
    );
    expect(res2.statusCode).toBe(403);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('successfully begin a standup', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    // console.log(JSON.parse(res2.getBody() as string));
    expect(res2.statusCode).toBe(OK);

    const timeFinish = JSON.parse(res2.getBody() as string).timeFinish;
    const timeSent = Math.floor((new Date()).getTime() / 1000);
    expect(timeFinish).toBeGreaterThanOrEqual(timeSent + 1);
    expect(timeFinish).toBeLessThan(timeSent + 2);
    await new Promise((r) => setTimeout(r, 1200));
  });
});

describe('Test for /standup/active/v1', () => {
  // to reset the database
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );
  // to set the database for the test
  let auth0: any;
  let channel0: any;
  beforeEach(() => {
    const res0 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json:
        {
          email: 'example0@email.com',
          password: 'password0',
          nameFirst: 'First0',
          nameLast: 'Last0'
        }
      }
    );
    auth0 = JSON.parse(res0.getBody() as string);

    const res1 = request(
      'POST',
      `${url}:${port}/channels/create/v3`,
      {
        json:
        {
          name: 'AERO',
          isPublic: true
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    channel0 = JSON.parse(res1.getBody() as string);
  });

  afterEach(() => {
    request(
      'DELETE',
      `${url}:${port}/clear/v1`,
      {
        qs: {}
      }
    );
  });

  test('invalid token', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(200);
    const res3 = request(
      'GET',
      `${url}:${port}/standup/active/v1`,
      {
        qs:
        {
          channelId: channel0.channelId
        },
        headers: {
          token: 'abc',
        }
      }
    );
    expect(res3.statusCode).toBe(403);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('invalid channelId', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(200);
    const res3 = request(
      'GET',
      `${url}:${port}/standup/active/v1`,
      {
        qs:
        {
          channelId: -999
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res3.statusCode).toBe(400);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('authorised user is not a member of the channel', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(200);
    const res3 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json:
        {
          email: 'example1@email.com',
          password: 'password1',
          nameFirst: 'First1',
          nameLast: 'Last1'
        }
      }
    );
    const auth1 = JSON.parse(res3.getBody() as string);

    const res4 = request(
      'GET',
      `${url}:${port}/standup/active/v1`,
      {
        qs:
        {
          channelId: channel0.channelId
        },
        headers: {
          token: auth1.token,
        }
      }
    );
    expect(res4.statusCode).toBe(403);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('successfully check an active standup', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(200);

    const res3 = request(
      'GET',
      `${url}:${port}/standup/active/v1`,
      {
        qs:
        {
          channelId: channel0.channelId
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res3.statusCode).toBe(200);
    const timeFinish = JSON.parse(res3.getBody() as string).timeFinish;
    const isActive = JSON.parse(res3.getBody() as string).isActive;
    const timeSent = Math.floor((new Date()).getTime() / 1000);
    expect(isActive).toStrictEqual(true);
    expect(timeFinish).toBeGreaterThanOrEqual(timeSent + 1);
    expect(timeFinish).toBeLessThan(timeSent + 2);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('successfully check an inactive standup', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 0
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(200);

    const res3 = request(
      'GET',
      `${url}:${port}/standup/active/v1`,
      {
        qs:
        {
          channelId: channel0.channelId
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res3.statusCode).toBe(200);
    const isActive = JSON.parse(res3.getBody() as string).isActive;
    const timeFinish = JSON.parse(res3.getBody() as string).timeFinish;
    expect(isActive).toStrictEqual(false);
    expect(timeFinish).toBe(null);
    await new Promise((r) => setTimeout(r, 1200));
  });
});

describe('Test for /standup/send/v1', () => {
  // to reset the database
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );
  // to set the database for the test
  let auth0: any;
  let channel0: any;
  beforeEach(() => {
    const res0 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json:
        {
          email: 'example0@email.com',
          password: 'password0',
          nameFirst: 'First0',
          nameLast: 'Last0'
        }
      }
    );
    auth0 = JSON.parse(res0.getBody() as string);

    const res1 = request(
      'POST',
      `${url}:${port}/channels/create/v3`,
      {
        json:
        {
          name: 'AERO',
          isPublic: true
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    channel0 = JSON.parse(res1.getBody() as string);
  });

  afterEach(() => {
    request(
      'DELETE',
      `${url}:${port}/clear/v1`,
      {
        qs: {}
      }
    );
  });

  test('invalid channelId', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(200);

    const res3 = request(
      'POST',
      `${url}:${port}/standup/send/v1`,
      {
        json:
        {
          channelId: -999,
          message: 'Hello!'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res3.statusCode).toBe(400);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('invalid length', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(200);

    let messageError = '';
    for (let i = 0; i < 200; i++) {
      messageError += 'Hello!!';
    }

    const res3 = request(
      'POST',
      `${url}:${port}/standup/send/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          message: messageError
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res3.statusCode).toBe(400);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('no standup is active', () => {
    const res3 = request(
      'POST',
      `${url}:${port}/standup/send/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          message: 'Hello!'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res3.statusCode).toBe(400);
  });

  test('authorised user is not a member of the channel', async () => {
    const res4 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json:
        {
          email: 'example1@email.com',
          password: 'password1',
          nameFirst: 'First1',
          nameLast: 'Last1'
        }
      }
    );
    const auth1 = JSON.parse(res4.getBody() as string);

    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(200);

    const res3 = request(
      'POST',
      `${url}:${port}/standup/send/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          message: 'Hello!'
        },
        headers: {
          token: auth1.token,
        }
      }
    );
    expect(res3.statusCode).toBe(403);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('invalid token', async () => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(200);

    const res3 = request(
      'POST',
      `${url}:${port}/standup/send/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          message: 'Hello!'
        },
        headers: {
          token: 'abc'
        }
      }
    );
    expect(res3.statusCode).toBe(403);
    await new Promise((r) => setTimeout(r, 1200));
  });

  test('successfully send message to standup', async() => {
    const res2 = request(
      'POST',
      `${url}:${port}/standup/start/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          length: 1
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res2.statusCode).toBe(200);

    const res3 = request(
      'POST',
      `${url}:${port}/standup/send/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          message: 'Hello!'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res3.statusCode).toBe(200);

    const res4 = request(
      'POST',
      `${url}:${port}/standup/send/v1`,
      {
        json:
        {
          channelId: channel0.channelId,
          message: 'Hello!'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res4.statusCode).toBe(200);
    await new Promise((r) => setTimeout(r, 1200));
  });
});
