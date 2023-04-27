import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { IUserResponse } from './responses';
import { SignUpDto, UpdateUserProfileDto } from './dtos';
import { UserProfileEntity } from 'src/entities/user-profile.entity';
import { ISuccessMessage } from 'src/common/responses';
import { JwtService } from '@nestjs/jwt';
import { IAuthResponse } from '../auth/responses';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    private jwtService: JwtService,
  ) {}

  public async createUser(body: SignUpDto): Promise<IAuthResponse> {
    const user = await this.findUserByEmail(body.email);

    if (user) {
      throw new ConflictException('Email already exists.');
    }

    const createUser = this.userRepository.create(body);
    const newUser = await this.userRepository.save(createUser);

    await this.userProfileRepository.save({
      user: { id: newUser.id } as UserEntity,
    });

    const { id, role } = newUser;

    const payload = { id, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      accessToken,
      role,
    };
  }

  public async updateUserProfile(
    id: string,
    body: UpdateUserProfileDto,
  ): Promise<ISuccessMessage> {
    await this.userProfileRepository.update({ user: { id } }, body);
    return { message: 'Profile updated successfully.' };
  }

  public async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async findUserById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } });
  }

  public async findSingleUserById(id: string): Promise<IUserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });

    return this.transformToUserResponse(user);
  }

  private transformToUserResponse(user: UserEntity): IUserResponse {
    const { id, name, email, role } = user;

    return {
      id,
      name,
      email,
      role,
    };
  }
}
