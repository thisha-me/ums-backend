import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { User } from 'src/users/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private template: Handlebars.TemplateDelegate;

  private host: string;
  private port: number;
  private user: string;
  private pass: string;

  constructor(private readonly configService: ConfigService) {
    this.host = this.configService.get<string>('MAIL_HOST');
    this.port = this.configService.get<number>('MAIL_PORT');
    this.user = this.configService.get<string>('MAIL_USER');
    this.pass = this.configService.get<string>('MAIL_PASS');
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });

    const templatePath = process.cwd() + '/src/templates/deactivation.hbs';
    const source = fs.readFileSync(templatePath, 'utf8');
    this.template = Handlebars.compile(source);
  }

  async sendMail(user: User) {
    const emailContent = this.template({
      first_name: user.basic_info.first_name,
    });

    const info = await this.transporter.sendMail({
      from: `"Admin" <${this.user}>`, // sender address
      to: user.contact_info.email, // list of receivers
      subject: 'User Deactivation ✔', // Subject line
      html: emailContent, // html body
    });

    console.log('Message sent: %s', info.messageId);
  }
}
