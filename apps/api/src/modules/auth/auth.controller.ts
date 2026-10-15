import { Controller, Post, Body, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthService, GoogleAuthDto } from './google-auth.service';
import { RegisterDto, LoginDto } from './auth.types';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Get('google/url')
  getGoogleAuthUrl(@Query('redirectUri') redirectUri?: string) {
    const data = this.googleAuthService.getGoogleAuthUrl(redirectUri);
    return { success: true, data };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.registerEmployer(dto);
    return { success: true, data: result };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return { success: true, data: result };
  }

  @Post('google')
  async googleAuth(@Body() dto: GoogleAuthDto) {
    const result = await this.googleAuthService.authenticateWithGoogle(dto);
    return { success: true, data: result };
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    const result = await this.authService.refreshToken(refreshToken);
    return { success: true, data: result };
  }


  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return { success: true, data: user };
  }

  @Get('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async generate2fa(@CurrentUser('id') userId: string) {
    const result = await this.authService.generate2faSecret(userId);
    return { success: true, data: result };
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  async enable2fa(
    @CurrentUser('id') userId: string,
    @Body('token') token: string,
  ) {
    const result = await this.authService.enable2fa(userId, token);
    return { success: true, data: result };
  }
}
