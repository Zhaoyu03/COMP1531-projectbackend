```javascript
// TODO: insert your data structure that contains users + channels info here
// You may also add a short description explaining your design
```

users = {
    Id : 123,
    email : 'example@email.com',
    password : 'password123',
    firstName : 'firstName',
    lastName : 'lastName',
    userStatus : 'Online or offline',
    userChannels : [1, 2, 3], // (array of channelIDs)
    token : "djkfgbhsd",
    profileImgUrl: 'string'
}
channels = {
    channelId : 1,
    name : 'AERO',
    allMembers : [123, 456, 789], // (array of UserIDs)
    ownerMembers: [123]
    isPublic : 1,  // (boolean 1 is private 0 public)
    standup: {
            isActive: true/false,
            startTime: number(seconds),
            length: number(seconds),
            messages: [array of msgId's], 
        }
    messages : [
        {
            userID : 123,
            messageContent : "Hello",
            timeSent : 2021-06-09 5:00 pm,
        }
    ],
}
dms = {
    dmId : 123,
    name : "ahandle1, bhandle2",  // does not include sender of dm
    sender : user.Id
    message : [
        {
            Id : 123,
            messageContent : "Hello",
            timeSent : 2021-06-09 5:00 pm,
            isPinned: true/false,
            reacts: [
                {
                    reactId: 123,
                    uIds: ['users that reacted',],
                    isThisUserReacted: true/false
            }],
        }]
}

notifications = {
    channelId: 123,
    dmId: 123,
    notificationMessage: 'message'
}



// Channels will be an array of each channel and act as a way of storing the data across all channels
// Users will be an array of each User and act as a way of storing the data across all users

Channels = [channel1, channel2, ...]
Users = [user1, user2, ...]
