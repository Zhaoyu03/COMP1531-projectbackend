import { getData, setData } from './dataStore';
import { checkToken } from './token';
import { notificationReacted, notificationTagged } from './notification';
import HTTPError from 'http-errors';

const messageSenddmV2 = (token: string, dmId: number, message: string) => {
  const data: any = getData();

  let judge = false;
  if (checkToken(token) === false) {
    judge = true;
  } else if (message.length < 1 || message.length > 1000) {
    judge = true;
  }

  let authUserId;
  // Checks that the user is valid
  for (const user of data.users) {
    if (user.token.includes(token)) {
      authUserId = user.Id;
    }
  }

  // Checks if dmId is valid && the members of a dm doesn't include the authUser
  for (const dm of data.dms) {
    if (dm.dmId !== dmId || !(dm.members.includes(authUserId))) {
      judge = true;
    }
  }

  // Returns error if any of the above is true
  if (judge === true) {
    return { error: 'error' };
  }

  // Finds dm given dmId and sets the dm data
  for (const dm of data.dms) {
    if (dmId === dm.dmId) {
      dm.message.messageContent = message;
      const messageId = Math.floor(Math.floor(Math.random() * Date.now()));
      dm.message.Id = messageId;
      dm.message.timeSent = Math.floor((new Date()).getTime() / 1000);
      notificationTagged(token, messageId);
      setData(data);
      return { messageId: messageId };
    }
  }
};

const messageSendV2 = (token: string, channelId: number, message: string): object => {
  const data: any = getData();

  // Checks if token is valid or if the message is too long/short
  if (checkToken(token) === false) {
    return { error: 'error' };
  } else if (message.length > 1000 || message.length < 1) {
    return { error: 'error' };
  }
  let judge = false;
  let userId: any;
  // Checks to see if authUser is a member of the channel
  for (const user of data.users) {
    if (user.token.includes(token)) {
      const auth = user.Id;
      for (const channel of data.channels) {
        if (channel.channelId === channelId) {
          for (const member of channel.allMembers) {
            if (member.uId === auth) {
              judge = true;
              userId = auth;
            }
          }
          if (judge === false) {
            return { error: 'error' };
          }
        }
      }
    }
  }
  // Finds channel with channelId and sends message to channel
  let messageId: any;
  let uId: any;
  let timeSent: any;
  const reacts: any[] = [];
  const messageStruct = {
    messageId: messageId,
    uId: uId,
    message: '',
    timeSent: timeSent,
    reacts: reacts,
    isPinned: false
  };
  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      messageStruct.message = message;
      const messageId = Math.floor(Math.floor(Math.random() * Date.now()));
      messageStruct.messageId = messageId;
      messageStruct.uId = userId;
      messageStruct.timeSent = Math.floor((new Date()).getTime() / 1000);
      data.channels[data.channels.indexOf(channel)].messages.push(messageStruct);
      notificationTagged(token, messageId);
      setData(data);
      return { messageId: messageId };
    }
  }
  return { error: 'error' };
};

const messageEditV2 = (token: string, channelId: number, message: string): object => {
  const data: any = getData();
  if (checkToken(token) === false) {
    // check token
    return { error: 'error' };
  }
  let judge = false;
  if (checkToken(token) === false) {
    judge = true;
  } else if (message.length < 1 || message.length > 1000) {
    judge = true;
  }

  let authUserId;
  // Checks that the user is valid
  for (const user of data.users) {
    if (user.token.includes(token)) {
      authUserId = user.Id;
    }
  }

  // Checks if channel is valid && that the auth user is a member
  for (const channel of data.channels) {
    if (channel.channelId !== channelId || !(channel.members.includes(authUserId))) {
      judge = true;
    }
  }

  if (judge === true) {
    return { error: 'error' };
  }
  // check the edit authorised
  const editedmessage = message;
  data.channels.messages.messageContent.push(editedmessage);
  setData(data);
  return {
    message: editedmessage
  };
};

const messageRemoveV2 = (token: string, messageId: number): object => {
  const data = getData();
  if (checkToken(token) === false) {
    // check token
    return { error: 'error' };
  }
  let reqUser;
  for (const user of data.users) {
    if (user.token.includes(token)) {
      reqUser = user.Id;
    }
  }
  if (!(reqUser in data.channel.allMembers)) {
    return { error: 'error' };
  }
  let reqmes;
  for (const message of data.message) {
    if (message.messageId === messageId) {
      reqmes = message;
    }
  }
  if (!(reqmes.sender in data.message.sender)) {
    return { error: 'error' };
  }
  const newdata = delete data.channels.messages;
  data.message.push(newdata);
  return {};
};

export const messageShareV1 = (token: string, ogMessageId: number, message: string, channelId: number, dmId: number) => {
  const data = getData();
  const allCid: any = [];
  const allDid: any = [];
  if (channelId !== -1 && dmId !== -1) {
    throw HTTPError(400, 'neither channelId nor dmId are -1');
  }
  // Check the Id input
  if (dmId === -1) {
    // const ogMessage = data.channels.message.filter((item) => item.messageId === ogMessageId);
    for (const channel of data.channels) {
      for (const message of channel.message) {
        if (ogMessageId === message.Id) {
          const ogMessage = message;
          // get the origin messages.
          messageSenddmV2(token, dmId, ogMessage.messageContent + message);
          // send a new message
          const sharedMessageId = Math.floor(Math.floor(Math.random() * Date.now()));
          data.sharedMessageId.push(sharedMessageId);
          setData(data);
          return {
            sharedMessageId: sharedMessageId
          };
        }
      }
    }
  }
  if (channelId === -1) {
    // const ogMessage = data.dms.message.filter((item) => item.messageId === ogMessageId);
    for (const dm of data.dms) {
      for (const user of data.users) {
        if (user.token === token) {
          if (dm.sender !== user.Id) {
            // check the auth user
            throw HTTPError(403, 'the pair of channelId and dmId are valid (i.e. one is -1, the other is valid) and the authorised user has not joined the channel or DM they are trying to share the message to');
          }
        }
      }
      for (const message of dm.message) {
        if (ogMessageId === message.messageId) {
          const ogMessage = message;
          messageSenddmV2(token, dmId, ogMessage.messageContent + message);
          const sharedMessageId = Math.floor(Math.floor(Math.random() * Date.now()));
          data.sharedMessageId.push(sharedMessageId);
          setData(data);
          return {
            sharedMessageId: sharedMessageId
          };
        }
      }
    }
  }
  for (const channel of data.channels) {
    allCid.push(channel.channelId);
    // get all channelId
  }
  for (const dm of data.dms) {
    allDid.push(dm.dmId);
    // get all dmId
  }
  if (!(allCid.includes(channelId)) && !(allDid.includes(dmId))) {
    throw HTTPError(400, 'both channelId and dmId are invalid');
    // check invalid Id
  }
  if (channelId === -1) {
    if (!(data.dms.message.messageId.includes(ogMessageId))) {
      throw HTTPError(400, 'ogMessageId does not refer to a valid message within a channel/DM that the authorised user has joined');
      // check invalid messageId
    }
  } else if (dmId === -1) {
    if (!(data.channels.message.messageId.includes(ogMessageId))) {
      throw HTTPError(400, 'ogMessageId does not refer to a valid message within a channel/DM that the authorised user has joined');
    }
  }
  if (message.length > 1000) {
    throw HTTPError(400, 'length of message is more than 1000 characters');
    // CHECK THE message length
  }
  // const userId = data.users.filter(item => item.token.includes(token));
  // if (!(data.channels.allMembers.includes(userId)) && !(data.dms.dmId.includes(dmId))) {
  //   throw HTTPError(403, 'the pair of channelId and dmId are valid (i.e. one is -1, the other is valid) and the authorised user has not joined the channel or DM they are trying to share the message to');
  // }
};
export const messageReactV1 = (token: string, messageId: number, reactId: number) => {
  const data = getData();
  // const userId = data.users.filter(item => item.token.includes(token));
  const allCid: any = [];
  const allDid: any = [];
  for (const channel of data.channels) {
    for (const message of channel.messages) {
      for (const user of data.users) {
        if (user.token === token) {
          allCid.push(channel.messages.indexOf(message).messageId);
          // get all messageId in channel
          if (reactId !== null && reactId !== undefined) {
            // check the auth is already reacted
            throw HTTPError(400, 'reactId is not a valid react ID - currently, the only valid react ID the frontend has is 1');
          }
          if (messageId === message.messageId) {
            message.react.reactId.push(1);
            message.react.uIds.push(user.Id);
            message.react.isThisUserReacted.push(true);
            setData(data);
          }
        }
      }
    }
  }
  for (const dm of data.dms) {
    for (const message of dm.message) {
      allDid.push(dm.message.messageId);
      // get all messageId in dm
      for (const user of data.users) {
        if (reactId !== null && reactId !== undefined) {
          throw HTTPError(400, 'reactId is not a valid react ID - currently, the only valid react ID the frontend has is 1');
        }
        if (messageId === message.messageId) {
          message.react.reactId.push(1);
          message.react.uIds.push(user.Id);
          message.react.isThisUserReacted.push(true);
          setData(data);
        }
      }
    }
  }
  let judge = false;
  for (const dm of data.dms) {
    for (const message of dm.message) {
      if (messageId === message.messageId) {
        // check valid messageId in dm
        judge = true;
      }
    }
  }
  for (const channel of data.channels) {
    for (const message of channel.message) {
      if (messageId === message.messageId) {
        // check valid messageId in channel
        judge = true;
      }
    }
  }
  if (judge === false) {
    throw HTTPError(400, 'messageId is not a valid message within a channel or DM that the authorised user has joined');
  }
  if (reactId !== 1) {
    throw HTTPError(400, 'reactId is not a valid react ID - currently, the only valid react ID the frontend has is 1');
  }
  notificationReacted(token, messageId);
};
export const messageUnreactV1 = (token: string, messageId: number, reactId: number) => {
  const data = getData();
  const allCid: any = [];
  const allDid: any = [];
  for (const channel of data.channels) {
    for (const message of channel.message) {
      allCid.push(channel.message.messageId);
      // het all messageId in channel
      if (reactId === null || reactId === undefined) {
        throw HTTPError(400, 'the message does not contain a react with ID reactId from the authorised user');
      }
      // check the message is reacted
      if (messageId === message.messageId) {
        const newdata = delete message.react;
        setData(newdata);
      }
    }
  }
  for (const dm of data.dms) {
    for (const message of dm.message) {
      allDid.push(dm.message.messageId);
      if (reactId !== null && reactId !== undefined) {
        throw HTTPError(400, 'the message does not contain a react with ID reactId from the authorised user');
      }
      if (messageId === message.messageId) {
        const newdata = delete message.react;
        setData(newdata);
      }
    }
  }
  let judge = false;
  for (const dm of data.dms) {
    if (dm.message.messageId === messageId) {
      judge = true;
    }
  }
  for (const channel of data.channels) {
    if (channel.message.messageId === messageId) {
      judge = true;
    }
  }
  if (judge === false) {
    throw HTTPError(400, 'messageId is not a valid message within a channel or DM that the authorised user has joined');
  }
  // check the messageId valid
  if (reactId !== 1) {
    throw HTTPError(400, 'reactId is not a valid react ID - currently, the only valid react ID the frontend has is 1');
  }
  // chen the reactedId valid
};
export const searchV1 = (queryStr: string): object => {
  const data = getData();
  if (queryStr.length < 1 || queryStr.length > 1000) {
    throw HTTPError(400, 'length of queryStr is less than 1 or over 1000 characters');
  }
  // check the length
  const result: any = [];
  for (const dm of data.dms) {
    if (dm.message.messageContent === queryStr) {
      result.push(dm.message.messageContent);
    }
  }
  for (const channel of data.channels) {
    if (channel.message.messageContent === queryStr) {
      result.push(channel.message.messageContent);
    }
  }
  return {
    messages: result
  };
};

const messagePinV1 = (messageId: number, token: string): object => {
  let isChannelMessage = false;
  let reqPath: any;
  let isDmMessage = false;
  const data = getData();
  let reqMessage: any;

  for (const channel of data.channels) {
    for (const message of channel.messages) {
      if (message.Id === messageId) {
        reqMessage = message;
        reqPath = channel;
        isChannelMessage = true;
      }
    }
  }

  for (const dm of data.dms) {
    for (const message of dm.message) {
      if (message.Id === messageId) {
        reqMessage = message;
        reqPath = dm;
        isDmMessage = true;
      }
    }
  }

  if (isChannelMessage === false && isDmMessage === false) {
    throw HTTPError(400, 'invalid messageId');
  } else if (reqMessage.isPinned !== true) {
    if (isChannelMessage === true) {
      for (const owner of reqPath.ownerMembers) {
        if (owner.token.includes(token)) {
          reqMessage.isPinned = true;
          return {};
        }
      }
      throw HTTPError(403, 'authorised user does not have owner permissions');
    } else {
      let reqUser: any;
      for (const user of data.users) {
        if (user.token.includes(token)) {
          reqUser = user;
        }
      }
      if (reqPath.sender === reqUser.Id) {
        reqMessage.isPinned = true;
        return {};
      } else {
        throw HTTPError(403, 'authorised user does not have owner permissions');
      }
    }
  }

  throw HTTPError(400, 'message is already pinned');
};

const messageUnpinV1 = (messageId: number, token: string): object => {
  let isChannelMessage = false;
  let reqPath: any;
  let isDmMessage = false;
  const data = getData();
  let reqMessage: any;

  for (const channel of data.channels) {
    for (const message of channel.messages) {
      if (message.Id === messageId) {
        reqMessage = message;
        reqPath = channel;
        isChannelMessage = true;
      }
    }
  }

  for (const dm of data.dms) {
    for (const message of dm.message) {
      if (message.Id === messageId) {
        reqMessage = message;
        reqPath = dm;
        isDmMessage = true;
      }
    }
  }

  if (isChannelMessage === false && isDmMessage === false) {
    throw HTTPError(400, 'invalid messageId');
  } else if (reqMessage.isPinned === true) {
    if (isChannelMessage === true) {
      for (const owner of reqPath.ownerMembers) {
        if (owner.token.includes(token)) {
          reqMessage.isPinned = false;
          return {};
        }
      }
      throw HTTPError(403, 'authorised user does not have owner permissions');
    } else {
      let reqUser: any;
      for (const user of data.users) {
        if (user.token.includes(token)) {
          reqUser = user;
        }
      }
      if (reqPath.sender === reqUser.Id) {
        reqMessage.isPinned = false;
        return {};
      } else {
        throw HTTPError(403, 'authorised user does not have owner permissions');
      }
    }
  }

  throw HTTPError(400, 'message is already unpinned');
};

const messageSendlaterV1 = (channelId: number, message: string, timeSent: number, token: string): object => {
  const data = getData();
  let channelExists = false;
  let isMember = false;

  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'message less than 1 character or greater than 1000 characters');
  }

  if (timeSent < 0) {
    throw HTTPError(400, 'timeSent is a time in the past');
  }
  let reqUser: any;
  for (const user of data.users) {
    if (user.token.includes(token)) {
      reqUser = user;
    }
  }

  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      channelExists = true;
      for (const member of channel.allMembers) {
        console.log(member);
        if (member.uId === reqUser.Id) {
          isMember = true;
          setTimeout(function() {
            messageSendV2(token, channelId, message);
          }, timeSent);

          return {};
        }
      }
    }
  }

  if (channelExists === false) {
    throw HTTPError(400, 'invalid channelId');
  }

  if (isMember === false) {
    throw HTTPError(403, 'auhtorised user is not a member of the channel');
  }

  return {};
};

const messageSendlaterdmV1 = (dmId: number, message: string, timeSent: number, token: string): object => {
  const data = getData();
  let dmExists = false;
  let isMember = false;

  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'message less than 1 character or greater than 1000 characters');
  }

  if (timeSent < 0) {
    throw HTTPError(400, 'timeSent is a time in the past');
  }

  for (const dm of data.dms) {
    if (dm.dmId === dmId) {
      dmExists = true;
      for (const user of data.users) {
        if (user.token.includes(token)) {
          if (dm.members.includes(user.Id)) {
            isMember = true;
            setTimeout(function() {
              messageSendV2(token, dmId, message);
            }, timeSent);
            return {};
          }
        }
      }
    }
  }

  if (dmExists === false) {
    throw HTTPError(400, 'invalid dmId');
  }

  if (isMember === false) {
    throw HTTPError(403, 'auhtorised user is not a member');
  }

  return {};
};

export { messageSenddmV2, messageSendV2, messageEditV2, messageRemoveV2, messagePinV1, messageUnpinV1, messageSendlaterV1, messageSendlaterdmV1 };
