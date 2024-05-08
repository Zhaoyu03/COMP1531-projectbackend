import { getData, setData } from './dataStore';
import { checkToken } from './token';
const generator = require('generate-serial-number');
import HTTPError from 'http-errors';

const dmMessagesV2 = (token: string, dmId: number, start: number): object => {
  const data: any = getData();
  if (!checkToken(token)) {
    throw HTTPError(403, 'Cannot show the messages for the dm!');
  }

  let reqUser;
  for (const user of data.users) {
    if (user.token.includes(token)) {
      reqUser = user.Id;
    }
  }
  let validdm = false;
  for (const dm of data.dms) {
    if (dmId === dm.dmId) {
      if (!(reqUser in dm.allMembers)) {
        throw HTTPError(403, 'Cannot show the messages for the dm!');
      }
      validdm = true;
    }
  }
  if (validdm === false) {
    throw HTTPError(400, 'Cannot show the messages for the dm!');
  }
  const messages: object = [];
  return {
    messages: messages,
    start: start,
    end: -1,
  };
};

const dmCreateV2 = (token: string, uIds: number[]): object => {
  if (!checkToken(token)) {
    throw HTTPError(403, 'Cannot create dm!');
  }
  const data = getData();
  const users = data.users;
  let judge = true;
  for (const id of uIds) {
    let count = 0;
    for (const user of users) {
      if (id === user.Id) {
        count++;
      }
    }
    if (count === 0) {
      judge = false;
    }
  }
  const array: any[] = [];
  for (const i of uIds) {
    if (!array.includes(i)) {
      array.push(i);
    }
  }
  let name = '';
  let handle;
  let sender;
  const nameArray: any = [];
  for (const i of users) {
    if (uIds.includes(i.Id)) {
      handle = i.handle;
      nameArray.push(handle);
    }
    if (i.token.includes(token)) {
      sender = i.Id;
    }
  }
  nameArray.sort(function(a: any, b: any) {
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    } else if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    } else {
      return 0;
    }
  });
  for (const i of nameArray) {
    if (name === '') {
      name = i;
    } else {
      name += `, ${i}`;
    }
  }
  const dmId: number = parseInt(generator.generate(10));
  data.dms.push({
    dmId: dmId,
    name: name,
    sender: sender,
    members: uIds,
    message: []
  });
  setData(data);
  if (array.length !== uIds.length || judge === false) {
    throw HTTPError(400, 'Cannot create dm!');
  } else {
    return {
      dmId: dmId
    };
  }
};

const dmListV2 = (token: string): object => {
  const dmList: any = [];
  const data = getData();

  // Checks if token is valid
  if (!checkToken(token)) {
    throw HTTPError(403, 'Cannot list dm!');
  }

  // Scans through all dm's
  for (const user of data.users) {
    if (user.token.includes(token)) {
      const Id = user.Id;
      for (const dm of data.dms) {
        // If user is a member then add dm to dmDetails
        if (dm.members.includes(Id)) {
          const dmDetails = {
            dmId: dm.dmId,
            name: dm.name
          };
          dmList.push(dmDetails);
        }
      }
    }
  }
  // Returns all dm's that the authUser is a member of
  return { dms: dmList };
};

const dmRemoveV2 = (token: string, dmId: number): object => {
  if (!checkToken(token)) {
    throw HTTPError(403, 'Cannot remove dm!');
  }
  const data = getData();
  const users = data.users;
  let sender;
  for (const i of users) {
    if (i.token.includes(token)) {
      sender = i.Id;
    }
  }
  const dms = data.dms;
  let judge = false;
  let isSender = true;
  for (const i of dms) {
    if (i.dmId === dmId) {
      judge = true;
      if (i.sender !== sender) {
        isSender = false;
      }
    }
  }
  if (judge === false) {
    throw HTTPError(400, 'Cannot remove dm!');
  }
  // dms = dms.filter(i => i.dmId !== dmId);
  const newDms: any = [];
  for (const i of dms) {
    if (i.dmId !== dmId) {
      newDms.push(i);
    }
  }
  data.dms = newDms;
  setData(data);
  if (isSender === false) {
    throw HTTPError(403, 'Cannot remove dm!');
  } else {
    return {};
  }
};

const dmDetailsV2 = (token: string, dmId: number): object => {
  if (!checkToken(token)) {
    throw HTTPError(403, 'Cannot show the dm details!');
  }
  const data = getData();
  const users = data.users;
  let Id;
  for (const i of users) {
    if (i.token.includes(token)) {
      Id = i.Id;
    }
  }
  const dms = data.dms;
  let judge = false;
  let isMember = true;
  let dm: any;
  for (const i of dms) {
    if (i.dmId === dmId) {
      judge = true;
      if (!i.members.includes(Id)) {
        isMember = false;
      } else {
        dm = i;
      }
    }
  }
  if (judge === false) {
    throw HTTPError(400, 'Cannot show the dm details!');
  }
  if (isMember === false) {
    throw HTTPError(403, 'Cannot show the dm details!');
  } else {
    const emptyArray: any[] = [];
    const details = {
      name: dm.name,
      members: emptyArray
    };
    for (const i of dm.members) {
      for (const j of users) {
        if (i === j.Id) {
          details.members.push({
            uId: i,
            email: j.email,
            nameFirst: j.firstName,
            nameLast: j.lastName,
            handleStr: j.handle
          });
        }
      }
    }
    return details;
  }
};

const dmLeaveV2 = (token: string, dmId: number): object => {
  if (!checkToken(token)) {
    throw HTTPError(403, 'Cannot leave the dm!');
  }
  const data = getData();
  const users = data.users;
  let Id: any;
  for (const i of users) {
    if (i.token.includes(token)) {
      Id = i.Id;
    }
  }
  const dms = data.dms;
  let judge = false;
  let isMember = true;
  for (const i of dms) {
    if (i.dmId === dmId) {
      judge = true;
      if (!i.members.includes(Id)) {
        isMember = false;
      }
    }
  }
  if (judge === false) {
    throw HTTPError(400, 'Cannot leave the dm!');
  }
  if (isMember === false) {
    throw HTTPError(403, 'Cannot leave the dm!');
  } else {
    for (let i = 0; i < data.dms.length; i++) {
      if (data.dms[i].dmId === dmId) {
        data.dms[i].members = data.dms[i].members.filter(function(item: any) {
          if (item !== Id) {
            return true;
          } else {
            return false;
          }
        });
      }
    }
    setData(data);
    return {};
  }
};

export { dmMessagesV2, dmCreateV2, dmListV2, dmRemoveV2, dmDetailsV2, dmLeaveV2 };
