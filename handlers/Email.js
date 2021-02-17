const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor({ name, to, from }, url) {
    this.name = name;
    this.to = to;
    this.from = from;
    this.url = url;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.SMTP_HOSTNAME,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async send(template, subject, message) {
    // 1) prepare template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      name: this.name,
      url: this.url,
      subject,
      message,
    });

    // 2) prepare options object
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.fromString(html),
      html,
    };

    // 3) prepare and send transport
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Think in JS Blog!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Think in JS | Password reset token (valid 1h)'
    );
  }

  async sendContactMessage(message) {
    await this.send(
      'contact',
      'Think in JS | New message from contact form',
      message
    );
  }
};
