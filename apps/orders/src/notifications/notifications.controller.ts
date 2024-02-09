import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Sse,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  Observable,
  concat,
  finalize,
  from,
  fromEventPattern,
  interval,
  map,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { JwtAuthGuard } from 'apps/auth/src/services/jwt-auth.guard';

interface MessageEvent {
  data: string | object;
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('user/:id')
  findUserNotifications(@Param('id') id: number) {
    return this.notificationsService.fetchNotificationsForUser(+id);
  }

  @Get('user/count/:id')
  findUserNotifCount(@Param('id') id: number) {
    return this.notificationsService.fetchUnreadNotifForUser(+id);
  }
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Sse('count')
  notificationCount(@Req() req): Observable<MessageEvent> {
    const userId = (req as any).user.sub;

    // Observable that emits notifications at intervals
    const interval$ = interval(1000);

    // Observable that fetches unread notification count
    const fetchCount$ = interval$.pipe(
      switchMap(() =>
        this.notificationsService.fetchUnreadNotifForUser(userId),
      ),
      switchMap((count) => of({ data: { unreadCount: count.count } })),
      finalize(() => {
        console.log('Stream completed!');
      }),
    );

    // Concatenate observables with finalize and takeUntil
    return concat(fetchCount$, of(null)).pipe(
      takeUntil(
        fromEventPattern(
          (handler) => req.on('close', handler),
          (handler) => req.off('close', handler),
        ),
      ),
    );
  }
}
