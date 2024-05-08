import { getData, setData } from './dataStore';
import { clearV1 } from './other';
import { createToken, checkToken } from './token';
import { authRegisterV3 } from './auth';

beforeEach(() => {
  clearV1();
});
afterEach(() => {
  clearV1();
});

describe('createToken testing', () => {
  test('Testing token is created', () => {
    authRegisterV3('nadavdar@unsw.com', 'password', 'Nadav', 'Dar');
    const data = getData();
    data.users[0].token = createToken();
    setData(data);
    expect(data.users[0].token).toEqual(expect.any(String));
  });
});

describe('checkToken testing', () => {
  test('Testing invalid token', () => {
    const randomToken = createToken();
    authRegisterV3('nadavdar@unsw.com', 'password', 'Nadav', 'Dar');
    const data = getData();
    data.users[0].token = createToken();
    setData(data);
    expect(checkToken(randomToken)).toEqual(false);
  });

  test('Testing just a random string not a token', () => {
    const randomToken = 'string';
    authRegisterV3('nadavdar@unsw.com', 'password', 'Nadav', 'Dar');
    const data = getData();
    data.users[0].token = createToken();
    setData(data);
    expect(checkToken(randomToken)).toEqual(false);
  });

  test('Testing valid token', () => {
    const randomToken = createToken();
    authRegisterV3('nadavdar@unsw.com', 'password', 'Nadav', 'Dar');
    const data = getData();
    data.users[0].token = randomToken;
    setData(data);
    expect(checkToken(randomToken)).toEqual(true);
  });
});
