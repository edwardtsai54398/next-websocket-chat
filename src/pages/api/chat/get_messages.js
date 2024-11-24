import {withValidation} from "../withValidation";
import Conversation from "@/lib/db/Conversation";
import Message from "@/lib/db/Message.js";
import User from '@/lib/db/User.js'

const fakeData = {
  status: 1,
  result:{
    "conversationId": "235ee298-6dd9-4bf2-b8a1-7a76de1b3c2e",
    "messages": [
      {
        "messageId": "35684d91-70d9-4a44-af68-9475da1e9b47",
        "content": "Sample message -3",
        "speakerName": "User Me",
        "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
        "timestamp": 1727834000,
        "readUser": [
          "eb481589-eb13-4045-b418-35cc3183f5f5",
          "33510e79-2247-46e5-bc14-46a47b083914"
        ]
      },
      {
        "messageId": "35cf3541-70d9-4a44-af68-9475da1e9b47",
        "content": "Sample message -2",
        "speakerName": "User Me",
        "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
        "timestamp": 1727834200,
        "readUser": [
          "eb481589-eb13-4045-b418-35cc3183f5f5",
          "33510e79-2247-46e5-bc14-46a47b083914"
        ]
      },
      {
        "messageId": "35cfwd91-70d9-4a44-af68-9475da1e9b47",
        "content": "Sample message -1",
        "speakerName": "User Me",
        "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
        "timestamp": 1727834300,
        "readUser": [
          "eb481589-eb13-4045-b418-35cc3183f5f5",
          "33510e79-2247-46e5-bc14-46a47b083914"
        ]
      },
      {
        "messageId": "35cfwd91-70d9-4kj-af68-9475da1e9b47",
        "content": "Sample message 0",
        "speakerName": "User Me",
        "speakerId": "eb481589-eb13-4045-b418-35cc3183f5f5",
        "timestamp": 1727834400,
        "readUser": [
          "eb481589-eb13-4045-b418-35cc3183f5f5",
          "33510e79-2247-46e5-bc14-46a47b083914"
        ]
      },
    ]
  }
}

const handler = async(req, res) => {
  if (process.env.NEXT_CONNECT_DB === "false") {
    res.status(200).json(fakeData);
  } else {
    const {conversationId, oldestMessageId} = req.body;
    const userId = req.headers["user-id"];
    if(
      conversationId &&
      typeof conversationId === "string" &&
      oldestMessageId &&
      typeof oldestMessageId === "string"
    ){
      try{
        const conversation = await Conversation.findOne({conversationId})
        if(conversation){
          const clientOldestMsg = await Message.find({messageId: oldestMessageId}).lean();
          const olderMessages = await Message.find(
            {
              inConversation: conversationId,
              timestamp: {$lt: clientOldestMsg.timestamp},
            }).sort({timestamp: -1}).limit(50).lean()
          const members = await User.find({userId: {$in: conversation.members}})

          let messages = await Promise.all(olderMessages.map(async (message) => {
            let speakerName = members.find(m => m.userId === message.speaker).userName
            let feedbackContent = null
            if(message.feedback){
              let feedbackMsg = olderMessages.find(m => m.messageId === message.feedback)
              if(!feedbackMsg) {
                feedbackMsg = await Message.fineOne({messageId: message.feedback})
              }
              feedbackContent = {
                messageId: feedbackMsg.messageId,
                content: feedbackMsg.content,
                speakerId: feedbackMsg.speaker,
                speakerName: members.find(u => u.userId === feedbackMsg.speaker).userName
              }
            }
            return {
              messageId: message.messageId,
              content: message.content,
              speakerId: message.speaker,
              speakerName,
              timestamp: message.timestamp,
              readUser: message.readUser,
              feedback: feedbackContent
            }
          }))

          res.status(200).json({
            status: 1,
            result:{
              conversationId,
              messages
            }
          })
        }else{
          res.status(404).json({
            status: 0,
            errorMessage: "chat not exists",
          });
        }
      } catch(error) {
        console.error("ERROR get_messages", error);
      }
    }else{
      res.status(403).json({
        status: 0,
        errorMessage: "Wrong data format",
      });
    }
  }
}

export default withValidation(handler, "POST")