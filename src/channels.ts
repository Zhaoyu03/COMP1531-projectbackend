import { getData } from './dataStore';
import { setData } from './dataStore';
import { checkToken } from './token';

type channelsCreate = {
  channelId: number;
}

interface Channels {
  channels: {
    channelId: number;
    name: string;
  },
}

type error = {
  error: string
}

const channelsCreateV3 = (token: string, name: string, isPublic: boolean): channelsCreate | error => {
  const data = getData();
  const userData = data.users;
  if (token === null || token === undefined || name === null || name === undefined) {
    return {
      error: 'error'
    };
  }
  if (checkToken(token) === false) {
    return { error: 'error' };
  }

  let authUser;
  for (const user of userData) {
    if (user.token.includes(token)) {
      authUser = {
        uId: user.Id,
        email: user.email,
        nameFirst: user.firstName,
        nameLast: user.lastName,
        handleStr: user.handle,
        profileImgUrl: user.profileImgUrl
      };
      break;
    }
  }

  if (name.length < 1 || name.length > 20) {
    return {
      error: 'error'
    };
  }
  // check the name length limit

  const TmpChannel = data.channels;
  const usedCid: any = [];
  const messages: any[] = [];
  let startTime: any;
  let length: any;
  const standup = {
    isActive: false,
    startTime: startTime,
    length: length,
    messages: messages
  };
  for (let i = 0; i < TmpChannel.length; i++) {
    usedCid.push(TmpChannel[i].channelId);
  }
  for (let cid = 0; cid <= usedCid.length; cid++) {
    if (usedCid.includes(cid)) {
      continue;
      // make sure there are not two same channelId
    } else {
      // update datastore.js
      const newData =
            {
              channelId: cid,
              name: name,
              isPublic: isPublic,
              ownerMembers: [authUser],
              allMembers: [authUser],
              standup: standup,
              messages: messages
            };
      // make sure there are not two same channelId

      data.channels.push(newData);
      setData(data);
      return {
        channelId: cid,
      };
    }
  }
  return {
    error: 'error'
  };
};

interface Channel {
  channelId: number;
  name: string;
}

const channelsListV3 = (token: string): Channels | Channel | error => {
  // Provide an array of all channels (and their associated details) that the authorised user is part of.
  const data = getData();
  if (checkToken(token) === false) {
    return { error: 'error' };
  }

  const userChannels: any = [];
  // Finds authUser
  for (const user of data.users) {
    if (user.token.includes(token)) {
      for (const channel of data.channels) {
        for (const member of channel.allMembers) {
          // Checks to see if authUser is a member of the channel
          if (member.uId === user.Id) {
            const channelDetails: Channel = {
              channelId: channel.channelId,
              name: channel.name,
            };
            userChannels.push(channelDetails);
          }
        }
      }
    }
  }
  // Returns all channels that the authUser is a part of
  return { channels: userChannels };
};

const channelsListallV3 = (token: string): Channels | error => {
  // Provide an array of all channels, including private channels, (and their associated details)
  const data = getData();

  // Checks if token is valid
  if (checkToken(token) === false) {
    return { error: 'error' };
  }

  const channels: any = [];
  // Stores details of every channel in channelDetails
  for (const channel of data.channels) {
    const channelDetails = {
      channelId: channel.channelId,
      name: channel.name,
    };
    channels.push(channelDetails);
  }

  // Returns all the channels in UNSW Treats
  return { channels: channels };
};

export { channelsCreateV3, channelsListV3, channelsListallV3 };
