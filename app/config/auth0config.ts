import Auth0 from 'react-native-auth0';
const auth0Config = {
  domain: 'dev-g8rnkaaa0ma7scup.us.auth0.com',
  clientId: 'aIbQXlEI5lHPz6onv3sck5qNFdLLtFBB',
  audience: 'https://dev-g8rnkaaa0ma7scup.us.auth0.com/api/v2/',
};

const auth0 = new Auth0(auth0Config);

export default auth0;
