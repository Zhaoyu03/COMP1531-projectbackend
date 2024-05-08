const request = require('sync-request');
import { url, port } from './config.json';
import { clearV1 } from './other';

const OK = 200;

beforeEach(() => {
  clearV1();
});

afterEach(() => {
  clearV1();
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

beforeEach(() => {
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );
});

describe('Test for /dm/create/v1', () => {
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
  let auth1: any;
  let auth2: any;
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
    auth1 = JSON.parse(res1.getBody() as string);

    const res2 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json:
        {
          email: 'example2@email.com',
          password: 'password2',
          nameFirst: 'Airst2',
          nameLast: 'Last2'
        }
      }
    );
    auth2 = JSON.parse(res2.getBody() as string);
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

  test('create dm successfully', () => {
    const res3 = request(
      'POST',
      `${url}:${port}/dm/create/v2`,
      {
        json:
        {
          uIds: [auth1.authUserId, auth2.authUserId]
        },
        headers:
        {
          token: auth0.token,
        }
      }
    );
    const dm = JSON.parse(res3.getBody() as string);
    expect(res3.statusCode).toBe(OK);
    expect(dm).toStrictEqual({ dmId: expect.any(Number) });
  });

  test('invalid token', () => {
    const res3 = request(
      'POST',
      `${url}:${port}/dm/create/v2`,
      {
        json:
        {
          uIds: [auth1.authUserId, auth2.authUserId]
        },
        headers: {
          token: 'abcd',
        }
      }
    );
    expect(res3.statusCode).toBe(403);
  });

  test('invalid uIds', () => {
    const res3 = request(
      'POST',
      `${url}:${port}/dm/create/v2`,
      {
        json:
        {
          uIds: [auth1.authUserId, -999]
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    expect(res3.statusCode).toBe(400);
  });

  test('duplicate uIds', () => {
    const res3 = request(
      'POST',
      `${url}:${port}/dm/create/v2`,
      {
        json:
        {
          uIds: [auth1.authUserId, auth1.authUserId]
        },
        headers:
        {
          token: auth0.token,
        }
      }
    );
    expect(res3.statusCode).toBe(400);
  });
});

describe('Test for /dm/list/v2', () => {
  // to reset the database
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );
  let auth0: any;
  let auth1: any;
  let auth2: any;
  let dm0: any;
  let dm1: any;
  let res: any;
  // to set the database for the test
  beforeEach(() => {
    res = request(
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
    auth0 = JSON.parse(res.getBody() as string);

    res = request(
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
    auth1 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json:
        {
          email: 'example2@email.com',
          password: 'password2',
          nameFirst: 'First2',
          nameLast: 'Last2'
        }
      }
    );
    auth2 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/dm/create/v2`,
      {
        json:
        {
          uIds: [auth1.authUserId, auth2.authUserId]
        },
        headers:
        {
          token: auth0.token,
        }
      }
    );
    dm0 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/dm/create/v2`,
      {
        json:
        {
          uIds: [auth0.authUserId, auth2.authUserId]
        },
        headers:
        {
          token: auth1.token,
        }
      }
    );
    dm1 = JSON.parse(res.getBody() as string);
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

  test('invalid token', () => {
    const res0 = request(
      'GET',
      `${url}:${port}/dm/list/v2`,
      {
        qs:
        {},
        headers:
        {
          token: 'abc'
        }
      }
    );
    expect(res0.statusCode).toBe(403);
  });

  test('list successfully', () => {
    const res0 = request(
      'GET',
      `${url}:${port}/dm/list/v2`,
      {
        qs:
        {},
        headers:
        {
          token: auth2.token
        }
      }
    );
    const list = JSON.parse(res0.getBody() as string);
    expect(res0.statusCode).toBe(OK);
    const res1 = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: auth0.authUserId
        },
        headers:
        {
          token: auth0.token,
        }
      }
    );
    expect(res1.statusCode).toBe(OK);

    const res2 = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: auth1.authUserId
        },
        headers:
        {
          token: auth1.token,
        }
      }
    );

    expect(res2.statusCode).toBe(OK);
    const res3 = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: auth2.authUserId
        },
        headers:
        {
          token: auth2.token,
        }
      }
    );

    expect(res3.statusCode).toBe(OK);
    expect(list).toStrictEqual({
      dms: [
        {
          dmId: dm0.dmId,
          name: expect.any(String)
        },
        {
          dmId: dm1.dmId,
          name: expect.any(String)
        }
      ]
    });
  });
});

describe('Test for /dm/remove/v2', () => {
  // to reset the database
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {}
  );
  // to set the database for the test
  let auth0: any;
  let auth1: any;
  let auth2: any;
  let dm0: any;
  let res: any;
  beforeEach(() => {
    res = request(
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
    auth0 = JSON.parse(res.getBody() as string);

    res = request(
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
    auth1 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json:
        {
          email: 'example2@email.com',
          password: 'password2',
          nameFirst: 'First2',
          nameLast: 'Last2'
        }
      }
    );
    auth2 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/dm/create/v2`,
      {
        json:
        {
          uIds: [auth1.authUserId, auth2.authUserId]
        },
        headers:
        {
          token: auth0.token,
        }
      }
    );
    dm0 = JSON.parse(res.getBody() as string);
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

  test('invalid dmId', () => {
    const res0 = request(
      'DELETE',
      `${url}:${port}/dm/remove/v2`,
      {
        qs:
        {
          dmId: -999
        },
        headers:
        {
          token: auth0.token,
        }
      }
    );
    expect(res0.statusCode).toBe(400);
  });

  test('auth is not the creator', () => {
    const res0 = request(
      'DELETE',
      `${url}:${port}/dm/remove/v2`,
      {
        qs:
        {
          dmId: dm0.dmId
        },
        headers:
        {
          token: auth1.token,
        }
      }
    );
    expect(res0.statusCode).toBe(403);
  });

  test('invalid token', () => {
    const res0 = request(
      'DELETE',
      `${url}:${port}/dm/remove/v2`,
      {
        qs:
        {
          dmId: dm0.dmId
        },
        headers:
        {
          token: 'abc',
        }
      }
    );
    expect(res0.statusCode).toBe(403);
  });
  test('remove successfully', () => {
    const res0 = request(
      'DELETE',
      `${url}:${port}/dm/remove/v2`,
      {
        qs:
        {
          dmId: dm0.dmId
        },
        headers:
        {
          token: auth0.token,
        }
      }
    );
    expect(res0.statusCode).toBe(OK);
    const remove = JSON.parse(res0.getBody() as string);
    expect(remove).toStrictEqual({});
    const res1 = request(
      'GET',
      `${url}:${port}/dm/list/v2`,
      {
        qs:
        {},
        headers:
        {
          token: auth2.token
        }
      }
    );
    const list = JSON.parse(res1.getBody() as string);
    expect(res1.statusCode).toBe(OK);
    expect(list).toStrictEqual({ dms: [] });
  });
});

describe('Test for /dm/details/v2', () => {
  // to reset the database
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );
  let auth0: any;
  let auth1: any;
  let auth2: any;
  let dm0: any;
  let res: any;
  // to set the database for the test
  beforeEach(() => {
    res = request(
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
    auth0 = JSON.parse(res.getBody() as string);

    res = request(
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
    auth1 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json:
        {
          email: 'example2@email.com',
          password: 'password2',
          nameFirst: 'First2',
          nameLast: 'Last2'
        }
      }
    );
    auth2 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/dm/create/v2`,
      {
        json:
        {
          uIds: [auth1.authUserId, auth2.authUserId]
        },
        headers:
        {
          token: auth0.token,
        }
      }
    );
    dm0 = JSON.parse(res.getBody() as string);
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

  test('invalid token', () => {
    const res0 = request(
      'GET',
      `${url}:${port}/dm/details/v2`,
      {
        qs:
        {
          dmId: dm0.dmId
        },
        headers:
        {
          token: 'abc',
        }
      }
    );
    expect(res0.statusCode).toBe(403);
  });

  test('invalid dmId', () => {
    const res0 = request(
      'GET',
      `${url}:${port}/dm/details/v2`,
      {
        qs:
        {
          dmId: -999
        },
        headers:
        {
          token: auth1.token,
        }
      }
    );
    expect(res0.statusCode).toBe(400);
  });

  test('auth not in dm members', () => {
    const res0 = request(
      'GET',
      `${url}:${port}/dm/details/v2`,
      {
        qs:
        {
          dmId: dm0.dmId
        },
        headers:
        {
          token: auth0.token,
        }
      }
    );
    expect(res0.statusCode).toBe(403);
  });

  test('print details successfully', () => {
    const res0 = request(
      'GET',
      `${url}:${port}/dm/details/v2`,
      {
        qs:
        {
          dmId: dm0.dmId
        },
        headers:
        {
          token: auth1.token,
        }
      }
    );
    const details = JSON.parse(res0.getBody() as string);
    expect(res0.statusCode).toBe(OK);
    const res1 = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: auth1.authUserId
        },
        headers:
        {
          token: auth1.token,
        }
      }
    );
    expect(res1.statusCode).toBe(OK);
    const profile1 = JSON.parse(res1.getBody() as string);
    const res2 = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: auth2.authUserId
        },
        headers:
        {
          token: auth2.token
        }
      }
    );
    expect(res2.statusCode).toBe(OK);
    const profile2 = JSON.parse(res2.getBody() as string);
    expect(details).toStrictEqual({
      name: expect.any(String),
      members: [
        {
          uId: auth1.authUserId,
          email: 'example1@email.com',
          nameFirst: 'First1',
          nameLast: 'Last1',
          handleStr: profile1.user.handleStr
        },
        {
          uId: auth2.authUserId,
          email: 'example2@email.com',
          nameFirst: 'First2',
          nameLast: 'Last2',
          handleStr: profile2.user.handleStr
        }
      ]
    });
  });
});

describe('Test for /dm/leave/v2', () => {
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
  let auth1: any;
  let auth2: any;
  let dm0: any;
  let res: any;
  beforeEach(() => {
    res = request(
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
    auth0 = JSON.parse(res.getBody() as string);

    res = request(
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
    auth1 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json:
        {
          email: 'example2@email.com',
          password: 'password2',
          nameFirst: 'First2',
          nameLast: 'Last2'
        }
      }
    );
    auth2 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/dm/create/v2`,
      {
        json:
        {
          uIds: [auth1.authUserId, auth2.authUserId]
        },
        headers:
        {
          token: auth0.token,
        }
      }
    );
    dm0 = JSON.parse(res.getBody() as string);
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

  test('invalid dmId', () => {
    const res0 = request(
      'POST',
      `${url}:${port}/dm/leave/v2`,
      {
        json:
        {
          dmId: -999
        },
        headers:
        {
          token: auth1.token,
        }
      }
    );
    expect(res0.statusCode).toBe(400);
  });

  test('invalid token', () => {
    const res0 = request(
      'POST',
      `${url}:${port}/dm/leave/v2`,
      {
        json:
        {
          dmId: dm0.dmId
        },
        headers:
        {
          token: 'abc',
        }
      }
    );
    expect(res0.statusCode).toBe(403);
  });

  test('auth not in the dm', () => {
    const res0 = request(
      'POST',
      `${url}:${port}/dm/leave/v2`,
      {
        json:
        {
          dmId: dm0.dmId
        },
        headers:
        {
          token: auth0.token,
        }
      }
    );
    expect(res0.statusCode).toBe(403);
  });

  test('leave successfully', () => {
    const res0 = request(
      'POST',
      `${url}:${port}/dm/leave/v2`,
      {
        json:
        {
          dmId: dm0.dmId
        },
        headers:
        {
          token: auth1.token
        }
      }
    );
    const leave = JSON.parse(res0.getBody() as string);
    expect(res0.statusCode).toBe(OK);
    expect(leave).toStrictEqual({});

    const res1 = request(
      'GET',
      `${url}:${port}/dm/details/v2`,
      {
        qs:
        {
          dmId: dm0.dmId
        },
        headers:
        {
          token: auth2.token
        }
      }
    );
    const details = JSON.parse(res1.getBody() as string);
    expect(res1.statusCode).toBe(OK);
    const res2 = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: auth1.authUserId
        },
        headers:
        {
          token: auth1.token
        }
      }
    );
    expect(res2.statusCode).toBe(OK);
    const res3 = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: auth2.authUserId
        },
        headers:
        {
          token: auth2.token
        }
      }
    );
    expect(res3.statusCode).toBe(OK);
    const profile = JSON.parse(res3.getBody() as string);
    expect(details).toStrictEqual({
      name: expect.any(String),
      members: [
        {
          uId: auth2.authUserId,
          email: 'example2@email.com',
          nameFirst: 'First2',
          nameLast: 'Last2',
          handleStr: profile.user.handleStr
        }
      ]
    });
  });
});
