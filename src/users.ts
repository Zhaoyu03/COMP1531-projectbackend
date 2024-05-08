import { getData, setData } from './dataStore';
import { checkToken } from './token';
import validator from 'validator';
import request from 'sync-request';
import fs from 'fs';
const sharp = require('sharp');
import { url, port } from './config.json';
import HTTPError from 'http-errors';

interface User {
  user: {
    uId: number;
    email: string;
    nameFirst: string;
    nameLast: string;
    handleStr: string;
    profileImgUrl: string;
  },
}

type error = {
  error: string;
}

const userProfileV3 = (token: string, uId: number): User | error => {
  const data = getData();
  // Checks to see if token is valid, if so then finds user by uId and returns user
  if (checkToken(token) === true) {
    for (const user of data.users) {
      if (uId === user.Id) {
        return {
          user: {
            uId: user.Id,
            email: user.email,
            nameFirst: user.firstName,
            nameLast: user.lastName,
            handleStr: user.handle,
            profileImgUrl: user.profileImgUrl
          }
        };
      }
    }
  }
  throw HTTPError(400, 'Invalid uId');
};

const usersAllV2 = (token: string): object => {
  const data: any = getData();

  // check token is valid
  if (checkToken(token) === false) {
    throw HTTPError(403, 'Invalid Token');
  }

  const usersDetails: any = [];
  for (const user of data.users) {
    // Stores details about each user in userDetails
    const userDetails = {
      uId: user.Id,
      email: user.email,
      nameFirst: user.firstName,
      nameLast: user.lastName,
      handleStr: user.handle
    };
    // Adds userDetails to an array of users
    usersDetails.push(userDetails);
  }

  return { users: usersDetails };
};

const userProfileSetnameV2 = (token: string, nameFirst: string, nameLast: string) => {
  const data: any = getData();

  // Error checking
  if (checkToken(token) === false) {
    throw HTTPError(403, 'Invalid token');
  } else if (nameFirst.length < 1 || nameFirst.length > 50 ||
              nameLast.length < 1 || nameLast.length > 50) {
    throw HTTPError(400, 'invalid length');
  } else if (/^[A-Za-z]*$/.test(nameFirst) === false) {
    throw HTTPError(400, 'non alpha-numeric name');
  } else if (/^[A-Za-z]*$/.test(nameLast) === false) {
    throw HTTPError(400, 'non alpha-numeric name');
  }

  // Finds user by token then changes their nameFirst/Last and saves to dataStore.
  for (const user of data.users) {
    if (user.token.includes(token)) {
      user.firstName = nameFirst;
      user.lastName = nameLast;
      setData(data);
      return {};
    }
  }
};

const userProfileSetemailV2 = (token: string, email: string): object => {
  const data: any = getData();

  // check token is valid
  if (checkToken(token) === false) {
    throw HTTPError(403, 'Invalid token');
  }

  // If the new provided email is invalid then return error
  if (!(validator.isEmail(email))) {
    throw HTTPError(400, 'Invalid email');
  }

  let userExists = 0;
  // Finds user by token then changes their email and saves to dataStore.
  for (const user of data.users) {
    if (email === user.email) {
      throw HTTPError(400, 'Invalid email');
    }
    if (user.token.includes(token)) {
      userExists = 1;
      user.email = email;
      setData(data);
    }
  }

  // If the user is not found then return 'error'
  if (userExists === 0) {
    throw HTTPError(400, 'user doesnt exist');
  } else {
    return {};
  }
};

const userProfileSethandleV2 = (token: string, handleStr: string) => {
  const data: any = getData();

  // check token is valid
  if (checkToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  if (handleStr.length < 3 || handleStr.length > 20) {
    throw HTTPError(400, 'invalid handle length');
  } else if (/^[A-Za-z0-9]*$/.test(handleStr) === false) {
    throw HTTPError(400, 'non alpha numeric handle');
  }

  // If the new provided handle is already in use then return error
  for (const user of data.users) {
    if (handleStr === user.handle) {
      throw HTTPError(400, 'handle already in use');
    }
  }

  // Finds user by token and sets their new user handle
  for (const user of data.users) {
    if (user.token.includes(token)) {
      user.handle = handleStr;
      setData(data);
      return {};
    }
  }
};

// **************** ITE3 FUNCTIONS ****************

const userProfileUploadPhotoV1 = (token: string, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number): object => {
  const data: any = getData();

  // Check token is valid
  if (checkToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  // Error checking input
  if (xEnd <= xStart || yEnd <= yStart) {
    throw HTTPError(400, 'incorrect input');
  }

  // Checks if imgUrl is jpeg
  if (!(imgUrl.includes('.jpg')) || !(imgUrl.includes('.jpeg'))) {
    throw HTTPError(400, 'Image not jpg');
  }

  // Crops and saves image to profilePics folder
  const customUrl = (Math.random() + 1).toString(36).substring(7);
  sharp(`${imgUrl}`).extract({ left: xStart, width: xEnd, height: yEnd, top: yStart }).toFile(`${url}/images/${customUrl}`);

  // Sets profile image in user
  for (const user of data.users) {
    if (user.token.includes(token)) {
      user.profileImgUrl = `${url}:${port}/images/${customUrl}`;
      setData(data);
    }
  }

  // Save user profile pic to folder
  const res = request(
    'GET',
    `${imgUrl}`
  );
  const body = res.getBody();
  // create a custom url below instead of 'image url'
  fs.writeFileSync(`profilePics/${imgUrl}`, body, { flag: 'w' });
  return {};
};

const userStatsV1 = (token: string) => {
  const data: any = getData();
  // check token is valid
  if (checkToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  let channelsJoinedByUser = 0;
  let dmsJoinedByUser = 0;
  let msgsSentByUser = 0;

  let channelCount = 0;
  let dmCount = 0;
  let messageCount = 0;

  for (const user of data.users) {
    // Initialise user stats
    const userStats = {
      channelsJoined: [{}],
      dmsJoined: [{}],
      messagesSent: [{}],
      involvementRate: 0
    };

    if (user.token.includes(token)) {
      // Accesses user details of stat user
      const statUser = {
        uId: user.Id,
        email: user.email,
        nameFirst: user.firstName,
        nameLast: user.lastName,
        handleStr: user.handle
      };

      // Adds channels joined by user to userStat array
      for (const channel of data.channels) {
        for (const member of channel.allMembers) {
          if (member.uId === statUser.uId) {
            channelsJoinedByUser++;
            const channelJoined = {
              numChannelsJoined: channelsJoinedByUser,
              timeStamp: Date.now(),
            };
            userStats.channelsJoined.push(channelJoined);
          }
        }
        // Adds messages sent to channel by user to userStat array
        for (const message of channel.messages) {
          if (message.userID === statUser.uId) {
            msgsSentByUser++;
            const msgsSent = {
              numMessagesSent: msgsSentByUser,
              timeStamp: Date.now(),
            };
            userStats.messagesSent.push(msgsSent);
          }
          messageCount++;
        }
        channelCount++;
      }

      // Adds dms joined by user to userStat array
      for (const dm of data.dms) {
        if (dm.members.includes(statUser.uId)) {
          dmsJoinedByUser++;
          const dmsJoined = {
            numDmsJoined: dmsJoinedByUser,
            timeStamp: Date.now(),
          };
          userStats.dmsJoined.push(dmsJoined);
        }
        // Adds dm messages sent by user to userStat array
        for (const message of dm.message) {
          if (message.userID === statUser.uId) {
            msgsSentByUser++;
            const msgsSent = {
              numMessagesSent: msgsSentByUser,
              timeStamp: Date.now(),
            };
            userStats.messagesSent.push(msgsSent);
          }
          messageCount++;
        }
        dmCount++;
      }

      // Deletes first empty object
      userStats.channelsJoined.shift();
      userStats.dmsJoined.shift();
      userStats.messagesSent.shift();
      userStats.involvementRate = (channelsJoinedByUser + dmsJoinedByUser + msgsSentByUser) /
                                  (channelCount + dmCount + messageCount);
      return { userStats: userStats };
    }
  }
};

const usersStatsV1 = (token: string) => {
  const data: any = getData();

  // check token is valid
  if (checkToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  let channelsExist = 0;
  let dmsExist = 0;
  let messagesExist = 0;

  const atLeastOne: any = [];
  let totalUsers = 0;

  // Initialises usersStats (stats of all users)
  const usersStats = {
    channelsExist: [{}],
    dmsExist: [{}],
    messagesExist: [{}],
    utilizationRate: 0
  };

  // Counts total users (need if statement for linting)
  for (const user of data.users) {
    if (user) {
      totalUsers++;
    }
  }

  // Adds channels to usersStats array
  for (const channel of data.channels) {
    channelsExist++;
    const channelExists = {
      numChannelsExist: channelsExist,
      timeStamp: Date.now(),
    };
    usersStats.channelsExist.push(channelExists);
    // Finds unique members of channels
    for (const member of channel.allMembers) {
      if (!(atLeastOne.includes(member.uId))) {
        atLeastOne.push(member.uId);
      }
    }
    // Adds channel messages to usersStats array
    for (const message of channel.messages) {
      if (message) {
        messagesExist++;
        const msgsExists = {
          messagesExist: messagesExist,
          timeStamp: Date.now(),
        };
        usersStats.dmsExist.push(msgsExists);
      }
    }
  }

  // Adds dms to usersStats array
  for (const dm of data.dms) {
    dmsExist++;
    const dmsExists = {
      numDmsExist: dmsExist,
      timeStamp: Date.now(),
    };
    usersStats.dmsExist.push(dmsExists);
    // Finds unique members of dms
    for (const member of dm.members) {
      if (!(atLeastOne.includes(member))) {
        atLeastOne.push(member);
      }
    }
    // Adds dm messages to usersStats array
    for (const message of dm.message) {
      if (message) {
        messagesExist++;
        const msgsExists = {
          messagesExist: messagesExist,
          timeStamp: Date.now(),
        };
        usersStats.dmsExist.push(msgsExists);
      }
    }
  }

  // Deletes first empty object
  usersStats.channelsExist.shift();
  usersStats.dmsExist.shift();
  usersStats.messagesExist.shift();

  usersStats.utilizationRate = atLeastOne.length / totalUsers;
  return { workspaceStats: usersStats };
};

const adminUserRemoveV1 = (token: string, uId: number): object => {
  const data: any = getData();

  // check token is valid
  if (checkToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  // checks if valid global user
  let isGlobalOwner = false;
  for (const user of data.users) {
    if (user.token.includes(token)) {
      if (user.Id === 0) {
        isGlobalOwner = true;
      }
    }
  }

  if (isGlobalOwner === false) {
    throw HTTPError(403, 'not global owner');
  }

  // Checks if user is valid
  let isValidUser = false;
  for (const user of data.users) {
    if (user.Id === uId) {
      isValidUser = true;
    }
  }

  if (isValidUser === false) {
    throw HTTPError(400, 'Invalid user');
  }

  // Changes user nameFirst/Last as per spec
  for (const user of data.users) {
    if (user.Id === uId) {
      user.nameFirst = 'Removed';
      user.nameLast = 'user';
      user.email = '';
      user.handleStr = '';
      setData(data);

      // Removes user from channel
      for (const channel of data.channels) {
        for (const member of channel.allMembers) {
          if (member.uId === user.Id) {
            channel.allMembers = channel.allMembers.filter((item: any) => item.uId !== member.uId);
          }
        }
        // replaces user messages as per spec
        for (const message of channel.messages) {
          if (message.uId === user.Id) {
            message.messageContent = 'Removed user';
            setData(data);
          }
        }
      }

      // Removes user from dm's
      for (const dm of data.dms) {
        if (dm.name.includes(user.handle)) {
          const deleteUser = dm.name.indexOf(user.handle);
          dm.name.splice(deleteUser, 1);
          setData(data);
          for (const message of dm.message) {
            if (message.uId === user.Id) {
              message.messageContent = 'Removed user';
              setData(data);
            }
          }
        }
      }
    }
  }
  return {};
};

const adminUserPermChangeV1 = (token: string, uId: number, permissionId: number): object => {
  const data: any = getData();

  // check token is valid
  if (checkToken(token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  if (permissionId !== 1 && permissionId !== 2) {
    // return { error: 'error' };
    throw HTTPError(400, 'invalid permissionId');
  }
  // test for user being the only global owner
  for (const user of data.users) {
    if (user.Id === uId) {
      if (user.Id !== 0) {
        throw HTTPError(403, 'not global owner');
      }
      // Checks if permissionId is invalid
      if (user.permissions !== permissionId && user.Id === 0) {
        user.permissions = permissionId;
        setData(data);
        return {};
      }
    }
  }
  throw HTTPError(400, 'invalid uId');
};

export {
  userProfileV3, usersAllV2, userProfileSetnameV2, userProfileSetemailV2, userProfileSethandleV2,
  userProfileUploadPhotoV1, userStatsV1, usersStatsV1, adminUserRemoveV1, adminUserPermChangeV1
};
