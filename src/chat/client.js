import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { endpoint, token1, user1, user2 } from './config.json';

// Your unique Azure Communication service endpoint
let endpointUrl = endpoint;
let userAccessToken = token1;

let chatClient = new ChatClient(endpointUrl, new AzureCommunicationUserCredential(userAccessToken));
console.log('Azure Communication Chat client created!');

async function createChatThread() {
  let createThreadRequest = {
    topic: 'Preparation for TEST conference',
    members: [
      {
        user: { communicationUserId: user1 },
        displayName: 'User1',
      },
      {
        user: { communicationUserId: user2 },
        displayName: 'User2',
      },
    ],
  };
  let chatThreadClient = await chatClient.createChatThread(createThreadRequest);
  let threadId = chatThreadClient.threadId;
  return threadId;
}

createChatThread().then(async threadId => {
  console.log(`Thread created:${threadId}`);
  // PLACEHOLDERS
  // <CREATE CHAT THREAD CLIENT>
  async function getChatThreadClient(threadId) {
    let chatThreadClient = await chatClient.getChatThreadClient(threadId);
    console.log(`Chat Thread client for threadId:${chatThreadClient.threadId}`);
    return chatThreadClient;
  }
  const chatThreadClient = await getChatThreadClient(threadId);
  // <RECEIVE A CHAT MESSAGE FROM A CHAT THREAD>
  // open notifications channel
  await chatClient.startRealtimeNotifications();
  // subscribe to new notification
  chatClient.on('chatMessageReceived', e => {
    console.log('Notification chatMessageReceived!');
    // your code here
  });

  // <SEND MESSAGE TO A CHAT THREAD>
  async function sendMessage(chatThreadClient) {
    let sendMessageRequest = {
      content: 'Hello Geeta! Can you share the deck for the conference?',
    };
    let sendMessageOptions = {
      priority: 'Normal',
      senderDisplayName: 'Jack',
    };
    let sendChatMessageResult = await chatThreadClient.sendMessage(
      sendMessageRequest,
      sendMessageOptions,
    );
    let messageId = sendChatMessageResult.id;
    console.log(`Message sent!, message id:${messageId}`);
  }

  await sendMessage(chatThreadClient);
  // <LIST MESSAGES IN A CHAT THREAD>
  let pagedAsyncIterableIterator = await chatThreadClient.listMessages();
  let nextMessage = await pagedAsyncIterableIterator.next();
  while (!nextMessage.done) {
    let chatMessage = nextMessage.value;
    console.log(`Message :${chatMessage.content}`);
    // your code here
    nextMessage = await pagedAsyncIterableIterator.next();
  }

  // <ADD NEW MEMBER TO THREAD>
  // <LIST MEMBERS IN A THREAD>
  // <REMOVE MEMBER FROM THREAD>
});
