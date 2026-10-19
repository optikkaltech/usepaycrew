import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { SignContractDto } from './contracts.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getContract(@Param('id') id: string) {
    const data = await this.contractsService.getContract(id);
    return { success: true, data };
  }

  @Get('worker/:workerId')
  @UseGuards(JwtAuthGuard)
  async getWorkerContract(@Param('workerId') workerId: string) {
    const data = await this.contractsService.getWorkerContract(workerId);
    return { success: true, data };
  }

  @Post(':id/sign')
  @UseGuards(JwtAuthGuard)
  async signContract(
    @Param('id') id: string,
    @Body() dto: SignContractDto,
    @Req() req: any,
  ) {
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'PayCrew Web';
    const data = await this.contractsService.signContract(id, dto.typedName, ip, userAgent);
    return { success: true, data };
  }

  @Get(':id/download')
  async downloadContract(
    @Param('id') id: string,
    @Res() res: any,
  ) {
    const { buffer, filename } = await this.contractsService.generateContractPdf(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer);
  }
}
