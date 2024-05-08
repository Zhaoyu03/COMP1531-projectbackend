import { getData, setData } from './dataStore';
import { messageSendV2 } from './message';
import { checkToken } from './token';
import { userProfileV3 } from './users';
import HTTPError from 'http-errors';
const standupStartV1 = (token: string, channelId: number, length: number): object => {
  const data = getData();
  const channel = data.channels.find(function(item: any) {
    if (item.channelId === channelId) {
      return true;
    } else {
      return false;
    }
  });
  if (channel === undefined || length < 0) {
    throw HTTPError(400, 'Cannot start a standup!');
  }
  if (channel.standup.isActive === true) {
    throw HTTPError(400, 'Cannot start a standup!');
  }
  if (checkToken(token) === false) {
    throw HTTPError(403, 'Cannot start a standup!');
  }
  const userId: any = data.users.find(function(item: any) {
    if (item.token.includes(token)) {
      return true;
    } else {
      return false;
    }
  }).Id;
  let judge = false;
  for (const member of channel.allMembers) {
    if (member.uId === userId) {
      judge = true;
      break;
    }
  }
  if (judge === false) {
    throw HTTPError(403, 'Cannot start a standup!');
  }
  channel.standup.isActive = true;
  channel.standup.startTime = Math.floor((new Date()).getTime() / 1000);
  channel.standup.length = length;
  channel.standup.messages = [];
  data.channels[data.channels.indexOf(channel)] = channel;
  setData(data);
  setTimeout(finishStandup, length * 1000, token, channelId);
  const timeFinish = channel.standup.startTime + length;
  return { timeFinish: timeFinish };
};

const standupActiveV1 = (token: string, channelId: number): object => {
  const data = getData();
  const channel = data.channels.find(function(item: any) {
    if (item.channelId === channelId) {
      return true;
    } else {
      return false;
    }
  });
  if (channel === undefined) {
    throw HTTPError(400, 'Cannot check whether a standup is active!');
  }
  if (checkToken(token) === false) {
    throw HTTPError(403, 'Cannot check whether a standup is active!');
  }
  const userId: any = data.users.find(function(item: any) {
    if (item.token.includes(token)) {
      return true;
    } else {
      return false;
    }
  }).Id;
  let judge = false;
  for (const member of channel.allMembers) {
    if (member.uId === userId) {
      judge = true;
      break;
    }
  }
  if (judge === false) {
    throw HTTPError(403, 'Cannot check whether a standup is active!');
  }
  if (channel.standup.isActive === true) {
    return {
      isActive: true,
      timeFinish: channel.standup.startTime + channel.standup.length
    };
  } else {
    return {
      isActive: false,
      timeFinish: null
    };
  }
};

const standupSendV1 = (token: string, channelId: number, message: string): object => {
  const data = getData();
  const channel = data.channels.find(function(item: any) {
    if (item.channelId === channelId) {
      return true;
    } else {
      return false;
    }
  });
  if (channel === undefined || message.length > 1000) {
    throw HTTPError(400, 'Cannot send a message to the standup!');
  }
  if (channel.standup.isActive === false) {
    throw HTTPError(400, 'Cannot send a message to the standup!');
  }
  if (checkToken(token) === false) {
    throw HTTPError(403, 'Cannot send a message to the standup!');
  }
  const userId: any = data.users.find(function(item: any) {
    if (item.token.includes(token)) {
      return true;
    } else {
      return false;
    }
  }).Id;
  let judge = false;
  for (const member of channel.allMembers) {
    if (member.uId === userId) {
      judge = true;
      break;
    }
  }
  if (judge === false) {
    throw HTTPError(403, 'Cannot send a message to the standup!');
  }
  const user: any = userProfileV3(token, userId);
  const handle = user.user.handleStr;
  const sendMessage = handle + ': ' + message;
  channel.standup.messages.push(sendMessage);
  data.channels[data.channels.indexOf(channel)] = channel;
  setData(data);
  return {};
};

const finishStandup = (token: string, channelId: number) => {
  const data = getData();
  const channel = data.channels.find(function(item: any) {
    if (item.channelId === channelId) {
      return true;
    } else {
      return false;
    }
  });
  const message = channel.standup.messages.join('\n');
  messageSendV2(token, channel.channelId, message);
  // initialize channel state
  const startTime: any = null;
  const messages: any[] = [];
  const standup = {
    isAcive: false,
    startTime: startTime,
    messages: messages
  };
  const newData = getData();
  newData.channels[data.channels.indexOf(channel)].standup = standup;
  setData(newData);
  console.log('Successfully send!');
};

export { standupStartV1, standupActiveV1, standupSendV1, finishStandup };
