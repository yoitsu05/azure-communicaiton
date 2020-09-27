import { CallClient, CallAgent } from '@azure/communication-calling';
import { AzureCommunicationUserCredential } from '@azure/communication-common';

let call;
const calleeInput = document.getElementById('callee-id-input');
const callButton = document.getElementById('call-button');
const hangUpButton = document.getElementById('hang-up-button');
const { token } = require('./config.json');

const callClient = new CallClient();
const tokenCredential = new AzureCommunicationUserCredential(token);
let callAgent;

callClient.createCallAgent(tokenCredential).then(agent => {
  callAgent = agent;
  callButton.disabled = false;
});

callButton.addEventListener('click', () => {
  // start a call
  const userToCall = calleeInput.value;
  call = callAgent.call([{ communicationUserId: userToCall }], {});
  // toggle button states
  hangUpButton.disabled = false;
  callButton.disabled = true;
});

hangUpButton.addEventListener('click', () => {
  // end the current call
  call.hangUp({ forEveryone: true });

  // toggle button states
  hangUpButton.disabled = true;
  callButton.disabled = false;
});
