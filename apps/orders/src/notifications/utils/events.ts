import { CreateNotificationDto } from '../dto/create-notification.dto';
import { State } from '../../constants/state';
export interface NotificationCreatedEvent {
  data: CreateNotificationDto;
  names: {
    fromName: string;
    toName: string;
    assetModel: string;
  };
  kind: State;
}
