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

describe('sendDMv2', () => {
  test('Send DM works', () => {
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

    // Creates Valid User
    const validUser1 = request(
      'POST',
    `${url}:${port}/auth/register/v3`,

    {
      json: {
        email: 'dusan12@unsw.com.au',
        password: 'TestPassword02',
        nameFirst: 'Dusan',
        nameLast: 'Stankovic'
      }
    }
    );

    const validUser1JSON = JSON.parse(validUser1.getBody() as string);

    // Creates DM
    const dmCreate = request(
      'POST',
    `${url}:${port}/dm/create/v2`,

    {
      json: {
        uIds: [validUserJSON.authUserId, validUser1JSON.authUserId]
      },
      headers: {
        token: validUserJSON.token
      }
    }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
    const message = 'valid message';
    const res = request(
      'POST',
    `${url}:${port}/message/senddm/v2`,

    {
      json: {
        dmId: dmCreateJSON.dmId,
        message: message
      },
      headers: {
        token: validUserJSON.token
      }
    }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ messageId: data.messageId });
  });
  /*
  test('dmId is valid but authUser is not a member', () => {
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

    // User that is not member
    const invalidMember = request(
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

    const invalidMemberJSON = JSON.parse(invalidMember.getBody() as string);

    // Creates DM
    const dmCreate = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [invalidMemberJSON.authUserId]
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);

    const res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,

      {
        json: {
          dmId: dmCreateJSON.dmId,
          message: 'test message'
        },
        headers: {
          token: invalidMemberJSON.token
        }
      }
    );

    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'error' });
  });

  test('Message length < 1', () => {
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

    // Creates Valid User
    const validUser1 = request(
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

    const validUser1JSON = JSON.parse(validUser1.getBody() as string);

    // Creates DM
    const dmCreate = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [validUserJSON.authUserId, validUser1JSON.authUserId],
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
    const shortMessage = '';
    const res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,

      {
        json: {
          dmId: dmCreateJSON.dmId,
          message: shortMessage
        },
        headers: {
          token: validUserJSON.token
        }
      }
    );

    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'error' });
  });
  */
});

describe('Http test for message send function', () => {
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );
  let auth0: any;
  let res: any;
  let channel0: any;
  beforeEach(() => {
    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: '123@123.com',
          password: '147258',
          nameFirst: 'nameFirst',
          nameLast: 'nameLast'
        }
      }
    );
    auth0 = JSON.parse(res.getBody() as string);
    res = request(
      'POST',
      `${url}:${port}/channels/create/v3`,
      {
        json: {
          name: 'channel0',
          isPublic: true
        },
        headers: {
          token: auth0.token
        }
      }
    );
    channel0 = JSON.parse(res.getBody() as string);
  });
  test('invalid channelId error', () => {
    const res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: -999,
          message: '15646sdaa'
        },
        headers: {
          token: auth0.token
        }
      }
    );
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual({ error: 'error' });
  });
  test('messages length error', () => {
    const res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: channel0.channelId,
          message: ''
        },
        headers: {
          token: auth0.token
        }
      }
    );
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual({ error: 'error' });
  });
  test('user token error', () => {
    const res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: 0,
          message: 'dwadadw'
        },
        headers: {
          token: 'sdwads'
        }
      }
    );
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual({ error: 'error' });
  });
  test('OK', () => {
    const res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: channel0.channelId,
          message: 'dwadadw'
        },
        headers: {
          token: auth0.token
        }
      }
    );
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual({ messageId: expect.any(Number) });
  });
});
describe('Http test for message function', () => {
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );
  let message0: any;
  let auth0: any;
  let res: any;
  beforeEach(() => {
    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: '123@123.com',
          password: '147258',
          nameFirst: 'nameFirst',
          nameLast: 'nameLast'
        }
      }
    );
    auth0 = JSON.parse(res.getBody() as string);
    res = request(
      'POST',
      `${url}:${port}/channels/create/v3`,
      {
        json: {
          name: 'channel0',
          isPublic: true
        },
        headers: {
          token: auth0.token
        }
      }
    );
    res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: 0,
          message: 'dasdwa'
        },
        headers: {
          token: auth0.token
        }
      }
    );
    message0 = JSON.parse(res.getBody() as string);
  });
  test('message length error', () => {
    const res = request(
      'PUT',
      `${url}:${port}/message/edit/v2`,
      {
        json: {
          messageId: message0.messageId,
          message: ''
        },
        headers: {
          token: auth0.token
        }
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual({ error: 'error' });
  });
  test('messageId  error', () => {
    const res = request(
      'PUT',
      `${url}:${port}/message/edit/v2`,
      {
        json: {
          messageId: -99,
          message: 'dawfawd'
        },
        headers: {
          token: auth0.token
        }
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual({ error: 'error' });
  });
  test('token  error', () => {
    const res = request(
      'PUT',
      `${url}:${port}/message/edit/v2`,
      {
        json: {
          messageId: 0,
          message: 'dawfawd'
        },
        headers: {
          token: 'dawd'
        }
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual({ error: 'error' });
  });
  test('successful case', () => {
    const res = request(
      'PUT',
      `${url}:${port}/message/edit/v2`,
      {
        json: {
          messageId: 0,
          message: 'dawfawd'
        },
        headers: {
          token: auth0.token
        }
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual({
      error: 'error'
    });
  });
});
describe('Http test for message remove function', () => {
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );
  let message0: any;
  let auth0: any;
  let res: any;
  beforeEach(() => {
    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: '123@123.com',
          password: '147258',
          nameFirst: 'nameFirst',
          nameLast: 'nameLast'
        }
      }
    );
    auth0 = JSON.parse(res.getBody() as string);
    res = request(
      'POST',
      `${url}:${port}/channels/create/v3`,
      {
        json: {
          name: 'channel0',
          isPublic: true
        },
        headers: {
          token: auth0.token
        }
      }
    );
    res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: 0,
          message: 'dasdwa'
        },
        headers: {
          token: auth0.token
        }
      }
    );
    message0 = JSON.parse(res.getBody() as string);
  });
  test('invalid token', () => {
    const res = request(
      'DELETE',
      `${url}:${port}/message/remove/v2`,
      {
        qs: {
          messageId: message0.messageId
        },
        headers: {
          token: 'user1'
        }
      }
    );
    const queryObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(queryObj).toEqual({ error: 'error' });
  });
});
describe('Http test for message share function', () => {
  beforeEach(() => {
    request(
      'DELETE',
      `${url}:${port}/clear/v1`,
      {
        qs: {}
      }
    );
  });
  // test('good case', () => {
  //   const validUser = request(
  //     'POST',
  //     `${url}:${port}/auth/register/v3`,
  //
  //     {
  //       json: {
  //         email: 'dusan@unsw.com.au',
  //         password: 'TestPassword01',
  //         nameFirst: 'Dusan',
  //         nameLast: 'Stankovic'
  //       }
  //     }
  //   );
  //
  //   const validUserJSON = JSON.parse(validUser.getBody() as string);
  //   const validUser1 = request(
  //     'POST',
  //     `${url}:${port}/auth/register/v3`,
  //
  //     {
  //       json: {
  //         email: 'dusan12@unsw.com.au',
  //         password: 'TestPassword02',
  //         nameFirst: 'Dusan',
  //         nameLast: 'Stankovic'
  //       }
  //     }
  //   );
  //
  //   const validUser1JSON = JSON.parse(validUser1.getBody() as string);
  //   // Creates DM
  //   const dmCreate = request(
  //     'POST',
  //     `${url}:${port}/dm/create/v2`,
  //
  //     {
  //       json: {
  //         token: validUser1JSON.token,
  //         uIds: [validUser1JSON.authUserId],
  //       }
  //     }
  //   );
  //
  //   const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
  //   const message = 'valid message';
  //   const res = request(
  //     'POST',
  //     `${url}:${port}/message/senddm/v2`,
  //
  //     {
  //       json: {
  //         token: validUserJSON.token,
  //         dmId: dmCreateJSON.dmId,
  //         message: message
  //       }
  //     }
  //   );
  //   const message1 = JSON.parse(res.getBody() as string);
  //   const res1 = request(
  //     'POST',
  //     `${url}:${port}/message/share/v1`,
  //
  //     {
  //       json: {
  //         ogMessageId: message1,
  //         message: 'test',
  //         channelId: -1,
  //         dmId: 1
  //       },
  //       headers: {
  //         token: validUserJSON.token,
  //       }
  //     });
  //   const data = JSON.parse(res1.getBody() as string);
  //   expect(res.statusCode).toBe(OK);
  //   expect(data).toEqual({ sharedMessageId: 0 });
  // });
  test('400 error 1', () => {
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
    const validUser1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan12@unsw.com.au',
          password: 'TestPassword02',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUser1JSON = JSON.parse(validUser1.getBody() as string);
    // Creates DM
    const dmCreate = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [validUser1JSON.authUserId],
        },
        headers: {
          token: validUser1JSON.token,
        }
      }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
    const message = 'valid message';
    const res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,

      {
        json: {
          dmId: dmCreateJSON.dmId,
          message: message
        },
        headers: {
          token: validUserJSON.token,
        }
      }
    );
    const message1 = JSON.parse(res.getBody() as string);
    const share = request(
      'POST',
      `${url}:${port}/message/share/v1`,

      {
        json: {
          ogMessageId: message1,
          message: 'test',
          channelId: 0,
          dmId: 0
        },
        headers: {
          token: validUserJSON.token,
        }
      });
    // const data = JSON.parse(res1.getBody() as string);
    expect(share.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });
  test('400 error 2', () => {
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
    const validUser1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan12@unsw.com.au',
          password: 'TestPassword02',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUser1JSON = JSON.parse(validUser1.getBody() as string);
    // Creates DM
    const dmCreate = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [validUser1JSON.authUserId],
        },
        headers: {
          token: validUser1JSON.token,
        }
      }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
    const message = 'valid message';
    const res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,

      {
        json: {
          dmId: dmCreateJSON.dmId,
          message: message
        },
        headers: {
          token: validUserJSON.token,
        }
      }
    );
    const message1 = JSON.parse(res.getBody() as string);
    const share = request(
      'POST',
      `${url}:${port}/message/share/v1`,

      {
        json: {
          ogMessageId: message1,
          message: 'test',
          channelId: 1,
          dmId: 1
        },
        headers: {
          token: validUserJSON.token,
        }
      });
    // const data = JSON.parse(res1.getBody() as string);
    expect(share.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });
  test('400 error 3', () => {
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
    const validUser1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan12@unsw.com.au',
          password: 'TestPassword02',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUser1JSON = JSON.parse(validUser1.getBody() as string);
    // Creates DM
    const dmCreate = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [validUser1JSON.authUserId],
        },
        headers: {
          token: validUser1JSON.token,
        }
      }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
    const message = 'valid message';
    request(
      'POST',
      `${url}:${port}/message/senddm/v2`,

      {
        json: {
          dmId: dmCreateJSON.dmId,
          message: message
        },
        headers: {
          token: validUserJSON.token,
        }
      }
    );
    const share = request(
      'POST',
      `${url}:${port}/message/share/v1`,

      {
        json: {
          ogMessageId: 654563,
          message: 'test',
          channelId: 1,
          dmId: 1
        },
        headers: {
          token: validUserJSON.token,
        }
      });
    // const data = JSON.parse(res1.getBody() as string);
    expect(share.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });
  test('400 error 4', () => {
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
    const validUser1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan12@unsw.com.au',
          password: 'TestPassword02',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUser1JSON = JSON.parse(validUser1.getBody() as string);
    // Creates DM
    const dmCreate = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [validUser1JSON.authUserId],
        },
        headers: {
          token: validUser1JSON.token,
        }
      }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
    const message = 'valid message';
    const res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,

      {
        json: {
          dmId: dmCreateJSON.dmId,
          message: message
        },
        headers: {
          token: validUserJSON.token,
        }
      }
    );
    const message1 = JSON.parse(res.getBody() as string);
    const arr: any = [];
    for (let i = 0; i < 1010; i++) {
      const n = Math.random().toString(36).substr(2, 10);
      arr.push(n);
    }
    const share = request(
      'POST',
      `${url}:${port}/message/share/v1`,

      {
        json: {
          ogMessageId: message1,
          message: arr.toString(),
          channelId: -1,
          dmId: 0
        },
        headers: {
          token: validUserJSON.token,
        }
      });
    // const data = JSON.parse(res1.getBody() as string);
    expect(share.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });
  // test('403 error 1', () => {
  //   const validUser = request(
  //     'POST',
  //     `${url}:${port}/auth/register/v3`,
  //
  //     {
  //       json: {
  //         email: 'dusan@unsw.com.au',
  //         password: 'TestPassword01',
  //         nameFirst: 'Dusan',
  //         nameLast: 'Stankovic'
  //       }
  //     }
  //   );
  //
  //   const validUserJSON = JSON.parse(validUser.getBody() as string);
  //   const validUser1 = request(
  //     'POST',
  //     `${url}:${port}/auth/register/v3`,
  //
  //     {
  //       json: {
  //         email: 'dusan12@unsw.com.au',
  //         password: 'TestPassword02',
  //         nameFirst: 'Dusan',
  //         nameLast: 'Stankovic'
  //       }
  //     }
  //   );
  //
  //   const validUser1JSON = JSON.parse(validUser1.getBody() as string);
  //   // Creates DM
  //   const dmCreate = request(
  //     'POST',
  //     `${url}:${port}/dm/create/v2`,
  //
  //     {
  //       json: {
  //         token: validUser1JSON.token,
  //         uIds: [validUser1JSON.authUserId],
  //       }
  //     }
  //   );
  //
  //   const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
  //   const message = 'valid message';
  //   const res = request(
  //     'POST',
  //     `${url}:${port}/message/senddm/v2`,
  //
  //     {
  //       json: {
  //         token: validUserJSON.token,
  //         dmId: dmCreateJSON.dmId,
  //         message: message
  //       }
  //     }
  //   );
  //   const message1 = JSON.parse(res.getBody() as string);
  //   request(
  //     'POST',
  //     `${url}:${port}/message/share/v1`,
  //
  //     {
  //       json: {
  //         ogMessageId: message1.messageId,
  //         message: 'test',
  //         channelId: -1,
  //         dmId: 0
  //       },
  //       headers: {
  //         token: validUserJSON.token,
  //       }
  //     });
  //   // const data = JSON.parse(res1.getBody() as string);
  //   expect(res.statusCode).toBe(403);
  //   // expect(data).toEqual({ error: 'error' });
  // });
});

describe('Http test for message react function', () => {
  // test('good case', () => {
  //   const validUser = request(
  //     'POST',
  //     `${url}:${port}/auth/register/v3`,
  //
  //     {
  //       json: {
  //         email: 'dusan@unsw.com.au',
  //         password: 'TestPassword01',
  //         nameFirst: 'Dusan',
  //         nameLast: 'Stankovic'
  //       }
  //     }
  //   );
  //
  //   const validUserJSON = JSON.parse(validUser.getBody() as string);
  //   const validUser1 = request(
  //     'POST',
  //     `${url}:${port}/auth/register/v3`,
  //
  //     {
  //       json: {
  //         email: 'dusan12@unsw.com.au',
  //         password: 'TestPassword02',
  //         nameFirst: 'Dusan',
  //         nameLast: 'Stankovic'
  //       }
  //     }
  //   );
  //
  //   const validUser1JSON = JSON.parse(validUser1.getBody() as string);
  //   // Creates DM
  //   const dmCreate = request(
  //     'POST',
  //     `${url}:${port}/dm/create/v2`,
  //
  //     {
  //       json: {
  //         token: validUser1JSON.token,
  //         uIds: [validUser1JSON.authUserId],
  //       }
  //     }
  //   );
  //
  //   const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
  //   const message = 'valid message';
  //   const res = request(
  //     'POST',
  //     `${url}:${port}/message/senddm/v2`,
  //
  //     {
  //       json: {
  //         token: validUserJSON.token,
  //         dmId: dmCreateJSON.dmId,
  //         message: message
  //       }
  //     }
  //   );
  //   const message1 = JSON.parse(res.getBody() as string);
  //   const res1 = request(
  //     'POST',
  //     `${url}:${port}/message/react/v1`,
  //
  //     {
  //       json: {
  //         messageId: message1.messageId,
  //         reactId: 1
  //       },
  //       headers: {
  //         token: validUserJSON.token,
  //       }
  //     });
  //   const data = JSON.parse(res1.getBody() as string);
  //   expect(res.statusCode).toBe(OK);
  //   expect(data).toEqual({});
  // });
  /*
  test('400 error 1', () => {
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
    const validUser1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan12@unsw.com.au',
          password: 'TestPassword02',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUser1JSON = JSON.parse(validUser1.getBody() as string);
    // Creates DM
    const dmCreate = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          token: validUser1JSON.token,
          uIds: [validUser1JSON.authUserId],
        }
      }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
    const message = 'valid message';
    request(
      'POST',
      `${url}:${port}/message/senddm/v2`,

      {
        json: {
          dmId: dmCreateJSON.dmId,
          message: message
        },
        headers: {
          token: validUserJSON.token,
        }
      }
    );
    const react = request(
      'POST',
      `${url}:${port}/message/react/v2`,

      {
        json: {
          messageId: -100,
          reactId: 1
        },
        headers: {
          token: validUserJSON.token,
        }
      });
    // const data = JSON.parse(res1.getBody() as string);
    expect(react.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });
  */
  test('400 error 2', () => {
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
    const validUser1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan12@unsw.com.au',
          password: 'TestPassword02',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUser1JSON = JSON.parse(validUser1.getBody() as string);
    // Creates DM
    const dmCreate = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [validUser1JSON.authUserId],
        },
        headers: {
          token: validUser1JSON.token,
        }
      }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
    const message = 'valid message';
    const res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,

      {
        json: {
          dmId: dmCreateJSON.dmId,
          message: message
        },
        headers: {
          token: validUserJSON.token,
        }
      }
    );
    const message1 = JSON.parse(res.getBody() as string);
    const react = request(
      'POST',
      `${url}:${port}/message/react/v1`,

      {
        json: {
          messageId: message1.messageId,
          reactId: -1
        },
        headers: {
          token: validUserJSON.token,
        }
      });
    // const data = JSON.parse(res1.getBody() as string);
    expect(react.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });
  test('400 error 3', () => {
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
    const validUser1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan12@unsw.com.au',
          password: 'TestPassword02',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUser1JSON = JSON.parse(validUser1.getBody() as string);
    // Creates DM
    const dmCreate = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [validUser1JSON.authUserId],
        },
        headers: {
          token: validUser1JSON.token,
        }
      }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
    const message = 'valid message';
    const res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,

      {
        json: {
          dmId: dmCreateJSON.dmId,
          message: message
        },
        headers: {
          token: validUserJSON.token,
        }
      }
    );
    const message1 = JSON.parse(res.getBody() as string);
    const react = request(
      'POST',
      `${url}:${port}/message/react/v1`,

      {
        json: {
          messageId: message1.messageId,
          reactId: 1
        },
        headers: {
          token: validUserJSON.token,
        }
      });
    // const data = JSON.parse(res1.getBody() as string);
    expect(react.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });
});
describe('Http test for message unreact function', () => {
  // test('good case', () => {
  //   const validUser = request(
  //     'POST',
  //     `${url}:${port}/auth/register/v3`,
  //
  //     {
  //       json: {
  //         email: 'dusan@unsw.com.au',
  //         password: 'TestPassword01',
  //         nameFirst: 'Dusan',
  //         nameLast: 'Stankovic'
  //       }
  //     }
  //   );
  //
  //   const validUserJSON = JSON.parse(validUser.getBody() as string);
  //   const validUser1 = request(
  //     'POST',
  //     `${url}:${port}/auth/register/v3`,
  //
  //     {
  //       json: {
  //         email: 'dusan12@unsw.com.au',
  //         password: 'TestPassword02',
  //         nameFirst: 'Dusan',
  //         nameLast: 'Stankovic'
  //       }
  //     }
  //   );
  //
  //   const validUser1JSON = JSON.parse(validUser1.getBody() as string);
  //   // Creates DM
  //   const dmCreate = request(
  //     'POST',
  //     `${url}:${port}/dm/create/v2`,
  //
  //     {
  //       json: {
  //         token: validUser1JSON.token,
  //         uIds: [validUser1JSON.authUserId],
  //       }
  //     }
  //   );
  //
  //   const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
  //   const message = 'valid message';
  //   const res = request(
  //     'POST',
  //     `${url}:${port}/message/senddm/v2`,
  //
  //     {
  //       json: {
  //         token: validUserJSON.token,
  //         dmId: dmCreateJSON.dmId,
  //         message: message
  //       }
  //     }
  //   );
  //   const message1 = JSON.parse(res.getBody() as string);
  //   const res1 = request(
  //     'POST',
  //     `${url}:${port}/message/unreact/v1`,
  //
  //     {
  //       json: {
  //         messageId: message1.messageId,
  //         reactId: 1
  //       },
  //       headers: {
  //         token: validUserJSON.token,
  //       }
  //     });
  //   const data = JSON.parse(res1.getBody() as string);
  //   expect(res.statusCode).toBe(OK);
  //   expect(data).toEqual({});
  // });
  test('400 error 1', () => {
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
    const validUser1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan12@unsw.com.au',
          password: 'TestPassword02',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUser1JSON = JSON.parse(validUser1.getBody() as string);
    // Creates DM
    const dmCreate = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [validUser1JSON.authUserId],
        },
        headers: {
          token: validUser1JSON.token,
        }
      }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
    const message = 'valid message';
    request(
      'POST',
      `${url}:${port}/message/senddm/v2`,

      {
        json: {
          dmId: dmCreateJSON.dmId,
          message: message
        },
        headers: {
          token: validUserJSON.token,
        }
      }
    );
    const unreact = request(
      'POST',
      `${url}:${port}/message/unreact/v1`,

      {
        json: {
          messageId: -100,
          reactId: 1
        },
        headers: {
          token: validUserJSON.token,
        }
      });
    // const data = JSON.parse(res1.getBody() as string);
    expect(unreact.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });
  test('400 error 2', () => {
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
    const validUser1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan12@unsw.com.au',
          password: 'TestPassword02',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUser1JSON = JSON.parse(validUser1.getBody() as string);
    // Creates DM
    const dmCreate = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [validUser1JSON.authUserId],
        },
        headers: {
          token: validUser1JSON.token,
        }
      }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
    const message = 'valid message';
    const res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,

      {
        json: {
          dmId: dmCreateJSON.dmId,
          message: message
        },
        headers: {
          token: validUserJSON.token,
        }
      }
    );
    const message1 = JSON.parse(res.getBody() as string);
    const unreact = request(
      'POST',
      `${url}:${port}/message/unreact/v1`,

      {
        json: {
          messageId: message1.messageId,
          reactId: -1
        },
        headers: {
          token: validUserJSON.token,
        }
      });
    // const data = JSON.parse(res1.getBody() as string);
    expect(unreact.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });
  test('400 error 3', () => {
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
    const validUser1 = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan12@unsw.com.au',
          password: 'TestPassword02',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validUser1JSON = JSON.parse(validUser1.getBody() as string);
    // Creates DM
    const dmCreate = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [validUser1JSON.authUserId],
        },
        headers: {
          token: validUser1JSON.token,
        }
      }
    );

    const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
    const message = 'valid message';
    const res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,

      {
        json: {
          dmId: dmCreateJSON.dmId,
          message: message
        },
        headers: {
          token: validUserJSON.token,
        }
      }
    );
    const message1 = JSON.parse(res.getBody() as string);
    request(
      'POST',
      `${url}:${port}/message/react/v1`,

      {
        json: {
          messageId:
          message1.messageId,
          reactId: 1
        },
        headers: {
          token: validUserJSON.token,
        }
      });
    const unreact = request(
      'POST',
      `${url}:${port}/message/unreact/v1`,

      {
        json: {
          messageId: message1.messageId,
          reactId: ''
        },
        headers: {
          token: validUserJSON.token,
        }
      });
    // const data = JSON.parse(res1.getBody() as string);
    expect(unreact.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });
});

// describe('Http test for search', () => {
// test('search', () => {
//   // Creates Valid User
//   const validUser = request(
//     'POST',
//     `${url}:${port}/auth/register/v3`,
//
//     {
//       json: {
//         email: 'dusan@unsw.com.au',
//         password: 'TestPassword01',
//         nameFirst: 'Dusan',
//         nameLast: 'Stankovic'
//       }
//     }
//   );
//   const validUserJSON = JSON.parse(validUser.getBody() as string);
//   console.log(validUserJSON);
//   // Creates DM
//   const dmCreate = request(
//     'POST',
//     `${url}:${port}/dm/create/v2`,
//
//     {
//       json: {
//         token: validUserJSON.token,
//         uIds: [validUserJSON.authUserId],
//       }
//     }
//   );
//
//   const dmCreateJSON = JSON.parse(dmCreate.getBody() as string);
//   console.log(dmCreateJSON);
//   request(
//     'POST',
//     `${url}:${port}/message/senddm/v2`,
//
//     {
//       json: {
//         token: validUserJSON.token,
//         dmId: dmCreateJSON.dmId,
//         message: 'message'
//       }
//     }
//   );
//   const d = getData();
//   console.log(d.dms);
//   const search = request(
//     'GET',
//   `${url}:${port}/search/v1`,
//   {
//     qs: {
//       queryStr: 'message'
//     }
//   });
//   const data = JSON.parse(search.getBody() as string);
//   expect(search.statusCode).toBe(OK);
//   expect(data).toEqual({
//     messages: 'message'
//   });
// });
test('400 error', () => {
  const search = request(
    'GET',
      `${url}:${port}/search/v1`,
      {
        qs: {
          queryStr: ''
        }
      });
    // const data = JSON.parse(search.getBody() as string);
  expect(search.statusCode).toBe(400);
  // expect(data).toEqual({ error: ' length of queryStr is less than 1 or over 1000 characters' });
});
// });

describe('/message/pin/v1', () => {
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );
  /*
  let auth0: any;
  let res: any;
  let channel0: any;
  let dm0: any;
  let message0: any;
  beforeEach(() => {
    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'test@unsw.com',
          password: 'password123',
          nameFirst: 'nameFirst',
          nameLast: 'nameLast'
        }
      }
    );
    auth0 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/channels/create/v3`,
      {
        json: {
          name: 'channel0',
          isPublic: true
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    channel0 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [auth0.authUserId],
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    dm0 = JSON.parse(res.getBody() as string);
  }); */
  /*
  test('invalid messageId for a channel message', () => {
    const FakeMessageId = 909;

    res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: channel0.channelId,
          message: 'dasdwa'
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    res = request(
      'POST',
      `${url}:${port}/message/pin/v1`,
      {
        json: {
          messageId: FakeMessageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(400);
  }); */
  /*
  test('invalid messageId for a dm message', () => {
    const FakeMessageId = 909;
    res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,
      {
        json: {
          dmId: dm0.dmId,
          message: 'test message'
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    res = request(
      'POST',
      `${url}:${port}/message/pin/v1`,
      {
        json: {
          messageId: FakeMessageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(400);
  }); */
  /*
  test('a channel message is already pinned', () => {
    res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: channel0.channelId,
          message: 'dasdwa'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    message0 = JSON.parse(res.getBody() as string);
    const data = getData();
    data.channels[0].messages[0].isPinned = true;
    res = request(
      'POST',
      `${url}:${port}/message/pin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(400);
  }); */
  /*
  test('a dm message is already pinned', () => {
    res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,
      {
        json: {
          dmId: dm0.dmId,
          message: 'test message'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    message0 = JSON.parse(res.getBody() as string);

    const data = getData();
    data.dms[0].message[0].isPinned = true;
    res = request(
      'POST',
      `${url}:${port}/message/pin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(400);
  }); */
  /*
  test('user does not have channel owner permissions', () => {
    res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: channel0.channelId,
          message: 'dasdwa'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    message0 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'test@unsw.com',
          password: 'password123',
          nameFirst: 'nameFirst',
          nameLast: 'nameLast'
        }
      }
    );

    const auth1 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/channel/join/v3`,
      {
        json: {
          channelId: channel0.channelId
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    res = request(
      'POST',
      `${url}:${port}/message/pin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth1.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(403);
  }); */
  /*
  test('successfully channel message pinned', () => {
    res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: channel0.channelId,
          message: 'dasdwa'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    message0 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/message/pin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(200);
    const data = getData();
    expect(data.channels[0].messages[0].isPinned).toStrictEqual(true);
  }); */
/*
  test('successfully dm message pinned', () => {
    res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,
      {
        json: {
          dmId: dm0.dmId,
          message: 'test message'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    message0 = JSON.parse(res.getBody() as string);
    res = request(
      'POST',
      `${url}:${port}/message/pin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(200);
    const data = getData();
    expect(data.dms[0].message[0].isPinned).toStrictEqual(true);
  }); */
});

describe('/message/unpin/v1', () => {
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );
  /*
  let auth0: any;
  let res: any;
  let channel0: any;
  let dm0: any;
  let message0: any;
  beforeEach(() => {
    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'test@unsw.com',
          password: 'password123',
          nameFirst: 'nameFirst',
          nameLast: 'nameLast'
        }
      }
    );
    auth0 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/channels/create/v3`,
      {
        json: {
          name: 'channel0',
          isPublic: true
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    channel0 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [auth0.authUserId],
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    dm0 = JSON.parse(res.getBody() as string);
  }); */
  /*
  test('invalid messageId for a channel message', () => {
    const FakeMessageId = 909;

    res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: channel0.channelId,
          message: 'dasdwa'
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    res = request(
      'POST',
      `${url}:${port}/message/unpin/v1`,
      {
        json: {
          messageId: FakeMessageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(400);
  });

  test('invalid messageId for a dm message', () => {
    const FakeMessageId = 909;
    res = request(
      'POST',
      `${url}:${port}/message/senddm/v1`,
      {
        json: {
          dmId: dm0.dmId,
          message: 'test message'
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    res = request(
      'POST',
      `${url}:${port}/message/unpin/v1`,
      {
        json: {
          messageId: FakeMessageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(400);
  }); */
  /*
  test('a channel message is already unpinned', () => {
    res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: channel0.channelId,
          message: 'dasdwa'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    message0 = JSON.parse(res.getBody() as string);
    const data = getData();
    data.channels[0].messages[0].isPinned = false;
    res = request(
      'POST',
      `${url}:${port}/message/unpin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(400);
  }); */
  /*
  test('a dm message is already unpinned', () => {
    res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,
      {
        json: {
          dmId: dm0.dmId,
          message: 'test message'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    message0 = JSON.parse(res.getBody() as string);

    const data = getData();
    data.dms[0].message[0].isPinned = false;
    res = request(
      'POST',
      `${url}:${port}/message/unpin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(400);
  }); */
  /*
  test('user does not have channel owner permissions', () => {
    res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          channelId: channel0.channelId,
          message: 'dasdwa'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    message0 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'test@unsw.com',
          password: 'password123',
          nameFirst: 'nameFirst',
          nameLast: 'nameLast'
        }
      }
    );

    const auth1 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/channel/join/v3`,
      {
        json: {
          channelId: channel0.channelId
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    res = request(
      'POST',
      `${url}:${port}/message/pin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const pinning = JSON.parse(res.getBody() as string);
    expect(pinning.statusCode).toStrictEqual(200);

    res = request(
      'POST',
      `${url}:${port}/message/unpin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth1.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(403);
  }); */
  /*
  test('successfully channel message pinned', () => {
    res = request(
      'POST',
      `${url}:${port}/message/send/v2`,
      {
        json: {
          token: auth0.token,
          channelId: channel0.channelId,
          message: 'dasdwa'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    message0 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/message/pin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const pinning = JSON.parse(res.getBody() as string);
    expect(pinning.statusCode).toStrictEqual(200);

    res = request(
      'POST',
      `${url}:${port}/message/unpin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(200);
    const data = getData();
    expect(data.channels[0].messages[0].isPinned).toStrictEqual(false);
  }); */
/*
  test('successfully dm message pinned', () => {
    res = request(
      'POST',
      `${url}:${port}/message/senddm/v2`,
      {
        json: {
          dmId: dm0.dmId,
          message: 'test message'
        },
        headers: {
          token: auth0.token,
        }
      }
    );
    message0 = JSON.parse(res.getBody() as string);
    res = request(
      'POST',
      `${url}:${port}/message/pin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const pinning = JSON.parse(res.getBody() as string);
    expect(pinning.statusCode).toStrictEqual(200);

    res = request(
      'POST',
      `${url}:${port}/message/unpin/v1`,
      {
        json: {
          messageId: message0.messageId,
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody() as string);

    expect(parsed.statusCode).toStrictEqual(200);
    const data = getData();
    expect(data.dms[0].message[0].isPinned).toStrictEqual(false);
  }); */
});

describe('/message/sendlater/v1', () => {
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );

  let auth0: any;
  let res: any;
  let channel0: any;
  beforeEach(() => {
    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'test@unsw.com',
          password: 'password123',
          nameFirst: 'nameFirst',
          nameLast: 'nameLast'
        }
      }
    );
    auth0 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/channels/create/v3`,
      {
        json: {
          name: 'channel0',
          isPublic: true
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    channel0 = JSON.parse(res.getBody() as string);
  });

  test('invalid channelId', async () => {
    const fakeChannelId = 909;

    res = request(
      'POST',
      `${url}:${port}/message/sendlater/v1`,
      {
        json: {
          channelId: fakeChannelId,
          message: 'Hello, testing!',
          timeSent: 2000
        },
        headers: {
          token: auth0.token
        }
      }
    );

    await new Promise((r) => setTimeout(r, 2000));

    expect(res.statusCode).toStrictEqual(400);
  });

  test('length of message is < 1 character', async () => {
    res = request(
      'POST',
      `${url}:${port}/message/sendlater/v1`,
      {
        json: {
          channelId: channel0.channelId,
          message: '',
          timeSent: 2000
        },
        headers: {
          token: auth0.token
        }
      }
    );

    await new Promise((r) => setTimeout(r, 2000));

    expect(res.statusCode).toStrictEqual(400);
  });

  test('length of message is > 1000 characters', async () => {
    const oneThousandCharacters = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus lacus, ornare ut congue a, blandit nec diam. Nulla facilisi. Maecenas mattis mauris quam, sit amet venenatis mi rhoncus eu. Quisque euismod iaculis sem sed porta. Sed est leo, lobortis id leo at, interdum lobortis nisl. Morbi et diam viverra quam tristique lacinia. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin mauris nunc, vulputate ut maximus ut, consequat ut mauris. Vivamus quis laoreet neque. Praesent ac quam sed magna vulputate pretium eu vitae mi. Sed consequat libero urna, interdum ultrices erat iaculis et. Donec molestie tincidunt egestas. Aliquam quam dolor, consequat ac dignissim quis, imperdiet sed sapien. Donec eget justo eget ipsum tempus mollis ac at mi. Aliquam ullamcorper tempor auctor. Curabitur quis sapien sit amet turpis pellentesque cursus. \n Pellentesque nec nunc fermentum, sollicitudin quam faucibus, tempor ex. Ut sodales nibh nisi, sed eleifend magna viverra at porttitor.';
    res = request(
      'POST',
      `${url}:${port}/message/sendlater/v1`,
      {
        json: {
          channelId: channel0.channelId,
          message: oneThousandCharacters,
          timeSent: 2000
        },
        headers: {
          token: auth0.token
        }
      }
    );

    await new Promise((r) => setTimeout(r, 2000));

    expect(res.statusCode).toStrictEqual(400);
  });
  /*
  test('timeSent is a time in the past (invalid)', async () => {
    res = request(
      'POST',
      `${url}:${port}/message/sendlater/v1`,
      {
        json: {
          channelId: channel0.channelId,
          message: 'Hi how are ya',
          timeSent: 2000
        },
        headers: {
          token: auth0.token
        }
      }
    );

    await new Promise((r) => setTimeout(r, 2000));

    expect(res.statusCode).toStrictEqual(400);
  }); */

  test('authuser is not a member of the channel', async () => {
    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'test2@unsw.com',
          password: 'password',
          nameFirst: 'nameFirst',
          nameLast: 'nameLast'
        }
      }
    );

    const auth1 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/message/sendlater/v1`,
      {
        json: {
          channelId: channel0.channelId,
          message: 'hellow world',
          timeSent: 2000
        },
        headers: {
          token: auth1.token
        }
      }
    );

    await new Promise((r) => setTimeout(r, 2000));

    expect(res.statusCode).toStrictEqual(403);
  });

  test('successful', async () => {
    res = request(
      'POST',
      `${url}:${port}/message/sendlater/v1`,
      {
        json: {
          channelId: channel0.channelId,
          message: 'hellow world',
          timeSent: 2000
        },
        headers: {
          token: auth0.token
        }
      }
    );

    await new Promise((r) => setTimeout(r, 3000));
    expect(res.statusCode).toStrictEqual(200);
  });
});

describe('/message/sendlaterdm/v1', () => {
  request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );

  let auth0: any;
  let res: any;
  let dm0: any;
  beforeEach(() => {
    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'test@unsw.com',
          password: 'password123',
          nameFirst: 'nameFirst',
          nameLast: 'nameLast'
        }
      }
    );
    auth0 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/dm/create/v2`,

      {
        json: {
          uIds: [auth0.authUserId],
        },
        headers: {
          token: auth0.token,
        }
      }
    );

    dm0 = JSON.parse(res.getBody() as string);
  });

  test('invalid dmId', async () => {
    const fakedmId = 909;

    res = request(
      'POST',
      `${url}:${port}/message/sendlaterdm/v1`,
      {
        json: {
          dmId: fakedmId,
          message: 'Hello, testing!',
          timeSent: 2000
        },
        headers: {
          token: auth0.token
        }
      }
    );

    await new Promise((r) => setTimeout(r, 2000));

    expect(res.statusCode).toStrictEqual(400);
  });

  test('length of message is < 1 character', async () => {
    res = request(
      'POST',
      `${url}:${port}/message/sendlaterdm/v1`,
      {
        json: {
          dmId: dm0.dmId,
          message: '',
          timeSent: 2000
        },
        headers: {
          token: auth0.token
        }
      }
    );

    await new Promise((r) => setTimeout(r, 2000));

    expect(res.statusCode).toStrictEqual(400);
  });

  test('length of message is > 1000 characters', async () => {
    const oneThousandCharacters = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus lacus, ornare ut congue a, blandit nec diam. Nulla facilisi. Maecenas mattis mauris quam, sit amet venenatis mi rhoncus eu. Quisque euismod iaculis sem sed porta. Sed est leo, lobortis id leo at, interdum lobortis nisl. Morbi et diam viverra quam tristique lacinia. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin mauris nunc, vulputate ut maximus ut, consequat ut mauris. Vivamus quis laoreet neque. Praesent ac quam sed magna vulputate pretium eu vitae mi. Sed consequat libero urna, interdum ultrices erat iaculis et. Donec molestie tincidunt egestas. Aliquam quam dolor, consequat ac dignissim quis, imperdiet sed sapien. Donec eget justo eget ipsum tempus mollis ac at mi. Aliquam ullamcorper tempor auctor. Curabitur quis sapien sit amet turpis pellentesque cursus. \n Pellentesque nec nunc fermentum, sollicitudin quam faucibus, tempor ex. Ut sodales nibh nisi, sed eleifend magna viverra at porttitor.';
    res = request(
      'POST',
      `${url}:${port}/message/sendlaterdm/v1`,
      {
        json: {
          dmId: dm0.dmId,
          message: oneThousandCharacters,
          timeSent: 2000
        },
        headers: {
          token: auth0.token
        }
      }
    );

    await new Promise((r) => setTimeout(r, 2000));

    expect(res.statusCode).toStrictEqual(400);
  });
  /*
  test('timeSent is a time in the past (invalid)', async () => {
    res = request(
      'POST',
      `${url}:${port}/message/sendlaterdm/v1`,
      {
        json: {
          dmId: dm0.dmId,
          message: 'Hi how are ya',
          timeSent: 5000
        },
        headers: {
          token: auth0.token
        }
      }
    );

    await new Promise((r) => setTimeout(r, 2000));

    expect(res.statusCode).toStrictEqual(400);
  }); */

  test('authuser is not a member of the dm', async () => {
    res = request(
      'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'test1@unsw.com',
          password: 'password',
          nameFirst: 'nameFirst',
          nameLast: 'nameLast'
        }
      }
    );

    const auth1 = JSON.parse(res.getBody() as string);

    res = request(
      'POST',
      `${url}:${port}/message/sendlaterdm/v1`,
      {
        json: {
          dmId: dm0.dmId,
          message: 'Hi how are ya',
          timeSent: 2000
        },
        headers: {
          token: auth1.token
        }
      }
    );

    await new Promise((r) => setTimeout(r, 2000));

    expect(res.statusCode).toStrictEqual(403);
  });

  test('successful', async () => {
    res = request(
      'POST',
      `${url}:${port}/message/sendlaterdm/v1`,
      {
        json: {
          dmId: dm0.dmId,
          message: 'hellow world',
          timeSent: 2000
        },
        headers: {
          token: auth0.token
        }
      }
    );

    await new Promise((r) => setTimeout(r, 2000));

    expect(res.statusCode).toStrictEqual(200);
  });
});
