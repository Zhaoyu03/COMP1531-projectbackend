import { channelsListV3, channelsListallV3, channelsCreateV3 } from './channels';
import { authRegisterV3 } from './auth';
import { clearV1 } from './other';

describe('Test for channelsListV2', () => {
  // to reset the database
  clearV1();
  let auth1: any;
  let auth2: any;
  let auth3: any;
  let channel1: any;

  // to set the database for the test
  beforeEach(() => {
    auth1 = authRegisterV3('nadavdar@unsw.com', 'password123', 'Nadav', 'Dar');
    auth2 = authRegisterV3('jamescomninos@unsw.com', '123456', 'James', 'Comninos');
    auth3 = authRegisterV3('keithxiao@unsw.com', 'password', 'Keith', 'Xiao');
    channel1 = channelsCreateV3(auth3.token, 'AEROPrivate', false);
  });

  afterEach(() => {
    clearV1();
  });

  // to test whether channelsListV2 provide the right channel list for auth1
  test('Test listing channels for auth1', () => {
    expect(channelsListV3(auth1.token)).toStrictEqual({ channels: [] });
  });

  // to test whether channelsListV2 provide the right channel list for auth2
  test('Test listing channels for auth2', () => {
    expect(channelsListV3(auth2.token)).toStrictEqual({ channels: [] });
  });

  // to test whether channelsListV2 provide the right channel list for auth3
  test('Test listing channels for auth3', () => {
    expect(channelsListV3(auth3.token)).toStrictEqual({
      channels: [
        {
          channelId: channel1.channelId,
          name: 'AEROPrivate'
        }
      ]
    });
  });

  // to test cases of error
  test('Test if the uid does not exist for channelsListV2', () => {
    expect(channelsListV3('-999')).toStrictEqual({ error: 'error' });
  });
});

describe('channelsCreateV2Test', () => {
  /*
    This test is going to test whether inputs
    authUserId,name ,isPublic are valid (correct
     Id and name )
     */
  clearV1();
  let a1: any;
  let a2: any;
  beforeEach(() => {
    a1 = authRegisterV3('newemail@unsw.com', '123456', 'new', 'auth');
    a2 = authRegisterV3('neemail@unsw.com', '111111', 'wsd', 'was');
  });

  afterEach(() => {
    clearV1();
  });

  test('Testing new channel is valid', () => {
    const create: any = channelsCreateV3(a1.token, 'newChannels1', true);
    expect(create).toStrictEqual({ channelId: 0 });
    // Give the newChannel1 an id :2
    // Currently all new id have not be created
  });
  test('Testing is not public case', () => {
    const create: any = channelsCreateV3(a2.token, 'newChannels1', false);
    expect(create).toStrictEqual({ channelId: 0 });
  });
  test('Testing names with different cases', () => {
    const create: any = channelsCreateV3(a1.token, 'newChannels21', true);
    expect(create).toStrictEqual({ channelId: 0 });
  });
  test('Testing wrong type normal uid', () => {
    const create: any = channelsCreateV3('', 'newChannels1', true);
    expect(create).toStrictEqual({ error: 'error' });
  });
  test('Testing wrong Id format', () => {
    const create: any = channelsCreateV3('', 'newChannels', true);
    expect(create).toStrictEqual({ error: 'error' });
  });

  test('testing invalid authUserId', () => {
    const create: any = channelsCreateV3('', 'new channels', true);
    expect(create).toStrictEqual({ error: 'error' });
  });
});

describe('Test for channelsListallV2', () => {
  // to reset the database
  clearV1();
  // to set the database for the test
  let auth3: any;
  let channel1: any;
  let channel2: any;
  beforeEach(() => {
    auth3 = authRegisterV3('keithxiao@unsw.com', 'password', 'Keith', 'Xiao');
    channel1 = channelsCreateV3(auth3.token, 'AEROPrivate', false);
    channel2 = channelsCreateV3(auth3.token, 'AEROPublic', true);
  });

  afterEach(() => {
    clearV1();
  });

  // to test correct list
  test('Test if output the right list', () => {
    expect(channelsListallV3(auth3.token)).toStrictEqual({
      channels:
      [
        {
          channelId: channel1.channelId,
          name: 'AEROPrivate'
        },
        {
          channelId: channel2.channelId,
          name: 'AEROPublic'
        }
      ]
    });
  });
  // to test cases of error
  test('Test if the uid does not exist for channelsListallV2', () => {
    expect(channelsListallV3('-999')).toStrictEqual({ error: 'error' });
  });
});
