import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { faker } from '@faker-js/faker';
import userTypes from 'src/constants/user_types';
import statuses from 'src/constants/statuses';
import gender from 'src/constants/gender';

async function generateUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const users: CreateUserDto[] = [];

  for (let i = 0; i < 50; i++) {
    const createUserDto: CreateUserDto = {
      type: userTypes.user,
      status: faker.helpers.arrayElement(Object.values(statuses)),
      basic_info: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        dob: faker.date.birthdate(),
        gender: faker.helpers.arrayElement(Object.values(gender)),
      },
      contact_info: {
        email: faker.internet.email().toLowerCase(),
        mobile_numbers: [
          faker.string.numeric(10),
          faker.string.numeric(10),
          faker.string.numeric(10),
        ].slice(0, Math.floor(Math.random() * 3) + 1), // Randomly select up to 3 phone numbers
      },
      auth_info: {
        password: faker.internet.password(),
      },
    };

    users.push(createUserDto);
  }

  await usersService.createUsers(users);
  console.log('50 users have been created successfully!');
  await app.close();
}

generateUsers();
