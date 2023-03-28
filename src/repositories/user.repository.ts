import type { CreatableUser, UpdatableUser, User, UserPreview } from "$src/entities/user.entity";

export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<User>;
  create(user: CreatableUser): Promise<User>;
  update(user: UpdatableUser): Promise<User>;
  delete(userId: string): Promise<UserPreview>;
  findById(id: string): Promise<User>;
  findAll(): Promise<UserPreview[]>;
} 

export class MockUserRepository implements UserRepositoryInterface {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async create(user: CreatableUser): Promise<User> {
    const newUser = {
      id: Math.random().toString(36),
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);

    return newUser;
  }

  async update(user: UpdatableUser): Promise<User> {
    if (user.id === undefined) {
      throw new Error('User id is required');
    }

    const userToUpdate = await this.findById(user.id);

    const updatedUser = {
      ...userToUpdate,
      ...user,
      updatedAt: new Date(),
    };

    this.users = this.users.map((user) => {
      if (user.id === userToUpdate.id) {
        return updatedUser;
      }

      return user;
    });

    return updatedUser;
  }

  async delete(userId: string): Promise<UserPreview> {
    const userToDelete = await this.findById(userId);

    this.users = this.users.filter((user) => user.id !== userId);

    return {
      id: userToDelete.id,
      email: userToDelete.email,
      firstName: userToDelete.firstName,
      lastName: userToDelete.lastName,
      createdAt: userToDelete.createdAt,
      updatedAt: userToDelete.updatedAt,
    };
  }

  async findById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async findAll(): Promise<UserPreview[]> {
    return this.users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}