export default () => ({
  jwtSecret: process.env.JWT_SECRET || '',
  bikerWebAppUrl: process.env.BIKER_WEB_APP_URL || '',
  senderWebAppUrl: process.env.SENDER_WEB_APP_URL || '',
});
