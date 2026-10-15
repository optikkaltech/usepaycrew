import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('countries')
  getCountries() {
    return {
      success: true,
      data: this.locationsService.getCountries(),
    };
  }

  @Get('country/:code')
  getCountry(@Param('code') code: string) {
    return {
      success: true,
      data: this.locationsService.getCountry(code),
    };
  }

  @Get('states')
  getStates(@Query('country') country: string = 'NG') {
    return {
      success: true,
      data: this.locationsService.getStates(country),
    };
  }

  @Get('cities')
  getCities(@Query('country') country: string = 'NG', @Query('state') state: string = '') {
    return {
      success: true,
      data: this.locationsService.getCitiesOrLgas(country, state),
    };
  }

  @Get('lgas')
  getLgas(@Query('country') country: string = 'NG', @Query('state') state: string = '') {
    return {
      success: true,
      data: this.locationsService.getCitiesOrLgas(country, state),
    };
  }
}
