export class LoginDto {
  email: string;
  password: string;
}

export class RegisterDto extends LoginDto {
  username: string;
  confirmPassword: string;
}
