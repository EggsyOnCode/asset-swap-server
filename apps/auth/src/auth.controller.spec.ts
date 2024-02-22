import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as httpMocks from 'node-mocks-http';
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  const mockUserData = {
    username: 'hello',
    password: 'test123',
  };
  const mockRequest = httpMocks.createRequest();
  mockRequest.user = {
    id: 1,
    username: 'helloWorld',
    password: 'test123',
  };

  const mockJwtPayload = {
    username: 'hello',
    id: 1,
  };

  const mockUsersService = {
    validate: jest.fn().mockImplementation((username: string, pwd: string) => {
      return (
        username === mockUserData.username && pwd === mockUserData.password
      );
    }),
  };
  const mockAuthSerivce = {};

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        JwtService,
      ],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthSerivce)
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UsersService>(UsersService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('testing login', () => {
    it('validates the user correctly', () => {
      userService.validate('hello', 'test123');
    });
    it('payload is signed and jwt is returned', () => {
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6ImhlbGxvIn0.5JWPV8iFLIHOFb03RtmurzaXvbkYmldpvSvfGkALyys';

      const res = jwtService.sign(mockJwtPayload, {
        secret: 'hereismysecret',
      });
      expect(res).toEqual(jwt);
    });
  });
});
