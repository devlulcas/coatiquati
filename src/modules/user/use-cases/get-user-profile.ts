import type { UserWithoutPasswordDTO } from "../dtos/user.dto";
import { UserMapper } from "../mappers/user.mapper";
import type { UserRepositoryInterface } from "../repositories/user.repository";

export class GetUserProfile {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(id: string): Promise<UserWithoutPasswordDTO> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return UserMapper.toDTO(user);
  }
}