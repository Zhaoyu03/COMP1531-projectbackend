import express from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import { channelInviteV3, channelDetailsV3, channelJoinV3, channelLeaveV2, channelAddownerV2, channelRemoveownerV2 } from './channel';
import { authLoginV3, authRegisterV3, authLogoutV2, authPasswordresetRequestV1, authPasswordresetResetV1 } from './auth';
import { channelsCreateV3, channelsListV3, channelsListallV3 } from './channels';
import {
  userProfileV3, usersAllV2, userProfileSetnameV2, userProfileSetemailV2, userProfileSethandleV2, adminUserPermChangeV1,
  adminUserRemoveV1, usersStatsV1, userStatsV1, userProfileUploadPhotoV1
} from './users';
import { clearV1 } from './other';
import { messageSendV2, messageEditV2, messageRemoveV2, messageSenddmV2 } from './message';
import { dmCreateV2, dmListV2, dmRemoveV2, dmLeaveV2, dmMessagesV2, dmDetailsV2 } from './dm';
import { standupStartV1, standupActiveV1, standupSendV1 } from './standup';
import { messageReactV1, messageUnreactV1, messageShareV1, searchV1 } from './message';
import { notificationsGetV1 } from './notification';
import { messagePinV1, messageUnpinV1, messageSendlaterV1, messageSendlaterdmV1 } from './message';
// Set up web app, use JSON
const app = express();
app.use(express.json());
// Use middleware that allows for access from other domains
app.use(cors());
const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// for logging errors
app.use(morgan('dev'));

// Example get request
app.get('/echo', (req, res, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// handles errors nicely
app.use(errorHandler());

// for logging errors
app.use(morgan('dev'));

app.use('/resources', express.static('resources'));
app.use('/images', express.static('profilePics'));

// start server
const server = app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

// ********************* ITE 1 FUNCTIONS ***********************

app.post('/auth/register/v3', (req, res) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(authRegisterV3(email, password, nameFirst, nameLast));
});

app.post('/auth/login/v3', (req, res) => {
  const { email, password } = req.body;
  res.json(authLoginV3(email, password));
});

app.get('/channel/details/v3', (req, res) => {
  const { channelId }: any = req.query;
  const token: any = req.headers.token;
  res.statusCode = 200;
  res.json(channelDetailsV3(token, channelId));
});

app.post('/channel/join/v3', (req, res) => {
  const { channelId } = req.body;
  const token: any = req.headers.token;
  res.statusCode = 200;
  res.json(channelJoinV3(token, channelId));
});

app.delete('/clear/v1', (req, res) => {
  clearV1();
  res.json({});
});

app.post('/channel/invite/v3', (req, res) => {
  const { channelId, uId } = req.body;
  const token: any = req.headers.token;
  res.json(channelInviteV3(token, channelId, uId));
});

app.get('/channel/messages/v3', (req, res) => {
  const token: any = req.headers.token;
  const channelId = parseInt(req.query.channelId as string);
  const start = parseInt(req.query.start as string);
  res.json(channelInviteV3(token, channelId, start));
});

app.get('/user/profile/v3', (req, res) => {
  const token: any = req.headers.token;
  const uId = parseInt(req.query.uId as string);
  res.json(userProfileV3(token, uId));
});

app.post('/channels/create/v3', (req, res) => {
  const { name, isPublic } = req.body;
  const token: any = req.headers.token;
  res.json(channelsCreateV3(token, name, isPublic));
});

app.get('/channels/list/v3', (req, res) => {
  const token: any = req.headers.token;
  res.json(channelsListV3(token));
});

app.get('/channels/listall/v3', (req, res) => {
  const token: any = req.headers.token;
  res.json(channelsListallV3(token));
});

// *************************************************************

app.post('/auth/logout/v2', (req, res) => {
  const token: any = req.headers.token;
  authLogoutV2(token);
  res.json({});
});
app.post('/channel/leave/v2', (req, res) => {
  const { channelId }: any = req.body;
  const token: any = req.headers.token;
  res.json(channelLeaveV2(token, channelId));
});
app.post('/channel/addowner/v2', (req, res) => {
  const { channelId, uId }: any = req.body;
  const token: any = req.headers.token;
  res.json(channelAddownerV2(token, channelId, uId));
});
app.post('/channel/removeowner/v2', (req, res) => {
  const { channelId, uId }: any = req.body;
  const token: any = req.headers.token;
  res.json(channelRemoveownerV2(token, channelId, uId));
});
app.post('/message/send/v2', (req, res) => {
  const { channelId, message }:any = req.body;
  const token: any = req.headers.token;
  res.json(messageSendV2(token, channelId, message));
});
app.put('/message/edit/v2', (req, res) : any => {
  const { channelId, message }:any = req.body;
  const token: any = req.headers.token;
  res.json(messageEditV2(token, channelId, message));
});
app.delete('/message/remove/v2', (req, res) => {
  const token: any = req.headers.token;
  const messageId: any = parseInt(req.query.messageId as string);
  res.json(messageRemoveV2(token, messageId));
});
app.post('/dm/create/v2', (req, res) => {
  const { uIds }: any = req.body;
  const token: any = req.headers.token;
  res.json(dmCreateV2(token, uIds));
});
app.get('/dm/list/v2', (req, res) => {
  const token: any = req.headers.token;
  res.json(dmListV2(token));
});
app.delete('/dm/remove/v2', (req, res) => {
  const token: any = req.headers.token;
  const dmId: any = parseInt(req.query.dmId as string);
  res.json(dmRemoveV2(token, dmId));
});
app.get('/dm/details/v2', (req, res) => {
  const token: any = req.headers.token;
  const dmId: any = parseInt(req.query.dmId as string);
  res.json(dmDetailsV2(token, dmId));
});
app.post('/dm/leave/v2', (req, res) => {
  const { dmId }: any = req.body;
  const token: any = req.headers.token;
  res.json(dmLeaveV2(token, dmId));
});
app.get('/dm/messages/v2', (req, res) => {
  const token: any = req.headers.token;
  const dmId: any = parseInt(req.query.dmId as string);
  const start: any = parseInt(req.query.start as string);
  res.json(dmMessagesV2(token, dmId, start));
});
app.post('/message/senddm/v2', (req, res) => {
  const { dmId, message }: any = req.body;
  const token: any = req.headers.token;
  res.json(messageSenddmV2(token, dmId, message));
});
app.get('/users/all/v2', (req, res) => {
  const token: any = req.headers.token;
  res.json(usersAllV2(token));
});
app.put('/user/profile/setname/v2', (req, res) => {
  const { nameFirst, nameLast }: any = req.body;
  const token: any = req.headers.token;
  res.json(userProfileSetnameV2(token, nameFirst, nameLast));
});
app.put('/user/profile/setemail/v2', (req, res) => {
  const { email }: any = req.body;
  const token: any = req.headers.token;
  res.json(userProfileSetemailV2(token, email));
});
app.put('/user/profile/sethandle/v2', (req, res) => {
  const { handleStr }: any = req.body;
  const token: any = req.headers.token;
  res.json(userProfileSethandleV2(token, handleStr));
});

// *************** ITE3 ROUTES ***************
app.post('/admin/userpermission/change/v1', (req, res) => {
  const { uId, permissionId }: any = req.body;
  const token: any = req.headers.token;
  res.json(adminUserPermChangeV1(token, uId, permissionId));
});
app.delete('/admin/user/remove/v1', (req, res) => {
  const { uId }: any = req.query;
  const token: any = req.headers.token as string;
  res.json(adminUserRemoveV1(token, uId));
});
app.get('/users/stats/v1', (req, res) => {
  const token: any = req.headers.token as string;
  res.json(usersStatsV1(token));
});
app.get('/user/stats/v1', (req, res) => {
  const token: any = req.headers.token as string;
  res.json(userStatsV1(token));
});
app.post('/user/profile/uploadphoto/v1', (req, res) => {
  const { imgUrl, xStart, yStart, xEnd, yEnd }: any = req.body as string;
  const token: any = req.headers.token as string;
  res.json(userProfileUploadPhotoV1(token, imgUrl, xStart, yStart, xEnd, yEnd));
});

app.post('/standup/start/v1', (req, res) => {
  const token: any = req.headers.token as string;
  const { channelId, length }: any = req.body;
  res.json(standupStartV1(token, channelId, length));
});
app.get('/standup/active/v1', (req, res) => {
  const token: any = req.headers.token as string;
  const channelId = parseInt(req.query.channelId as string);
  res.json(standupActiveV1(token, channelId));
});
app.post('/standup/send/v1', (req, res) => {
  const token: any = req.headers.token as string;
  const { channelId, message } = req.body;
  res.json(standupSendV1(token, channelId, message));
});
app.post('/auth/passwordreset/request/v1', (req, res) => {
  const { email } = req.body;
  res.json(authPasswordresetRequestV1(email));
});
app.post('/auth/passwordreset/reset/v1', (req, res) => {
  const { resetCode, newPassword } = req.body;
  res.json(authPasswordresetResetV1(resetCode, newPassword));
});
app.get('/notifications/get/v1', (req, res) => {
  res.json(notificationsGetV1());
});
app.get('/search/v1', (req, res) => {
  const queryStr: any = req.query.queryStr as string;
  res.json(searchV1(queryStr));
});
app.post('/message/share/v1', (req, res) => {
  const token: any = req.headers.token as string;
  const { ogMessageId, message, channelId, dmId }: any = req.body;
  res.json(messageShareV1(token, ogMessageId, message, channelId, dmId));
});
app.post('/message/react/v1', (req, res) => {
  const token: any = req.headers.token as string;
  const { messageId, reactId }: any = req.body;
  res.json(messageReactV1(token, messageId, reactId));
});
app.post('/message/unreact/v1', (req, res) => {
  const token: any = req.headers.token as string;
  const { messageId, reactId }: any = req.body;
  res.json(messageUnreactV1(token, messageId, reactId));
});

app.post('/message/pin/v1', (req, res) => {
  const token: any = req.headers.token as string;
  const { messageId }: any = req.body;
  res.json(messagePinV1(messageId, token));
});

app.post('/message/unpin/v1', (req, res) => {
  const token: any = req.headers.token as string;
  const { messageId }: any = req.body;
  res.json(messageUnpinV1(messageId, token));
});

app.post('/message/sendlater/v1', (req, res) => {
  const token: any = req.headers.token as string;
  const { channelId, message, timeSent }: any = req.body;
  res.json(messageSendlaterV1(channelId, message, timeSent, token));
});

app.post('/message/sendlaterdm/v1', (req, res) => {
  const token: any = req.headers.token as string;
  const { dmId, message, timeSent }: any = req.body;
  res.json(messageSendlaterdmV1(dmId, message, timeSent, token));
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
