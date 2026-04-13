import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../common/decorators/current-user.decorator';

@Controller('connections')
@UseGuards(JwtAuthGuard)
export class ConnectionsController {
  constructor(private connectionsService: ConnectionsService) {}

  @Post()
  sendRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateConnectionDto,
  ) {
    return this.connectionsService.sendRequest(user.id, dto);
  }

  @Get('received')
  getReceived(@CurrentUser() user: AuthenticatedUser) {
    return this.connectionsService.getReceived(user.id);
  }

  @Get('sent')
  getSent(@CurrentUser() user: AuthenticatedUser) {
    return this.connectionsService.getSent(user.id);
  }

  @Patch(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateConnectionDto,
  ) {
    return this.connectionsService.updateStatus(id, user.id, dto);
  }
}
