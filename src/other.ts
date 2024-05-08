import { getData, setData } from './dataStore';

// Empties all data in dataStore
const clearV1 = (): object => {
  const data: any = getData();
  data.users = [];
  data.channels = [];
  data.dms = [];
  setData(data);
  return {};
};

export { clearV1 };
