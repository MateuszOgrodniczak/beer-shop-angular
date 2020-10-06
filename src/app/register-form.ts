export class RegisterForm {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public username: string,
    public role: string,
    public password: string,
    public confirmPassword: string
  ) {  }
}
