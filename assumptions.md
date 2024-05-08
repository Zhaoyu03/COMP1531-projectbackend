

 Assumptions:

******************************* MARK THESE *************************************

 - uId is gonna be in sequential order OR randomly number generated.
 
 - Assume there could be different data types, so we test/check for them.
 
 - For channelsListAllV1 & channelsListV1, we assume the authUserId could be invalid
 
 - For channelJoinV1 & channelDetailsV1, we assume that the user/channels key could be empty
   and return an error if it is.
   
 - We assume messages is stored inside of each object within the channels key/array of objects.
 
 - Assume that the userId in channelsCreateV1 is invalid and test for it.
 
********************************************************************************
