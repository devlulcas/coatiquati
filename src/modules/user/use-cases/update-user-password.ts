import type { UpdateUserPasswordDTO, UserWithoutPasswordDTO } from "../dtos/user.dto";
import type { User } from "../entities/user.entity";
import { UserMapper } from "../mappers/user.mapper";
import type { UserRepositoryInterface } from "../repositories/user.repository";
import { UserPassword } from "../value-objects/user-password";



export class UpdateUserPassword {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(data: UpdateUserPasswordDTO): Promise<UserWithoutPasswordDTO> {
      if (!data.id) {
        throw new Error("User id not provided");
      }

      if (!data.password) {
        throw new Error("Password not provided");
      }

      if (!data.oldPassword) {
        throw new Error("Old password not provided");
      }

      const user = await this.userRepository.findById(data.id);

      if (!user) {
        throw new Error("User not found");
      }

      const userPassword = await UserPassword.create(data.password);

      const isTheSamePassword = await userPassword.compare(data.oldPassword);
    
      if (!isTheSamePassword) {
        throw new Error("Old password is not correct");
      }

      const updatedUser = await this.userRepository.update({
        password: userPassword.password,
      });

      return UserMapper.toDTO(updatedUser);
    }
}