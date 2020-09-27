import { CommunicationIdentityClient } from '@azure/communication-administration';

const main = async () => {
  console.log('Azure Communication Services - User Access Tokens Quickstart');
  const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
  if (!connectionString) return;
  console.log({ connectionString });
  const identityClient = new CommunicationIdentityClient(connectionString);
  console.log({ identityClient });
  const user = await createUser(identityClient);
  console.log({ user });
  const token = await issueToken(identityClient, user);
  console.log({ token });
};

// This code demonstrates how to fetch your connection string
// from an environment variable.

// Instantiate the user token client

const createUser = async (identityClient: CommunicationIdentityClient) => {
  let userResponse = await identityClient.createUser();
  console.log(`\nCreated a user with ID: ${userResponse.communicationUserId}`);
  return userResponse;
};

const issueToken = async (identityClient: CommunicationIdentityClient, userResponse) => {
  // Issue an access token with the "voip" scope for a new user
  let tokenResponse = await identityClient.issueToken(userResponse, ['voip']);
  const { token, expiresOn } = tokenResponse;
  console.log(`\nIssued a token with 'voip' scope that expires at ${expiresOn}:`);
  console.log(token);
  return tokenResponse;
};

// const removeTokens = async (identityClient: CommunicationIdentityClient, userResponse) => {
//   await identityClient.revokeTokens(userResponse);
//   console.log(
//     `\nSuccessfully revoked all tokens for user with Id: ${userResponse.communicationUserId}`,
//   );
// };

// const removeUser = async (identityClient: CommunicationIdentityClient, userResponse) => {
//   await identityClient.deleteUser(userResponse);
//   console.log(`\nDeleted the user with Id: ${userResponse.communicationUserId}`);
// };

main().catch(error => {
  console.log('Encountered and error');
  console.log(error);
});
