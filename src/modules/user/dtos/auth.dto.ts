import type { User } from "../entities/user.entity";

export type JWTToken = string;

export type Payload = {
  id: User['id'];
}

export type SignInDTO = {
  token: JWTToken;
}

export type UserSignInDTO =  Pick<User, 'email' | 'password'>;
 