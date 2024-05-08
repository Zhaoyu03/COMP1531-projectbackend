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

describe('setNameV2', () => {
  // ************ Need to test that token works ********************
  test('setName Works', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);

    const validNameFirst = 'valid';
    const validNameLast = 'validname';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/setname/v2`,

      {
        json: {
          nameFirst: validNameFirst,
          nameLast: validNameLast
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual({});
  });

  test('New nameFirst is too long', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);
    const longNameFirst = 'hcnsjriudndhcnsjriudndhcnsjriudndhcnsjriudndhcnsjriudnd';
    const validNameLast = 'valid';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/setname/v2`,

      {
        json: {
          nameFirst: longNameFirst,
          nameLast: validNameLast
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    expect(res.statusCode).toBe(400);
  });

  test('New lastName is too long', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);
    const validNameFirst = 'valid';
    const longNameLast = 'hcnsjriudndhcnsjriudndhcnsjriudndhcnsjriudndhcnsjriudnd';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/setname/v2`,

      {
        json: {
          nameFirst: validNameFirst,
          nameLast: longNameLast
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    expect(res.statusCode).toBe(400);
  });

  test('New nameFist/Last too long', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);

    const longNameFirst = 'sndhcjgutksndhcjgutksndhcjgutksndhcjgutksndhcjgutksndhfc';
    const longNameLast = 'hcnsjriudndhcnsjriudndhcnsjriudndhcnsjriudndhcnsjriudnd';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/setname/v2`,

      {
        json: {
          nameFirst: longNameFirst,
          nameLast: longNameLast
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    expect(res.statusCode).toBe(400);
  });

  test('New name is too short', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);
    const validNameFirst = 'valid';
    const invalidNameLast = '';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/setname/v2`,

      {
        json: {
          nameFirst: validNameFirst,
          nameLast: invalidNameLast
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    expect(res.statusCode).toBe(400);
  });

  test('New name is not letters', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);
    const validNameFirst = 'valid';
    const invalidNameLast = 'djc$%12';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/setname/v2`,

      {
        json: {
          nameFirst: validNameFirst,
          nameLast: invalidNameLast
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    expect(res.statusCode).toBe(400);
  });

  test('Token is invalid', () => {
    const validNameFirst = 'valid';
    const invalidNameLast = 'validname';
    const invalidToken = '3284few-sdnsdf-2345';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/setname/v2`,

      {
        json: {
          nameFirst: validNameFirst,
          nameLast: invalidNameLast
        },
        headers: {
          token: invalidToken
        }
      }
    );

    expect(res.statusCode).toBe(403);
  });
});

describe('setEmailV2', () => {
  test('setEmailV2 Works', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);
    const newEmail = 'dusan24@unsw.com';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/setemail/v2`,

      {
        json: {
          email: newEmail
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual({});
  });

  test('Email is not valid', () => {
    const invalidEmail = 'invalidEmail';
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);

    const res = request(
      'PUT',
      `${url}:${port}/user/profile/setemail/v2`,

      {
        json: {
          email: invalidEmail,
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    expect(res.statusCode).toBe(400);
  });

  test('email is already in use', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);

    const newEmail = 'dusan@unsw.com.au';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/setemail/v2`,

      {
        json: {
          email: newEmail
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    expect(res.statusCode).toBe(400);
  });
  test('invalid token', () => {
    // Creates Valid User
    request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );
    const invalidToken = 'dasdf';
    const newEmail = 'dusan@unsw.com.au';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/setemail/v2`,

      {
        json: {
          email: newEmail
        },
        headers: {
          token: invalidToken
        }
      }
    );

    expect(res.statusCode).toBe(403);
  });
});

describe('setHandleV2', () => {
  test('SetHandleV2 works', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);

    // Tests setHandleV2 Works
    const handleStr = 'DusanSta123';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/sethandle/v2`,

      {
        json: {
          handleStr: handleStr
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual({});
  });

  test('Empty handle', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);

    const handle = '';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/sethandle/v2`,

      {
        json: {
          handleStr: handle
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    expect(res.statusCode).toBe(400);
  });

  test('Handle too long', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);

    const longHandle = 'dfcnshdjtoclsmh24hx7s1';

    const res = request(
      'PUT',
      `${url}:${port}/user/profile/sethandle/v2`,

      {
        json: {
          handleStr: longHandle
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    expect(res.statusCode).toBe(400);
  });

  test('Handle too short', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);

    const shortHandle = 'ds';
    const res = request(
      'PUT',
    `${url}:${port}/user/profile/sethandle/v2`,

    {
      json: {
        handleStr: shortHandle
      },
      headers: {
        token: validUserJSON.token
      }
    }
    );

    expect(res.statusCode).toBe(400);
  });

  test('Non alphanumeric handle', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);

    const newHandle = 'cdjk2#$!@&';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/sethandle/v2`,
      {
        json: {
          handleStr: newHandle
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    expect(res.statusCode).toBe(400);
  });

  test('Handle already in use', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);

    // Views user profile
    const userProfile = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: validUserJSON.authUserId
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );
    const userProfileJSON = JSON.parse(userProfile.getBody() as string);

    const res = request(
      'PUT',
      `${url}:${port}/user/profile/sethandle/v2`,

      {
        json: {
          handleStr: userProfileJSON.user.handleStr
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    expect(res.statusCode).toBe(400);
  });

  test('Invalid token', () => {
    // Creates Valid User
    const validUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);

    // Views user profile
    const userProfile = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: validUserJSON.authUserId
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );
    const userProfileJSON = JSON.parse(userProfile.getBody() as string);

    const invalidToken = 'sdfsd';
    const res = request(
      'PUT',
      `${url}:${port}/user/profile/sethandle/v2`,

      {
        json: {
          handleStr: userProfileJSON.user.handleStr
        },
        headers: {
          token: invalidToken
        }
      }
    );

    expect(res.statusCode).toBe(403);
  });
});
