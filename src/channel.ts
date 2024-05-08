// import { ObjectTypeDeclaration } from 'typescript';
import { setData } from './dataStore';
import { getData } from './dataStore';
import { checkToken } from './token';

const ERROR = { error: 'error' };

const channelDetailsV3 = (token: string, channelId: number): object => {
  const data: any = getData();
  // checks if any users or channels exist.
  if (data.users.length < 1 || data.channels.length < 1) {
    return ERROR;
  }

  if (!checkToken(token)) {
    return ERROR;
  }

  const userMembers: any = [];
  const ownerMembers: any = [];
  // finds the user that owns the token.
  for (const user of data.users) {
    if (user.token.includes(token)) {
      for (const channel of data.channels) {
        if (channelId === channel.channelId) {
          // if (channel.allMembers.includes(user.Id)) {
          for (const member of channel.allMembers) {
            const userMember = {
              uId: member.uId,
              email: member.email,
              nameFirst: member.nameFirst,
              nameLast: member.nameLast,
              handleStr: member.handleStr,
              profileImgUrl: member.profileImgUrl
            };
            userMembers.push(userMember);
          }

          for (const member of channel.ownerMembers) {
            const ownerMember = {
              uId: member.uId,
              email: member.email,
              nameFirst: member.nameFirst,
              nameLast: member.nameLast,
              handleStr: member.handleStr,
              profileImgUrl: member.profileImgUrl
            };
            ownerMembers.push(ownerMember);
          }

          return {
            name: channel.name,
            isPublic: channel.isPublic,
            ownerMembers: ownerMembers,
            allMembers: userMembers,
          };
        // }
        }
      }
    }
  }
  return ERROR;
};

const channelJoinV3 = (token: string, channelId: number) => {
  const data: any = getData();

  // check if users object or channels object is empty.
  if (data.users.length < 1 || data.channels.length < 1) {
    return ERROR;
  }
  const requestingUser: any = [];

  if (!checkToken(token)) {
    return ERROR;
  }
  // finds the user that owns the token.
  // let reqUser;

  for (const user of data.users) {
    if (user.token.includes(token)) {
      const reqUser = {
        uId: user.Id,
        email: user.email,
        nameFirst: user.firstName,
        nameLast: user.lastName,
        handleStr: user.handle,
        profileImgUrl: user.profileImgUrl
      };
      for (const channel of data.channels) {
        if (channel.channelId === channelId) {
          for (const member of channel.allMembers) {
            if (member.uId === reqUser.uId) {
              // if this if statement is true, then user is already a member and
              // can't join again.
              return { error: 'error' };
            }
          }
          if (channel.isPublic === false) {
            if (requestingUser.permissions === 1) {
              const userJoin = {
                uId: reqUser.uId,
                email: reqUser.email,
                nameFirst: reqUser.nameFirst,
                nameLast: reqUser.nameLast,
                handleStr: reqUser.handleStr,
                profileImgUrl: reqUser.profileImgUrl
              };
              if (channel.allMembers === []) {
                channel.allMembers.push(userJoin);
                channel.ownerMembers.push(reqUser);
                setData(data);
                return {};
              }
              channel.allMembers.push(reqUser);
              setData(data);
              return {};
            }
            return ERROR;
          }
          channel.allMembers.push(reqUser);
          setData(data);
          return {};
        }
      }
    }
  }
  return ERROR;
};

const channelInviteV3 = (token: string, channelId: number, uId: number): object => {
  const data: any = getData();

  if (!checkToken(token)) {
    return ERROR;
  }

  let reqUser;
  for (const user of data.users) {
    if (user.token.includes(token)) {
      reqUser = user.Id;
    }
  }

  // Checks to see if channel exists
  let validChannel = false;
  for (const channel of data.channels) {
    if (channelId === channel.channelId) {
      validChannel = true;
    }
  }

  // if channel or user don't exist then return false
  if (validChannel === false) {
    return ERROR;
  }

  for (const user of data.users) {
    if (uId === user.Id) {
      for (const channel of data.channels) {
        // Checks if user is already a member or if authUser is not a member
        if (channelId === channel.channelId) {
          if (uId in channel.allMembers || !(reqUser in channel.allMembers)) {
            return ERROR;
          } else {
            channel.allMembers.push(uId);
            setData(data);
            return {};
          }
        }
      }
    }
  }

  // return error in case something wasn't tested
  return ERROR;
};

const channelMessagesV3 = (token: string, channelId: number, start: number): object => {
  const data: any = getData();
  if (!checkToken(token)) {
    return ERROR;
  }

  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      for (const user of data.users) {
        if (user.token.includes(token)) {
          for (const member of channel.allMembers) {
            if (member.uId === user.Id) {
              const Messages = channel.messages.reverse();
              const pagedMsgs: any = [];
              for (let i = start; i < Messages.length; i++) {
                const message = Messages[i];
                if (i === start + 50) {
                  return {
                    messages: pagedMsgs,
                    start: start,
                    end: start + 50,
                  };
                }
                const messageList = {
                  messageId: message.Id,
                  uId: message.userID,
                  message: message.message,
                  timeSent: message.timeSent
                };
                pagedMsgs.push(messageList);
              }
              return {
                messages: pagedMsgs,
                start: start,
                end: -1,
              };
            }
          }
        }
      }
    }
    if (start > channel.messages.length) {
      return ERROR;
    }
  }
  // if channel doesnt exist return error
  return ERROR;
};

const channelLeaveV2 = (token: string, channelId: number): object => {
  const data = getData();
  let reqUser: any;
  for (let j = 0; j < data.users.length; j++) {
    if (data.users[j].token.includes(token)) {
      reqUser = data.users[j].Id;
    }
  }

  let validChannel = false;
  let isMember = false;
  for (let i = 0; i < data.channels.length; i++) {
    if (data.channels[i].channelId === channelId) {
      validChannel = true;
      if (data.channels[i].allMembers.includes(reqUser)) {
        data.channels[i].allMembers.splice(data.channels[i].allMembers.indexOf(reqUser), 1);
        if (data.channels[i].ownerMembers.includes(reqUser)) {
          data.channels[i].ownerMembers.splice(data.channels[i].ownerMembers.indexOf(reqUser), 1);
        }
        isMember = true;
      }
    }
  }
  if (validChannel === false || isMember === false) {
    return { error: 'error' };
  }
  return {};
};

const channelAddownerV2 = (token: string, channelId: number, uId: number): object => {
  let validUser = false;
  const data = getData();
  for (const user of data.users) {
    if (user.Id === uId) {
      validUser = true;
    }
  }
  if (validUser === false) {
    return { error: 'error' };
  }

  let reqUser: any;
  for (const user of data.users) {
    if (user.token.includes(token)) {
      reqUser = user.Id;
    }
  }

  let validChannel = false;
  let isMember = false;
  let isOwner = false;
  let authUserHasPerms = false;
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      validChannel = true;
      if (channel.allMembers.includes(uId)) {
        isMember = true;
        if (channel.ownerMembers.includes(uId)) {
          isOwner = true;
        } else if (channel.ownerMembers.includes(reqUser)) {
          authUserHasPerms = true;
          channel.ownerMembers.push(uId);
        }
      }
    }
  }

  if (validChannel === false || isMember === false || isOwner === true || authUserHasPerms === false) {
    return { error: 'error' };
  }

  return {};
};

const channelRemoveownerV2 = (token: string, channelId: number, uId: number): object => {
  let validUser = false;
  const data = getData();
  for (const user of data.users) {
    if (user.Id === uId) {
      validUser = true;
    }
  }
  if (validUser === false) {
    return { error: 'error' };
  }

  let reqUser: any;
  for (const user of data.users) {
    if (user.token.includes(token)) {
      reqUser = user.Id;
    }
  }

  let validChannel = false;
  let isMember = false;
  let isOwner = false;
  let authUserHasPerms = false;
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      validChannel = true;
      if (channel.allMembers.includes(uId)) {
        isMember = true;
        if (channel.ownerMembers.includes(uId)) {
          isOwner = true;
        } else if (channel.ownerMembers.includes(reqUser)) {
          authUserHasPerms = true;
          channel.ownerMembers.splice(channel.ownerMembers.indexOf(uId), 1);
        }
      }
    }
  }

  if (validChannel === false || isMember === false || isOwner === true || authUserHasPerms === false) {
    return { error: 'error' };
  }
  return {};
};

export { channelDetailsV3, channelJoinV3, channelInviteV3, channelMessagesV3, channelLeaveV2, channelAddownerV2, channelRemoveownerV2 };
