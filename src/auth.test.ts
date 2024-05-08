import { authLoginV3, authRegisterV3 } from './auth';
import { clearV1 } from './other';

const ERROR = { error: 'error' };

afterEach(() => {
  clearV1();
});

describe('AuthRegisterV2 Testing', () => {
  test('Testing a valid user input', () => {
    const validRegister: any = authRegisterV3('nadavdar@unsw.com', 'password', 'Nadav', 'Dar');
    expect(validRegister.authUserId).toEqual(expect.any(Number));
    expect(validRegister.token).toEqual(expect.any(String));
  });

  // special case passwords are allowed
  test('Testing valid user input with special case password', () => {
    const validRegister: any = authRegisterV3('kiethxiao@unsw.com', 'Speci@alPassw0rd!', 'Keith', 'Xiao');
    expect(validRegister.authUserId).toEqual(expect.any(Number));
    expect(validRegister.token).toEqual(expect.any(String));
  });

  // Since first and lastname are the same
  // the main the difference between the 2 users is Id
  // will be different and the handle
  test('Testing 2 users same name, password different email', () => {
    authRegisterV3('dusanstankovic@gmail.com', 'password', 'Dusan', 'Stankovic');
    const validRegister: any = authRegisterV3('dusanstankovic@unsw.com', 'password', 'Dusan', 'Stankovic');
    expect(validRegister.authUserId).toEqual(expect.any(Number));
    expect(validRegister.token).toEqual(expect.any(String));
  });
  // the handle of these users should be cut of at 20 chracters
  // since both users have different emails there is no issue registering the users
  // each will have their own unique handle
  test('Testing 2 users same name, password different email and first + last name more than 20 characters', () => {
    authRegisterV3('dusanstankovic@gmail.com', 'password', 'Dusan', 'Stankovic');
    const validRegister: any = authRegisterV3('dusanstankovic@unsw.com', 'password', 'Dusan', 'Stankovic');
    expect(validRegister.authUserId).toEqual(expect.any(Number));
    expect(validRegister.token).toEqual(expect.any(String));
  });

  test('Testing 2 users with the same email should cause error', () => {
    authRegisterV3('zehuazhou@unsw.com', '123456', 'Zehua', 'Zhou');
    // register new user with same email causes error
    const invalidRegister = authRegisterV3('zehuazhou@unsw.com', 'secretWord', 'Zehua', 'Zhou');
    expect(invalidRegister).toStrictEqual(ERROR);
  });

  test('Testing user with password which is too short', () => {
    const invalidRegister = authRegisterV3('jamescomninos@unsw.com', 'short', 'James', 'Comninos');
    expect(invalidRegister).toStrictEqual(ERROR);
  });

  test('Testing user with invalidEmailFormat', () => {
    const invalidRegister = authRegisterV3('jamescomninos.unsw.com', 'GoodPassword', 'James', 'Comninos');
    expect(invalidRegister).toStrictEqual(ERROR);
  });

  test('Testing user with no firstName', () => {
    const invalidRegister = authRegisterV3('jamescomninos@unsw.com', 'GoodPassword', '', 'Comninos');
    expect(invalidRegister).toStrictEqual(ERROR);
  });

  test('Testing user with no lastName', () => {
    const invalidRegister = authRegisterV3('jamescomninos@unsw.com', 'GoodPassword', 'James', '');
    expect(invalidRegister).toStrictEqual(ERROR);
  });

  test('Testing user with firstName which is tooLong', () => {
    const invalidRegister = authRegisterV3('zhaoyuzhang@unsw.com', 'drowssap', 'ThisFirstNameIsFarTooLongItIsWellOver50CharactersAndIsThusInvalid', 'Zhang');
    expect(invalidRegister).toStrictEqual(ERROR);
  });

  test('Testing user with lastName which is tooLong', () => {
    const invalidRegister = authRegisterV3('zhaoyuzhang@unsw.com', 'drowssap', 'Zhaoyu', 'ThisLastNameIsFarTooLongItIsWellOver50CharactersAndIsThusInvalid');
    expect(invalidRegister).toStrictEqual(ERROR);
  });
});

describe('AuthLoginV2 Testing', () => {
  beforeEach(() => {
    // all users are registers successfully
    authRegisterV3('nadavdar@unsw.com', 'Password', 'Nadav', 'Dar');
    authRegisterV3('jamescomninos@unsw.com', 'secretword', 'James', 'Comninos');
    authRegisterV3('zhaoyuzhang@unsw.com', '654321', 'Zhaoyu', 'Zhang');
    authRegisterV3('zehuazhou@unsw.com', 'qwerty123', 'Zehua', 'Zhou');
    authRegisterV3('dusanstankovic@unsw.com', 'abcdef', 'Dusan', 'Stankovic');
    authRegisterV3('kiethxiao@unsw.com', 'Speci@alPassw0rd!', 'Keith', 'Xiao');
  });
  test('Valid user email and password', () => {
    const validLogin: any = authLoginV3('nadavdar@unsw.com', 'Password');
    expect(validLogin.authUserId).toEqual(expect.any(Number));
    expect(validLogin.token).toEqual(expect.any(String));
  });
  test('Valid user email and special case password', () => {
    const validLogin: any = authLoginV3('kiethxiao@unsw.com', 'Speci@alPassw0rd!');
    expect(validLogin.authUserId).toEqual(expect.any(Number));
    expect(validLogin.token).toEqual(expect.any(String));
  });
  // email case does not impact the email
  // for example test@mail.com is the same as TEST@MaIL.CoM
  test('Valid user email and password with different case for email', () => {
    const validLogin: any = authLoginV3('JamEScoMNinOs@UNSW.COm', 'secretword');
    expect(validLogin.authUserId).toEqual(expect.any(Number));
    expect(validLogin.token).toEqual(expect.any(String));
  });

  test('Incorrect password entered', () => {
    // passwords are case sensitive
    const invalidLogin = authLoginV3('zehuazhou@unsw.com', 'QWERTY123');
    expect(invalidLogin).toStrictEqual(ERROR);
  });

  test('Incorrect email entered', () => {
    // should be .com not .co
    const invalidLogin = authLoginV3('dusanstankovic@unsw.co', 'abcdef');
    expect(invalidLogin).toStrictEqual(ERROR);
  });

  test('Empty string for email', () => {
    // passwords are case sensitive
    const invalidLogin = authLoginV3('', 'qwerty123');
    expect(invalidLogin).toStrictEqual(ERROR);
  });

  test('Empty string for password', () => {
    // passwords are case sensitive
    const invalidLogin = authLoginV3('zehuazhou@unsw.com', '');
    expect(invalidLogin).toStrictEqual(ERROR);
  });
});
