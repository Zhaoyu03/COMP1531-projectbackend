import { userProfileV3 } from './users';
import { authRegisterV3 } from './auth';
import { clearV1 } from './other';
import { url, port } from './config.json';
const request = require('sync-request');

beforeEach(() => {
  clearV1();
});
afterEach(() => {
  clearV1();
});

describe('UserProfileV2Tests', () => {
  test('Testing the correct existing authUserId and Nonexistent Uid', () => {
    // Views user profile
    const profile = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: 1
        },
        headers: {
          token: 2
        }
      }
    );
    expect(profile.statusCode).toBe(400);
  });
  test('Testing the incorrect authUserId and Uid ', () => {
    // Views user profile
    const profile = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: 1
        },
        headers: {
          token: 0
        }
      }
    );
    expect(profile.statusCode).toBe(400);
  });
  test('Testing the correct existing authUserId and empty uId', () => {
    // Views user profile
    const profile = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: 1
        },
        headers: {
          token: 3023
        }
      }
    );
    expect(profile.statusCode).toBe(400);
  });

  test('Testing the wrong authUserId and existing Uid ,test 1', () => {
    // Views user profile
    const profile = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: 2
        },
        headers: {
          token: 2000
        }
      }
    );
    expect(profile.statusCode).toBe(400);
  });
  test('Testing the valid user return', () => {
    const user1:any = authRegisterV3('123@qw.com', '123456', 'nameFirst', 'nameLast');
    const profile = userProfileV3(user1.token, user1.authUserId);
    expect(profile).toStrictEqual({
      user: {
        uId: 0,
        email: '123@qw.com',
        nameFirst: 'nameFirst',
        nameLast: 'nameLast',
        handleStr: 'nameFirstnameLast',
        profileImgUrl: 'http://127.0.0.1:19322/resources/default.jpg'
      }
    });
  });
});
