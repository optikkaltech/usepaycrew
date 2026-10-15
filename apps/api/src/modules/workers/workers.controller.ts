import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerDto, WorkerAcceptInviteDto, UpdateWorkerPreferencesDto } from './workers.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@paycrew/shared-types';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_OWNER, UserRole.APPROVER)
  async createWorker(@Req() req: any, @Body() dto: CreateWorkerDto) {
    const data = await this.workersService.createWorker(req.user.companyId, dto);
    return { success: true, data };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getWorkers(@Req() req: any) {
    const data = await this.workersService.getWorkersByCompany(req.user.companyId);
    return { success: true, data };
  }

  @Get('invite/:token')
  async getByInviteToken(@Param('token') token: string) {
    const data = await this.workersService.getWorkerByInviteToken(token);
    return { success: true, data };
  }

  @Post('accept-invite')
  async acceptInvite(@Body() dto: WorkerAcceptInviteDto) {
    const data = await this.workersService.acceptInvite(dto);
    return { success: true, data };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getWorker(@Param('id') id: string) {
    const data = await this.workersService.getWorkerById(id);
    return { success: true, data };
  }

  @Patch(':id/preferences')
  @UseGuards(JwtAuthGuard)
  async updatePreferences(
    @Param('id') id: string,
    @Body() dto: UpdateWorkerPreferencesDto,
  ) {
    const data = await this.workersService.updatePreferences(id, dto.autoCashoutEnabled);
    return { success: true, data };
  }
}
