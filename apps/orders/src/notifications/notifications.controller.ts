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
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  NotificationReadEvent,
  NotificationsService,
} from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  Observable,
  catchError,
  concat,
  finalize,
  forkJoin,
  fromEventPattern,
  interval,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { JwtAuthGuard } from 'apps/auth/src/services/jwt-auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
interface MessageEvent {
  data: string | object;
}

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getNotifications(@Res() res, @Req() req) {
    const userId = (req as any).user.userId;
    console.log(userId);
    return forkJoin({
      notifications:
        this.notificationsService.fetchNotificationsForUser(userId),
    }).pipe(
      tap((r) => {
        const unread = r.notifications
          .filter((n) => n.read === false)
          .map((n) => n.id);
        if (!unread.length) {
          return;
        }

        this.eventEmitter.emitAsync(
          'notification.read',
          new NotificationReadEvent(unread),
        );
      }),
      map((r) => res.status(HttpStatus.OK).json(r)),
      catchError((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }),
    );
  }

  @Get('user/:id')
  findUserNotifications(@Param('id') id: number) {
    return this.notificationsService.fetchNotificationsForUser(+id);
  }

  @Get('user/unread/:id')
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
  @Sse('/count')
  notificationCount(@Req() req): Observable<MessageEvent | string> {
    const userId = (req as any).user.userId;

    // Observable that emits notifications at intervals
    const interval$ = interval(2000);

    // Observable that fetches unread notification count
    const fetchCount$ = interval$.pipe(
      switchMap(() =>
        this.notificationsService.fetchUnreadNotifForUser(userId),
      ),
      switchMap((count) => of(JSON.stringify({ unreadCount: count.count }))),
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
