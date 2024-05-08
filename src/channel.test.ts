import { channelDetailsV3, channelJoinV3 } from './channel';
import { getData } from './dataStore';
import { clearV1 } from './other';
import { authRegisterV3 } from './auth';
import { channelsCreateV3 } from './channels';
import { channelInviteV3, channelMessagesV3 } from './channel';
import { createToken } from './token';

const ERROR = { error: 'error' };

const oldData = getData();

afterEach(() => {
  clearV1();
});

describe('channelDetailsV2Tests', () => {
  test('Testing invalid token, valid channel', () => {
    const invalidToken = createToken();
    const validUser: any = authRegisterV3('nadavdar@unsw.com', 'password123', 'Nadav', 'Dar');
    const validChannel: any = channelsCreateV3(validUser.token, 'AEROPrivate', false);
    expect(channelDetailsV3(invalidToken, validChannel.channelId)).toEqual(ERROR);
  });

  test('Testing valid AuthUser, invalid channel', () => {
    const validUser: any = authRegisterV3('nadavdar@unsw.com', 'password123', 'Nadav', 'Dar');
    const invalidChannel: any = 2;
    expect(channelDetailsV3(validUser.token, invalidChannel)).toEqual(ERROR);
  });

  test('Testing valid AuthUserId except not a member', () => {
    const validUser: any = authRegisterV3('nadavdar@unsw.com', 'password123', 'Nadav', 'Dar');
    const validChannel: any = channelsCreateV3(validUser.token, 'AEROPrivate', false);
    const NonMember: any = authRegisterV3('nadavdar@unsw.com', 'password123', 'Nadav', 'Dar');
    expect(channelDetailsV3(NonMember.token, validChannel.channelId)).toEqual(ERROR);
  });

  test('Testing empty users object in dataStore', () => {
    const validUser: any = authRegisterV3('nadavdar@unsw.com', 'password123', 'Nadav', 'Dar');
    const validChannel: any = channelsCreateV3(validUser.token, 'AEROPrivate', false);
    const randomToken = createToken();
    oldData.users = [];
    expect(channelDetailsV3(randomToken, validChannel.channelId)).toEqual(ERROR);
  });

  test('Testing empty channels object in dataStore', () => {
    const validUser: any = authRegisterV3('nadavdar@unsw.com', 'password123', 'Nadav', 'Dar');
    const channelId = 1;
    oldData.channels = [];
    expect(channelDetailsV3(validUser.token, channelId)).toEqual(ERROR);
  });
});

describe('channelJoinV2Tests', () => {
  test('Testing invalid channelId', () => {
    const invalidChannel = 3;
    const validUser: any = authRegisterV3('nadavdar@unsw.com', 'password123', 'Nadav', 'Dar');
    expect(channelJoinV3(validUser.token, invalidChannel)).toEqual(ERROR);
  });

  test('Testing invalid authUserId', () => {
    const validUser: any = authRegisterV3('nadavdar@unsw.com', 'password123', 'Nadav', 'Dar');
    const validChannel: any = channelsCreateV3(validUser.token, 'AEROPrivate', false);
    const invalidToken = createToken();
    expect(channelJoinV3(invalidToken, validChannel.channelId)).toEqual(ERROR);
  });

  test('Testing already member', () => {
    const validUser: any = authRegisterV3('nadavdar@unsw.com', 'password123', 'Nadav', 'Dar');
    const validChannel: any = channelsCreateV3(validUser.token, 'AEROPrivate', false);
    expect(channelJoinV3(validUser.token, validChannel.channelId)).toEqual(ERROR);
  });

  test('Testing valid channelId, wrong format for token', () => {
    const validUser: any = authRegisterV3('nadavdar@unsw.com', 'password123', 'Nadav', 'Dar');
    const validChannel: any = channelsCreateV3(validUser.token, 'AEROPrivate', false);
    const wrongDataType = 'one';
    expect(channelJoinV3(wrongDataType, validChannel.channelId)).toEqual(ERROR);
  });

  test('Testing private channel, and not a global owner', () => {
    const validUser0: any = authRegisterV3('nadavdar@unsw.com', 'password123', 'Nadav', 'Dar');
    authRegisterV3('james@unsw.com', 'password123', 'james', 'comninos');
    const validUser2: any = authRegisterV3('dusan@unsw.com', 'password123', 'dusan', 'stankovic');
    const validChannel: any = channelsCreateV3(validUser0.token, 'AEROPrivate', false);
    expect(channelJoinV3(validUser2.token, validChannel.channelId)).toEqual(ERROR);
  });
});

/** *** Test cases *****/
// channel exists and works
// channel id does not exist
// uid does not exist
// uid refers to a user already in channel
// auth user is not a part of valid channel
// auth user is not a part of INVALID channel
// invalid auth user is not a part of INVALID channel
// invalid user and invalid channel
// check invalid data types

describe('channelInviteV2 Tests', () => {
  let auth1: any;
  let auth2: any;
  let auth3: any;
  let channel1: any;
  beforeEach(() => {
    auth1 = authRegisterV3('dusansta@unsw.com', 'password123', 'Dusan', 'Stankovic');
    auth2 = authRegisterV3('jamescomninos@unsw.com', '123456', 'James', 'Comninos');
    auth3 = authRegisterV3('keithxiao@unsw.com', 'password', 'Keith', 'Xiao');
    channel1 = channelsCreateV3(auth1.token, 'AERO', true);
  });

  afterEach(() => {
    clearV1();
  });

  test('Testing basic correct', () => {
    const invite = channelInviteV3(auth1.token, channel1.channelId, auth2.authUserId);
    expect(invite).toStrictEqual({});
  });

  test('ChannelId does not exist', () => {
    const invalidChannel = 999;
    const invite = channelInviteV3(auth1.token, invalidChannel, auth2.authUserId);
    expect(invite).toStrictEqual(ERROR);
  });

  test('uId does not refer to a valid user', () => {
    const InvaliduId = 535;
    const invite = channelInviteV3(auth1.token, channel1.channelId, InvaliduId);
    expect(invite).toStrictEqual(ERROR);
  });

  test('uId is already member of channel', () => {
    const invite = channelInviteV3(auth1.token, channel1.channelId, auth1.authUserId);
    expect(invite).toStrictEqual(ERROR);
  });

  test('channelId is valid but authUser is not a member of channel', () => {
    const tokenNotIn = createToken();
    const invite = channelInviteV3(tokenNotIn, channel1.channelId, auth2.authUserId);
    expect(invite).toStrictEqual(ERROR);
  });

  test('Invalid authUser is not part of an invalid channel', () => {
    const inValidChannel = 1;
    const invite = channelInviteV3(auth2.token, inValidChannel, auth3.authUserId);
    expect(invite).toStrictEqual(ERROR);
  });

  test('Invalid userId and invalid channel', () => {
    const inValidChannel = 1;
    const InvaliduId = 412;
    const invite = channelInviteV3(auth1.token, inValidChannel, InvaliduId);
    expect(invite).toStrictEqual(ERROR);
  });
});

describe('channelMessagesV2 Tests', () => {
  let auth1: any;
  let auth2: any;
  let channel1: any;
  beforeEach(() => {
    clearV1();
    auth1 = authRegisterV3('dusansta@unsw.com', 'password123', 'Dusan', 'Stankovic');
    auth2 = authRegisterV3('jamescomninos@unsw.com', '123456', 'James', 'Comninos');
    channel1 = channelsCreateV3(auth1.token, 'AERO', true);
  });

  test('Testing channelMessagesV2 works', () => {
    const start = 0;
    const messages = channelMessagesV3(auth1.token, channel1.channelId, start);
    expect(messages).toStrictEqual({
      messages: [],
      start: 0,
      end: -1,
    });
  });

  test('Tests channel doesnt exist', () => {
    const start = 0;
    const invalidChannelId = 34563;
    const messages = channelMessagesV3(auth1.token, invalidChannelId, start);
    expect(messages).toStrictEqual(ERROR);
  });

  // test('Start is greater than messages in channel', () => {
  //   const startInvalid = 42;
  //   const messages = channelMessagesV2(auth1.token, channel1.channelId, startInvalid);
  //   expect(messages).toStrictEqual(ERROR);
  // });

  test('Testing invalid token, valid channelId', () => {
    const start = 0;
    const invalidToken = createToken();
    const messages = channelMessagesV3(invalidToken, channel1.channelId, start);
    expect(messages).toStrictEqual(ERROR);
  });

  test('Channel ID is valid and authUser is not a member', () => {
    const validStart = 0;
    expect(channelMessagesV3(auth2.token, channel1.channelId, validStart)).toEqual(ERROR);
  });
});
