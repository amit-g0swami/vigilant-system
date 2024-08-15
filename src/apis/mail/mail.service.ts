import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { MailRepository } from './mail.interface'
import { Logger } from '../../logger/logger.lib'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

class EmailService implements MailRepository.IMailService {
  public async sendSignupEmail(to: string, username: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Welcome to Our Service!',
      // eslint-disable-next-line max-len
      text: `Hello ${username},\n\nThank you for signing up for our service. We're glad to have you!`,
      // eslint-disable-next-line max-len
      html: `<p>Hello <b>${username}</b>,</p><p>Thank you for signing up for our service. We're glad to have you!</p>`
    }
    try {
      await transporter.sendMail(mailOptions)
    } catch (error) {
      Logger.error(error)
    }
  }
}

export const emailService = new EmailService()
