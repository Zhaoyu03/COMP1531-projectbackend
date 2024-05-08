import { getData, setData } from './dataStore';
import { authRegisterV3 } from './auth';
import { clearV1 } from './other';

beforeEach(() => {
  clearV1();
});
afterEach(() => {
  clearV1();
});

describe('Testing for clear V1', () => {
  test('add in valid user/s and see whether after clear the object is not empty', () => {
    authRegisterV3('nadavdar@unsw.com', '12345678', 'Nadav', 'Dar');
    authRegisterV3('nadavda@unsw.com', '12345678', 'Nadav', 'Dar');
    const data = getData();
    expect(data.users.length).toEqual(2);
  });
  // in the previous test since authRegisterV1 has added a member to the
  // data the users array will still have 1 object in it
  // however once clear is called there will be no objects in the users array
  test('Call clear and expect the object to have back to its inital state', () => {
    const data = getData();
    authRegisterV3('nadavdar@unsw.com', '12345678', 'Nadav', 'Dar');
    authRegisterV3('nadavda@unsw.com', '12345678', 'Nadav', 'Dar');
    setData(data);
    const emptyData: any = {
      users: [],
      channels: [],
      dms: [],
    };
    setData(data);
    // call clear and then call data this object should be empty
    clearV1();
    const newData = getData();
    expect(newData).toStrictEqual(emptyData);
  });
});
