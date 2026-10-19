import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import {
  CreateWorkerDto,
  WorkerAcceptInviteDto,
  UpdateWorkerPreferencesDto,
  UpdateWorkerDto,
} from './workers.types';
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

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_OWNER, UserRole.APPROVER)
  async createBulkWorkers(@Req() req: any, @Body() body: { workers: CreateWorkerDto[] }) {
    const data = await this.workersService.createBulkWorkers(req.user.companyId, body.workers || []);
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
  async acceptInvite(@Req() req: any, @Body() dto: WorkerAcceptInviteDto) {
    const data = await this.workersService.acceptInvite(dto, req.user);
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

  @Patch(':id/profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: { name?: string; email?: string; role?: string; country?: string },
  ) {
    const data = await this.workersService.updateProfile(id, dto);
    return { success: true, data };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_OWNER, UserRole.APPROVER)
  async updateWorker(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateWorkerDto,
  ) {
    const data = await this.workersService.updateWorker(req.user.companyId, id, dto);
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_OWNER, UserRole.APPROVER)
  async deleteWorker(@Req() req: any, @Param('id') id: string) {
    await this.workersService.deleteWorker(req.user.companyId, id);
    return { success: true, message: 'Worker deleted successfully' };
  }

  @Post(':id/pin')
  @UseGuards(JwtAuthGuard)
  async setTransactionPin(
    @Param('id') id: string,
    @Body() dto: { pin: string; currentPin?: string },
  ) {
    const data = await this.workersService.setTransactionPin(id, dto.pin, dto.currentPin);
    return { success: true, data };
  }
}
