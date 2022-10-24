import { useContext } from "react"
import { NotificationContext } from "../providers/NotificationProvider"
import { INotificationExt, NotificationContextType } from "../types/notification.types"
import useInterval from "./useInterval"

const expirationPeriod = 5000
const checkInterval = 1000

function getExpiredNotifications(notifications: INotificationExt[], expirationPeriod: number) {
    if (expirationPeriod === 0) {
      return []
    }
    const timeFromCreation = (creationTime: number) => Date.now() - creationTime
  
    return notifications.filter((notification) => notification.autoExpire).filter((notification) => timeFromCreation(notification.submittedAt) >= expirationPeriod)
  }

  function useNotifications() {
    const { addNotification, notifications, removeNotification } = useContext(NotificationContext) as NotificationContextType

    useInterval(() => {
        const expiredNotification = getExpiredNotifications(notifications, expirationPeriod)
        for (const notification of expiredNotification) {
          removeNotification(notification.id)
        }
      }, checkInterval)

      return {
        notifications,
        addNotification,
        removeNotification
      }
  }

  export default useNotifications