const request = require('sync-request');
import { url, port } from './config.json';
import { clearV1 } from './other';
import { authRegisterV3 } from './auth';
import { channelsCreateV3 } from './channels';

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

describe('channel/leave/v1', () => {
  test('invalid channel, valid token', () => {
    const invalidChannel = 4;
    const authUser: any = authRegisterV3('james@unsw.com', 'password123', 'James', 'Comninos');
    const res = request(
      'POST',
        `${url}:${port}/channel/leave/v2`,
        {
          json: {
            channelId: invalidChannel
          },
          headers: {
            token: authUser.token,
          }
        }
    );
    const parsed = JSON.parse(res.getBody('utf-8'));

    expect(parsed).toStrictEqual({ error: 'error' });
  });

  test('valid channel, not a member', () => {
    const authUser: any = authRegisterV3('james@unsw.com', 'password123', 'James', 'Comninos');
    const validChannel: any = channelsCreateV3(authUser.token, 'AEROPUBLIC', true);
    const nonMember: any = authRegisterV3('nadav@unsw.com', 'password54321', 'Nadav', 'Dar');
    const res = request(
      'POST',
        `${url}:${port}/channel/leave/v2`,
        {
          json: {
            channelId: validChannel.channelId
          },
          headers: {
            token: nonMember.token,
          }
        }
    );

    const parsed = JSON.parse(res.getBody('utf-8'));

    expect(parsed).toStrictEqual({ error: 'error' });
  });
});

describe('channel/addowner/v1', () => {
  test('non valid channel', () => {
    const invalidChannel = 4;
    const authUser: any = authRegisterV3('james@unsw.com', 'password123', 'James', 'Comninos');
    const uId: any = authRegisterV3('Nadav@unsw.com', 'password54321', 'Nadav', 'Dar');
    const res = request(
      'POST',
      `${url}:${port}/channel/addowner/v2`,
      {
        json: {
          channelId: invalidChannel,
          uId: uId.authUserId
        },
        headers: {
          token: authUser.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody('utf-8'));
    expect(parsed).toStrictEqual({ error: 'error' });
  });

  test('non valid user', () => {
    const authUser: any = authRegisterV3('james@unsw.com', 'password123', 'James', 'Comninos');
    const validChannel: any = channelsCreateV3(authUser.token, 'AEROPUBLIC', true);
    const uId = 4;
    const res = request(
      'POST',
      `${url}:${port}/channel/addowner/v2`,
      {
        json: {
          channelId: validChannel.channelId,
          uId: uId
        },
        headers: {
          token: authUser.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody('utf-8'));
    expect(parsed).toStrictEqual({ error: 'error' });
  });

  test('user is not a member', () => {
    const authUser: any = authRegisterV3('james@unsw.com', 'password123', 'James', 'Comninos');
    const validChannel: any = channelsCreateV3(authUser.token, 'AEROPUBLIC', true);
    const uId: any = authRegisterV3('nadav@unsw.com', 'password54321', 'Nadav', 'Dar');
    const res = request(
      'POST',
      `${url}:${port}/channel/addowner/v2`,
      {
        json: {
          channelId: validChannel.channelId,
          uId: uId.authUserId
        },
        headers: {
          token: authUser.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody('utf-8'));
    expect(parsed).toStrictEqual({ error: 'error' });
  });

  test('user is already an owner', () => {
    const authUser: any = authRegisterV3('james@unsw.com', 'password123', 'James', 'Comninos');
    const validChannel: any = channelsCreateV3(authUser.token, 'AEROPUBLIC', true);
    const res = request(
      'POST',
      `${url}:${port}/channel/addowner/v2`,
      {
        json: {
          channelId: validChannel.channelId,
          uId: authUser.authUserId
        },
        headers: {
          token: authUser.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody('utf-8'));
    expect(parsed).toStrictEqual({ error: 'error' });
  });

  test('user is not a member', () => {
    const authUser: any = authRegisterV3('james@unsw.com', 'password123', 'James', 'Comninos');
    const validChannel: any = channelsCreateV3(authUser.token, 'AEROPUBLIC', true);
    const uId1: any = authRegisterV3('nadav@unsw.com', 'password54321', 'Nadav', 'Dar');
    const uId2: any = authRegisterV3('Dusan@unsw.com', 'mypassword', 'Dusan', 'Stankovic');
    const res = request(
      'POST',
      `${url}:${port}/channel/addowner/v2`,
      {
        json: {
          channelId: validChannel.channelId,
          uId: uId2.authUserId
        },
        headers: {
          token: uId1.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody('utf-8'));
    expect(parsed).toStrictEqual({ error: 'error' });
  });
});

describe('channel/removeowner/v1', () => {
  test('non valid channel', () => {
    const invalidChannel = 4;
    const authUser: any = authRegisterV3('james@unsw.com', 'password123', 'James', 'Comninos');
    const uId: any = authRegisterV3('Nadav@unsw.com', 'password54321', 'Nadav', 'Dar');
    const res = request(
      'POST',
      `${url}:${port}/channel/removeowner/v2`,
      {
        json: {
          channelId: invalidChannel,
          uId: uId.authUserId
        },
        headers: {
          token: authUser.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody('utf-8'));
    expect(parsed).toStrictEqual({ error: 'error' });
  });

  test('non valid user', () => {
    const authUser: any = authRegisterV3('james@unsw.com', 'password123', 'James', 'Comninos');
    const validChannel: any = channelsCreateV3(authUser.token, 'AEROPUBLIC', true);
    const uId = 4;
    const res = request(
      'POST',
      `${url}:${port}/channel/removeowner/v2`,
      {
        json: {
          channelId: validChannel.channelId,
          uId: uId
        },
        headers: {
          token: authUser.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody('utf-8'));
    expect(parsed).toStrictEqual({ error: 'error' });
  });

  test('user is not a member', () => {
    const authUser: any = authRegisterV3('james@unsw.com', 'password123', 'James', 'Comninos');
    const validChannel: any = channelsCreateV3(authUser.token, 'AEROPUBLIC', true);
    const uId: any = authRegisterV3('nadav@unsw.com', 'password54321', 'Nadav', 'Dar');
    const res = request(
      'POST',
      `${url}:${port}/channel/removeowner/v2`,
      {
        json: {
          channelId: validChannel.channelId,
          uId: uId.authUserId
        },
        headers: {
          token: authUser.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody('utf-8'));
    expect(parsed).toStrictEqual({ error: 'error' });
  });

  test('user is already an owner', () => {
    const authUser: any = authRegisterV3('james@unsw.com', 'password123', 'James', 'Comninos');
    const validChannel: any = channelsCreateV3(authUser.token, 'AEROPUBLIC', true);
    const res = request(
      'POST',
      `${url}:${port}/channel/removeowner/v2`,
      {
        json: {
          channelId: validChannel.channelId,
          uId: authUser.authUserId
        },
        headers: {
          token: authUser.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody('utf-8'));
    expect(parsed).toStrictEqual({ error: 'error' });
  });

  test('user has no owner permissions', () => {
    const authUser: any = authRegisterV3('james@unsw.com', 'password123', 'James', 'Comninos');
    const validChannel: any = channelsCreateV3(authUser.token, 'AEROPUBLIC', true);
    const uId1: any = authRegisterV3('nadav@unsw.com', 'password54321', 'Nadav', 'Dar');
    const uId2: any = authRegisterV3('Dusan@unsw.com', 'mypassword', 'Dusan', 'Stankovic');
    const res = request(
      'POST',
      `${url}:${port}/channel/removeowner/v2`,
      {
        json: {
          channelId: validChannel.channelId,
          uId: uId2.authUserId
        },
        headers: {
          token: uId1.token,
        }
      }
    );

    const parsed = JSON.parse(res.getBody('utf-8'));
    expect(parsed).toStrictEqual({ error: 'error' });
  });
});
