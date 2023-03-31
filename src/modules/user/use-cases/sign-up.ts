import type { UserWithoutPasswordDTO } from "../dtos/user.dto";
import type { CreatableUser } from "../entities/user.entity";
import { UserMapper } from "../mappers/user.mapper";
import type { UserRepositoryInterface } from "../repositories/user.repository";
import { UserEmail } from "../value-objects/user-email";
import { UserPassword } from "../value-objects/user-password";

export class SignUp {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(data: CreatableUser): Promise<UserWithoutPasswordDTO> {
    const userPassword = await UserPassword.create(data.password);

    const userEmail = UserEmail.create(data.email);

    const userExists = await this.userRepository.findByEmail(userEmail.email);

    if (userExists) {
      throw new Error("User already exists");
    }

    const user = await this.userRepository.create({
      ...data,
      password: userPassword.password,
      email: userEmail.email,
    });

    return UserMapper.toDTO(user);
  }
}