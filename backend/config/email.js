module.exports = {
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  },
  from: {
    name: process.env.FROM_NAME,
    email: process.env.FROM_EMAIL
  }
};
