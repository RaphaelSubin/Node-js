import { response } from 'express';
import models from '../models/index';
import database from '../models/index';
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
export default class Email {
  constructor() {
    this.config();
  }

  async config() {
    this.data = await models.settings.findByPk(1);
    if (this.data) {
      this.mailTransport = nodemailer.createTransport({
        host: this.data.smtpHost,
        port: this.data.smtpPort,
        secure: false,
        requireTLS: true,
        auth: {
          user: this.data.smtpUser,
          pass: this.data.smtpPassword,
        },
      });
      this.mailOptions = {
        from: `"CloudTrav" ${this.data.adminEmail}`,
        to: '',
        subject: '',
        html: '',
      };
    }
  }

  send(to, subject, message) {
    this.data = database.settings.findByPk(1);
    this.data.then(function(result) {
      let smtpPassword=result.smtpPassword;
      sgMail.setApiKey(smtpPassword)
      const msg = {
        to: to, // Change to your recipient
        from: result.adminEmail, // Change to your verified sender
        subject: subject,
        text: message,
        html: message,
      }
      sgMail 
      .send(msg)
        .then(() => {
          console.log('Email sent');
        })
        .catch((error) => {
          console.error(error)
        })
    });
  }
}
