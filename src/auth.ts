import { getData, setData } from './dataStore';
import validator from 'validator';
import { createToken, checkToken } from './token';
import { getHashOf } from './hash';
import { url, port } from './config.json';
import HTTPError from 'http-errors';
const generator = require('generate-serial-number');
const nodemailer = require('nodemailer');
const ERROR = { error: 'error' };
const SECRET = '5236';

type authUserId = { authUserId: number };

const authRegisterV3 = (email: string, password: string, nameFirst: string, nameLast: string): authUserId | object => {
  // there are multiple things to test
  // validitiy of email whether the handle/email already exists
  // length of first name and length of lastname
  // and validity of the password
  const data: any = getData();

  if (validator.isEmail(email) && password.length >= 6 && nameFirst.length >= 1 &&
        nameFirst.length <= 50 && nameLast.length >= 1 && nameLast.length <= 50) {
    // next check is whether the email already exists
    // loop through users and determine if the email already exists
    for (const user of data.users) {
      // all emails will be stored in lowercase in the dataStore
      // if email exists user cant be registered
      if (user.email === email.toLowerCase()) {
        return ERROR;
      }
    }
    // user email doesn't exist can be added correctly
    let handle = nameFirst + nameLast;
    handle = handle.slice(0, 20);
    // find if the handle already exists and if yes
    // what number should be appended to the end of the handle
    // this can be done by counting the occurences that the handle appears
    let handleExistsCount = 0;
    for (const user of data.users) {
      // only check for first 20 characters as the 21st+ character
      // differentiaties the handles
      if (user.handle === handle) {
        handleExistsCount++;
      }
    }
    // if the handle count is 0 then the handle doesn't exists yet
    // if the handle count is >= than 1 then the handle exists
    // and we need to append a number to the handle
    // this number will be handleExistsCount - 1.
    if (handleExistsCount) {
      handleExistsCount -= 1;
      handle = handle + handleExistsCount;
    }
    let permissionsId = 2;
    if (data.users.length === 0) {
      permissionsId = 1;
    }

    const userTokens: any = [];
    const newToken = getHashOf(createToken() + SECRET);
    userTokens.push(newToken);
    const hashedPassword = getHashOf(password + SECRET);
    const secretCode: any[] = [];
    // add data to the Datastore
    const newUser = {
      firstName: nameFirst,
      lastName: nameLast,
      email: email.toLowerCase(),
      password: hashedPassword,
      handle: handle,
      permissions: permissionsId,
      Id: data.users.length,
      token: userTokens,
      profileImgUrl: `${url}:${port}/resources/default.jpg`,
      secretCode: secretCode,
    };

    data.users.push(newUser);
    setData(data);
    return {
      token: newUser.token[0],
      authUserId: newUser.Id
    };
  }

  return ERROR;
};

const authLoginV3 = (email: string, password: string): authUserId | object => {
  if (!email || typeof (email) !== 'string' || !password || typeof (password) !== 'string') {
    return { error: 'error' };
  }

  const hashedPassword = getHashOf(password + SECRET);
  const data: any = getData();
  for (const user of data.users) {
    if (email.toLowerCase() === user.email && hashedPassword === user.password) {
      const newToken = getHashOf(createToken() + SECRET);
      user.token.push(newToken);
      setData(data);
      return {
        token: newToken,
        authUserId: user.Id
      };
    }
  }
  return ERROR;
};

const authLogoutV2 = (token: string): object => {
  if (!checkToken(token)) {
    throw HTTPError(403, 'Cannot logout!');
  }
  const data = getData();
  for (const user of data.users) {
    if (user.token.includes(token)) {
      user.token = user.token.filter(function(item: any) {
        if (item !== token) {
          return true;
        } else {
          return false;
        }
      });
      setData(data);
    }
  }
  return {};
};

async function authPasswordresetRequestV1 (email: string) {
  await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '8e948b473cbc94',
      pass: '5b6bcccec2ced0'
    }
  });
  const secretCode = generator.generate(6);
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Test" <test@test.com>', // sender address
    to: email, // list of receivers
    subject: 'Password reset code', // Subject line
    text: secretCode, // plain text body
    html: `<b>${secretCode}</b>`, // html body
  });
  const data = getData();
  const user: any = data.users.find(function(item: any) {
    if (item.email === email) {
      return true;
    } else {
      return false;
    }
  });
  user.secretCode.push(secretCode);
  data.users[data.users.indexOf(user)] = user;
  setData(data);
  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  return {};
}

const authPasswordresetResetV1 = (resetCode: string, newPassword: string): object => {
  const data = getData();
  const user: any = data.users.find(function(item: any) {
    if (item.resetCode === resetCode) {
      return true;
    } else {
      return false;
    }
  });

  if (user === undefined || newPassword.length < 6) {
    throw HTTPError(400, 'Cannot reset the password!');
  }
  user.password = getHashOf(newPassword + SECRET);
  user.resetCode = user.resetCode.filter(function(item: any) {
    if (item !== resetCode) {
      return true;
    } else {
      return false;
    }
  });
  data.users[data.users.indexOf(user)] = user;
  setData(data);
  return {};
};
export { authLoginV3, authRegisterV3, authLogoutV2, authPasswordresetRequestV1, authPasswordresetResetV1 };
