export interface INotification {
    status: "idle" | "loading" | "error" | "success"
    heading: string,
    message: string
    autoExpire: boolean
}

export interface INotificationExt extends INotification {
    id: number
    submittedAt: number
}

export type NotificationContextType = {
    notifications: INotificationExt[]
    addNotification: (notification: INotification) => number
    removeNotification: (id: number) => void
}