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

describe('usersAllV2', () => {
  test('usersAll Works', () => {
    // Creates Valid User
    const validAuthUser = request(
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

    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);

    const validUser = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs:
        {
          uId: validAuthUserJSON.authUserId
        },
        headers:
        {
          token: validAuthUserJSON.token
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);
    const res = request(
      'GET',
      `${url}:${port}/users/all/v2`,

      {
        qs: {},
        headers: {
          token: validAuthUserJSON.token
        }
      }
    );

    const data = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    const users = {
      users: [
        {
          uId: validUserJSON.user.uId,
          email: validUserJSON.user.email,
          nameFirst: validUserJSON.user.nameFirst,
          nameLast: validUserJSON.user.nameLast,
          handleStr: validUserJSON.user.handleStr
        }
      ]
    };

    expect(data).toStrictEqual(users);
  });
  test('usersAll invalid Token', () => {
    const invalidToken = 'sdfjdhjfk';
    const res = request(
      'GET',
      `${url}:${port}/users/all/v2`,

      {
        qs: {},
        headers: {
          token: invalidToken
        }
      }
    );
    expect(res.statusCode).toBe(403);
  });
});

// ***************** ITE3 TESTS *****************

describe('admin/userpermission/change/v1', () => {
  test('admin/userpermission/change/v1 Works', () => {
    // Creates Valid User
    const validAuthUser = request(
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

    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);
    const validUser = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs: {
          uId: validAuthUserJSON.authUserId
        },
        headers: {
          token: validAuthUserJSON.token
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);
    const res = request(
      'POST',
      `${url}:${port}/admin/userpermission/change/v1`,
      {
        json: {
          uId: validUserJSON.user.uId,
          permissionId: 2
        },
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual({});
  });

  test('admin/userpermission/change/v1 invalid uId', () => {
    // Creates Valid User
    const validAuthUser = request(
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

    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);
    const invaliduId = 22222;
    const res = request(
      'POST',
      `${url}:${port}/admin/userpermission/change/v1`,
      {
        json: {
          uId: invaliduId,
          permissionId: 2
        },
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    expect(res.statusCode).toBe(400);
  });

  test('admin/userpermission/change/v1 invalid PermId', () => {
    // Creates Valid User
    const validAuthUser = request(
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

    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);

    const validUser = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs: {
          uId: validAuthUserJSON.authUserId
        },
        headers: {
          token: validAuthUserJSON.token
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);
    const invalidPermId = 5646;
    const res = request(
      'POST',
      `${url}:${port}/admin/userpermission/change/v1`,
      {
        json: {
          uId: validUserJSON.user.uId,
          permissionId: invalidPermId
        },
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    expect(res.statusCode).toBe(400);
  });

  test('admin/userpermission/change/v1 user has the same perms as permId', () => {
    // Creates Valid User
    const validAuthUser = request(
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

    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);

    const validUser = request(
      'GET',
      `${url}:${port}/user/profile/v3`,
      {
        qs: {
          uId: validAuthUserJSON.authUserId
        },
        headers: {
          token: validAuthUserJSON.token
        }
      }
    );

    const validUserJSON = JSON.parse(validUser.getBody() as string);

    const res = request(
      'POST',
      `${url}:${port}/admin/userpermission/change/v1`,
      {
        json: {
          uId: validUserJSON.user.uId,
          permissionId: 1
        },
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    expect(res.statusCode).toBe(400);
  });

  test('admin/userpermission/change/v1 User not global owner', () => {
    // Creates Valid Global User
    request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan1@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    // Creates Valid User (not global user)
    const notGlobalUser = request(
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

    const notGlobalUserJSON = JSON.parse(notGlobalUser.getBody() as string);
    const res = request(
      'POST',
      `${url}:${port}/admin/userpermission/change/v1`,
      {
        json: {
          uId: notGlobalUserJSON.authUserId,
          permissionId: 2
        },
        headers: {
          token: notGlobalUserJSON.token,
        }
      }
    );
    expect(res.statusCode).toBe(403);
  });
  // test uId refers to only global owner and that they are being demoted
});

describe('user/profile/uploadphoto/v1', () => {
  // test('user/profile/uploadphoto/v1 works', () => {
  //   // Creates Valid User
  //   const validAuthUser = request(
  //     'POST',
  //     `${url}:${port}/auth/register/v3`,

  //     {
  //       json: {
  //         email: 'dusan1@unsw.com.au',
  //         password: 'TestPassword01',
  //         nameFirst: 'Dusan',
  //         nameLast: 'Stankovic'
  //       }
  //     }
  //   );
  //   const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);

  //   const res = request(
  //     'POST',
  //     `${url}:${port}/user/profile/uploadphoto/v1`,
  //     {
  //       json: {
  //         imgUrl: `${url}:${port}/resources/default.jpg`,
  //         xStart: 0,
  //         yStart: 0,
  //         xEnd: 10,
  //         yEnd: 10
  //       },
  //       headers: {
  //         token: validAuthUserJSON.token,
  //       }
  //     }
  //   );
  //   const data = JSON.parse(res.getBody() as string);

  //   const userProfile = request(
  //     'GET',
  //     `${url}:${port}/user/profile/v3`,
  //     {
  //       qs:
  //       {
  //         uId: validAuthUserJSON.authUserId
  //       },
  //       headers:
  //       {
  //         token: validAuthUserJSON.token,
  //       }
  //     }
  //   );
  //   const userProfileJSON = JSON.parse(userProfile.getBody() as string);
  //   expect(userProfileJSON.profileImgUrl).toStrictEqual(`${url}:${port}/resources/default.jpg`);
  //   expect(res.statusCode).toBe(OK);
  //   expect(data).toStrictEqual({});
  // });

  test('user/profile/uploadphoto/v1 xStart too big', () => {
    // Creates Valid User
    const validAuthUser = request(
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
    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);

    const res = request(
      'POST',
      `${url}:${port}/user/profile/uploadphoto/v1`,
      {
        json: {
          imgUrl: '/t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg',
          xStart: 160,
          yStart: 0,
          xEnd: 150,
          yEnd: 150
        },
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    expect(res.statusCode).toBe(400);
  });

  test('user/profile/uploadphoto/v1 xEnd too big', () => {
    // Creates Valid User
    const validAuthUser = request(
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
    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);

    const res = request(
      'POST',
      `${url}:${port}/user/profile/uploadphoto/v1`,
      {
        json: {
          imgUrl: '/t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg',
          xStart: 0,
          yStart: 0,
          xEnd: 600,
          yEnd: 150
        },
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    expect(res.statusCode).toBe(400);
  });

  test('user/profile/uploadphoto/v1 yStart too big', () => {
    // Creates Valid User
    const validAuthUser = request(
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
    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);

    const res = request(
      'POST',
      `${url}:${port}/user/profile/uploadphoto/v1`,
      {
        json: {
          imgUrl: '/t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg',
          xStart: 0,
          yStart: 300,
          xEnd: 150,
          yEnd: 150
        },
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    expect(res.statusCode).toBe(400);
  });

  test('user/profile/uploadphoto/v1 yEnd too big', () => {
    // Creates Valid User
    const validAuthUser = request(
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
    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);

    const res = request(
      'POST',
      `${url}:${port}/user/profile/uploadphoto/v1`,
      {
        json: {
          imgUrl: '/t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg',
          xStart: 0,
          yStart: 0,
          xEnd: 150,
          yEnd: 600
        },
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    expect(res.statusCode).toBe(400);
  });

  test('user/profile/uploadphoto/v1 xEnd < yStart', () => {
    // Creates Valid User
    const validAuthUser = request(
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
    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);

    const res = request(
      'POST',
      `${url}:${port}/user/profile/uploadphoto/v1`,
      {
        json: {
          imgUrl: '/t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg',
          xStart: 210,
          yStart: 0,
          xEnd: 200,
          yEnd: 150
        },
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    expect(res.statusCode).toBe(400);
  });

  test('user/profile/uploadphoto/v1 yEnd < yStart', () => {
    // Creates Valid User
    const validAuthUser = request(
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
    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);

    const res = request(
      'POST',
      `${url}:${port}/user/profile/uploadphoto/v1`,
      {
        json: {
          imgUrl: '/t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg',
          xStart: 0,
          yStart: 200,
          xEnd: 150,
          yEnd: 150
        },
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    expect(res.statusCode).toBe(400);
  });
});

describe('admin/user/remove/v1', () => {
  // test('admin/user/remove/v1 works', () => {
  //   // Creates Valid Global User
  //   const globalOwner = request(
  //     'POST',
  //     `${url}:${port}/auth/register/v3`,

  //     {
  //       json: {
  //         email: 'dusan@unsw.com.au',
  //         password: 'TestPassword01',
  //         nameFirst: 'Dusan',
  //         nameLast: 'Stankovic'
  //       }
  //     }
  //   );
  //   const globalOwnerJSON = JSON.parse(globalOwner.getBody() as string);

  //   // Creates Valid User
  //   const deleteUser = request(
  //     'POST',
  //     `${url}:${port}/auth/register/v3`,

  //     {
  //       json: {
  //         email: 'dusan12@unsw.com.au',
  //         password: 'TestPassword01',
  //         nameFirst: 'Dusan',
  //         nameLast: 'Stankovic'
  //       }
  //     }
  //   );
  //   const deleteUserJSON = JSON.parse(deleteUser.getBody() as string);

  //   // removes user
  //   const testDelete = request(
  //     'DELETE',
  //     `${url}:${port}/admin/user/remove/v1`,
  //     {
  //       qs: {
  //         uId: deleteUserJSON.authUserId
  //       },
  //       headers: {
  //         token: globalOwnerJSON.token,
  //       }
  //     }
  //   );
  //   expect(testDelete.statusCode).toBe(OK);
  // });

  test('admin/user/remove/v1 invalid uId', () => {
    // Creates Valid Global User
    const globalOwner = request(
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
    const globalOwnerJSON = JSON.parse(globalOwner.getBody() as string);
    const invalidUid = 123;
    const testDelete = request(
      'DELETE',
      `${url}:${port}/admin/user/remove/v1`,
      {
        qs: {
          uId: invalidUid
        },
        headers: {
          token: globalOwnerJSON.token,
        }
      }
    );
    expect(testDelete.statusCode).toBe(400);
  });

  test('admin/user/remove/v1 authUser is not global owner', () => {
    // Creates Valid Global User
    const globalOwner = request(
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
    const globalOwnerJSON = JSON.parse(globalOwner.getBody() as string);

    // Creates Valid Global User
    const validAuthUser = request(
      'POST',
      `${url}:${port}/auth/register/v3`,

      {
        json: {
          email: 'dusan12@unsw.com.au',
          password: 'TestPassword01',
          nameFirst: 'Dusan',
          nameLast: 'Stankovic'
        }
      }
    );

    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);
    const testDelete = request(
      'DELETE',
      `${url}:${port}/admin/user/remove/v1`,
      {
        qs: {
          uId: globalOwnerJSON.uId
        },
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    expect(testDelete.statusCode).toBe(403);
  });
});

describe('user/stats/v1', () => {
  test('user/stats/v1 works', () => {
    // Creates Valid User
    const validAuthUser = request(
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
    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);

    // Creates valid channel
    const channelCreate = request(
      'POST',
      `${url}:${port}/channels/create/v3`,
      {
        json: {
          name: 'test',
          isPublic: true
        },
        headers: {
          token: validAuthUserJSON.token
        }
      }
    );
    const channelCreateJSON = JSON.parse(channelCreate.getBody() as string);

    // joins valid channel
    request(
      'POST',
      `${url}:${port}/channel/join/v3`,
      {
        json: {
          channelId: channelCreateJSON.channelId
        },
        headers: {
          token: validAuthUserJSON.token
        }
      }
    );

    const res = request(
      'GET',
      `${url}:${port}/user/stats/v1`,
      {
        qs: {},
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    const data = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual({
      userStats: {
        channelsJoined: [{
          numChannelsJoined: 1,
          timeStamp: expect.any(Number)
        }],
        dmsJoined: [],
        messagesSent: [],
        involvementRate: 1
      }
    });
  });
});

describe('users/stats/v1', () => {
  test('users/stats/v1 works', () => {
    // Creates Valid User
    const validAuthUser = request(
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
    const validAuthUserJSON = JSON.parse(validAuthUser.getBody() as string);

    // Creates valid channel
    const channelCreate = request(
      'POST',
      `${url}:${port}/channels/create/v3`,
      {
        json: {
          name: 'test',
          isPublic: true
        },
        headers: {
          token: validAuthUserJSON.token
        }
      }
    );
    const channelCreateJSON = JSON.parse(channelCreate.getBody() as string);

    // joins valid channel
    request(
      'POST',
      `${url}:${port}/channel/join/v3`,
      {
        json: {
          channelId: channelCreateJSON.channelId
        },
        headers: {
          token: validAuthUserJSON.token
        }
      }
    );

    const res = request(
      'GET',
      `${url}:${port}/users/stats/v1`,
      {
        qs: {},
        headers: {
          token: validAuthUserJSON.token,
        }
      }
    );
    const data = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual({
      workspaceStats: {
        channelsExist: [{
          numChannelsExist: 1,
          timeStamp: expect.any(Number)
        }],
        dmsExist: [],
        messagesExist: [],
        utilizationRate: 1
      }
    });
  });
});
