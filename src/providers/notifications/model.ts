import type { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider'
import { INotification, INotificationExt } from '../../types/notification.types'

export type AddNotificationPayload = {
  notification: INotification
}

export type RemoveNotificationPayload = {
  notificationId: number
}

export type Notifications = INotificationExt[]

/**
 * @internal Intended for internal use - use it on your own risk
 */
export const DEFAULT_NOTIFICATIONS: Notifications = []