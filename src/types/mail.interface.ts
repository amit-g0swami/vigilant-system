export namespace MailRepository {
  export interface IMailService {
    sendSignupEmail(to: string, username: string): Promise<void>
  }
}
