import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { IUserResponse } from './responses';
import {
  ChangePasswordDto,
  ResendOtpDto,
  SignUpDto,
  UpdateAccountStatusDto,
  UpdateUserProfileDto,
} from './dtos';
import { UserProfileEntity } from 'src/entities/user-profile.entity';
import { ISuccessMessage } from 'src/common/responses';
import { JwtService } from '@nestjs/jwt';
import { IAuthResponse } from '../auth/responses';
import { UserRoleEnum } from 'src/common/enum/user-role.enum';
import { SignupOtpEntity } from 'src/entities/signupOtp.entity';
import { differenceInHours, differenceInMinutes } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '../cloudinary/services/cloudinary.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(SignupOtpEntity)
    private readonly signupOtpRepository: Repository<SignupOtpEntity>,
    private jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
    private mailService: MailerService,
  ) {}

  public async createUser(body: SignUpDto): Promise<ISuccessMessage> {
    const user = await this.findUserByEmail(body.email);

    if (user) {
      throw new ConflictException('Email already exists.');
    }

    const createUser = this.userRepository.create({
      ...body,
      role: UserRoleEnum.USER,
    });
    const newUser = await this.userRepository.save(createUser);

    await this.userProfileRepository.save({
      user: { id: newUser.id } as UserEntity,
    });

    const otp = this.generateOtp(8);

    await this.signupOtpRepository.save({
      otp,
      user: { id: newUser.id },
    });

    await this.mailService.sendMail({
      to: body.email,
      from: 'no-reply@gmail.com',
      subject: 'Signup OTP',
      text: `You'r signup otp is: ${otp}`,
    });

    return {
      message:
        'Your opt is sent to the email address associated with your account.',
    };
    // const { id, role } = newUser;

    // const payload = { id, role };

    // const accessToken = this.jwtService.sign(payload, {
    //   secret: process.env.JWT_SECRET,
    // });

    // return {
    //   accessToken,
    //   role,
    // };
  }

  public async resendOtp(body: ResendOtpDto): Promise<ISuccessMessage> {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });

    await this.signupOtpRepository.delete({
      user: { id: user.id },
    });

    const otp = this.generateOtp(8);

    await this.signupOtpRepository.save({
      otp,
      user: { id: user.id },
    });

    await this.mailService.sendMail({
      to: body.email,
      from: 'no-reply@gmail.com',
      subject: 'Signup OTP',
      text: `You'r signup otp is: ${otp}`,
    });

    return {
      message:
        'Your opt is sent to the email address associated with your account.',
    };
  }

  public async findAllUsers(): Promise<IUserResponse[]> {
    const users = await this.userRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return users.map((user) => this.transformToUserResponse(user));
  }

  public async me(id: string): Promise<IUserResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        userProfile: true,
      },
    });

    return this.transformToUserResponse(user);
  }

  public async findTotalUsers(): Promise<number> {
    return await this.userRepository.count();
  }

  public async suspendOrReactiveUser(id: string): Promise<ISuccessMessage> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return { message: 'Invalid user.' };
    }

    if (user?.isSuspended) {
      await this.updateAccountStatus(id, false);
      return {
        message: 'User reactivated successfully.',
      };
    }
    await this.updateAccountStatus(id, true);
    return {
      message: 'User suspended successfully.',
    };
  }

  public async changePassword(
    id: string,
    body: ChangePasswordDto,
  ): Promise<ISuccessMessage> {
    const { newPassword } = body;
    const user = await this.userRepository.findOne({ where: { id } });

    const comparePassword = await bcrypt.compare(newPassword, user.password);

    if (comparePassword) {
      throw new BadRequestException(
        'New password is same as old password. Please enter a new password.',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(id, { password: hashedPassword });

    return {
      message: 'Password changed successfully.',
    };
  }

  public async verifyOtp(body: UpdateAccountStatusDto): Promise<IAuthResponse> {
    const { otp } = body;

    const userOtp = await this.signupOtpRepository.findOne({
      where: {
        otp,
      },
      relations: {
        user: true,
      },
    });

    if (!userOtp) {
      throw new BadRequestException('Invalid opt.');
    }

    const timeDifferenceInDate = differenceInMinutes(
      new Date(),
      userOtp.createdAt,
    );

    if (timeDifferenceInDate > 10) {
      throw new BadRequestException(
        'Otp has expired. Please resend the request.',
      );
    }

    await this.userRepository.update(
      { id: userOtp.user.id },
      { isVerified: true },
    );

    await this.signupOtpRepository.delete({
      user: { id: userOtp.user.id },
    });

    const { id, role } = userOtp.user;

    const payload = { id, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return { id, accessToken, role };
  }

  public async updateUserProfile(
    id: string,
    body: UpdateUserProfileDto,
    profile: Express.Multer.File,
  ): Promise<ISuccessMessage> {
    const { secure_url } = await this.cloudinaryService.uploadImage(
      profile,
      'profile-image',
    );
    await this.userProfileRepository.update(
      { user: { id } },
      { ...body, imageUrl: secure_url },
    );
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

  private async updateAccountStatus(id: string, isSuspended: boolean) {
    await this.userRepository.update({ id }, { isSuspended });
  }

  private generateOtp(length: number): number {
    const chars = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      otp += chars[randomIndex];
    }

    return parseInt(otp);
  }

  private transformToUserResponse(user: UserEntity): IUserResponse {
    const { id, name, email, role, isSuspended } = user;

    return {
      id,
      name,
      email,
      role,
      isSuspended,
      profile: user.userProfile?.imageUrl,
      address: user.userProfile?.address,
      phoneNumber: user.userProfile?.phoneNumber,
    };
  }
}
