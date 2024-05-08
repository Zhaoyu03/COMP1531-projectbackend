import { getData, setData } from './dataStore';

export const notificationTagged = (token: string, messageId: number) => {
  const data = getData();
  for (const user of data.users) {
    if (user.token.includes(token)) {
      for (const channel of data.channels) {
        for (const message of channel.messages) {
          if (message.messageId === messageId) {
            const taggedMessage = message.messageContent.slice(0, 20);
            const newdata = {
              channelId: channel.channelId,
              dmId: -1,
              tagged: user.handle + ' tagged you in' + channel.name + ':' + taggedMessage
            };
            data.notification.push(newdata);
            setData(newdata);
          }
        }
      }
      for (const dm of data.dms) {
        for (const message of dm.message) {
          if (message.messageId === messageId) {
            const taggedMessage = message.messageContent.slice(0, 20);
            const newdata = {
              channelId: -1,
              dmId: dm.dmId,
              tagged: user.handle + ' tagged you in' + dm.name + ':' + taggedMessage
            };
            data.notification.push(newdata);
            setData(newdata);
          }
        }
      }
    }
  }
};
export const notificationReacted = (token: string, messageId: number) => {
  const data = getData();
  for (const user of data.users) {
    if (user.token.includes(token)) {
      for (const channel of data.channels) {
        for (const message of channel.message) {
          if (message.messageId === messageId) {
            const newdata = {
              channelId: channel.channelId,
              dmId: -1,
              reacted_message: user.handle + ' reacted to your message in' + channel.name
            };
            data.notification.push(newdata);
            setData(newdata);
          }
        }
      }
      for (const dm of data.dms) {
        for (const message of dm.message) {
          if (message.messageId === messageId) {
            const newdata = {
              channelId: -1,
              dmId: dm.dmId,
              reacted_message: user.handle + ' reacted to your message in' + dm.name
            };
            data.notification.push(newdata);
            setData(newdata);
          }
        }
      }
    }
  }
};
export const notificationAdd = (token: string, channelId: number, dmId: number) => {
  const data = getData();
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      for (const user of data.users) {
        if (user.token.includes(token)) {
          if (dmId === -1) {
            const newdata = {
              channelId: channelId,
              dmId: -1,
              added_to_a_channel: user.handle + ' added you to ' + channel.name
            };
            data.notification.push(newdata);
            setData(newdata);
          }
        }
      }
    }
  }
  for (const dm of data.dms) {
    if (dm.dmId === dmId) {
      for (const user of data.users) {
        if (user.token.includes(token)) {
          if (channelId === -1) {
            const newdata = {
              channelId: -1,
              dmId: dmId,
              added_to_a_channel: user.handle + ' added you to ' + dm.name
            };
            data.notification.push(newdata);
            setData(newdata);
          }
        }
      }
    }
  }
};
export const notificationsGetV1 = () => {
  const data = getData();
  if (data.notification.length > 20) {
    const newdata = delete data.notification[0];
    data.notification.push(newdata);
    setData(newdata);
  }
  return data.notification;
};
