import _ from "lodash";
import { createContext, useCallback, useState } from "react";
import { INotification, INotificationExt, NotificationContextType } from "../types/notification.types";

export const NotificationContext = createContext<NotificationContextType | null>(null)

interface INotificationProvider {
    children: JSX.Element | JSX.Element[]
}

const NotificationProvider = ({ children }: INotificationProvider) => {
    const [counter, setCounter] = useState<number>(0)
    const [notifications, setNotifications] = useState<INotificationExt[]>([])

    const addNotification = useCallback((notification: INotification) => {
        const ext: INotificationExt = { id: counter, submittedAt: (new Date()).getTime(), ...notification }
        setNotifications([...notifications, ext])
        setCounter(counter + 1)
        return ext.id
    }, [notifications, counter])

    const removeNotification = useCallback((id: number) => {
        _.remove(notifications, (obj) => obj.id === id)
        setNotifications([...notifications])
    }, [notifications])

    return <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>{children}</NotificationContext.Provider>
}

export default NotificationProvider