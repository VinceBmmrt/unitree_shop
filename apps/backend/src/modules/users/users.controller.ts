import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('me')
  updateProfile(@CurrentUser('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(id, dto);
  }

  @Get('me/addresses')
  @ApiOperation({ summary: 'List current user addresses' })
  getAddresses(@CurrentUser('id') id: string) {
    return this.usersService.getAddresses(id);
  }

  @Post('me/addresses')
  @ApiOperation({ summary: 'Create a new address' })
  createAddress(@CurrentUser('id') id: string, @Body() dto: CreateAddressDto) {
    return this.usersService.createAddress(id, dto);
  }
}
