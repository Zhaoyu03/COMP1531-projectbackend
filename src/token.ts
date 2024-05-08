import { v4 as uuidv4 } from 'uuid';
import { getData } from './dataStore';

const createToken = (): string => {
  const data = getData();
  // creates random string
  let token: string = uuidv4();
  let isUnique = true;
  // checks if token already exists and creates a new token then repeats
  // the check, until the token does not already exist.
  do {
    // checks if token already exists.
    for (const user of data.users) {
      if (user.token === token) {
        isUnique = false;
      }
    }
    if (isUnique === false) {
      token = uuidv4();
    }
  } while (!isUnique);

  return token;
};

const checkToken = (token: string): boolean => {
  const data = getData();
  let doesExist = false;
  for (const user of data.users) {
    if (user.token.includes(token)) {
      doesExist = true;
    }
  }

  return doesExist;
};

export { createToken, checkToken };
