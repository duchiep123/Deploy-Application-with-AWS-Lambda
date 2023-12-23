// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
// https://atuyfeshke.execute-api.us-east-1.amazonaws.com/dev/todos
const apiId = 'nkb003jct5'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-a8p2f2ip5zuf4gy0.us.auth0.com',            // Auth0 domain
  clientId: 'IB3YoEdZxbGZAw2b5avQWbNriuDx5dJw',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
