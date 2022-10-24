import { FaTimes } from "react-icons/fa"
import Spin from "./Spin"
import { useContext, useEffect, useState } from "react"
import { NotificationContext } from "../../providers/NotificationProvider"
import useNotifications from "../../hooks/useNotifications"
import { INotificationExt } from "../../types/notification.types"
import { Transition } from "@headlessui/react"

function Notification({ id, status, heading, message }: INotificationExt) {

    const { removeNotification } = useNotifications()

    let klass = "p-3 text-sm rounded border-0"
    const errorClass = "text-red-900 bg-red-200 border-red-200"
    const successClass = "text-emerald-900 bg-emerald-200 border-emerald-200"
    const loadingClass = "text-blue-900 bg-blue-200 border-blue-200"

    switch (status) {
        case "error":
            klass = `${klass} ${errorClass}`
            break;
        case "success":
            klass = `${klass} ${successClass}`
            break;
        case "loading":
            klass = `${klass} ${loadingClass}`
            break;
        case "idle":
            klass = `${klass} ${loadingClass}`
            break;
        default:
            break;
    }

    return (
        <>
            <Transition
                show={true}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <div className={klass}>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                                {status == "loading" && <Spin />}
                                <h4 className="font-semibold">{heading}</h4>
                            </div>
                            <button onClick={() => removeNotification(id)}><FaTimes /></button>
                        </div>
                        <p>{message}</p>
                    </div>
                </div>
            </Transition>
        </>
    )

}

function NotificationCenter() {
    const { notifications } = useNotifications()

    return (
        <div className="relative">
            <div className="absolute top-0 right-0 z-10 w-96">
                <div className="flex flex-col gap-2">
                    {notifications?.map((notification: INotificationExt, key: number) => <Notification key={key} {...notification} />)}
                </div>
            </div>
        </div>
    )

}

export default NotificationCenter