import { Tab } from "@headlessui/react"
import classNames from "../../support/classNames"

interface IAppTab {
    text: string
}

export default function AppTab({ text }: IAppTab) {
    return (
        <Tab
            className={({ selected }) =>
                classNames(
                    'w-full rounded-lg p-2 text-xs md:text-sm font-medium leading-5 text-slate-700 outline-0',
                    selected
                        ? 'bg-white shadow'
                        : 'text-slate-100 hover:bg-white/[0.12] hover:text-white'
                )
            }
        >
            <span>{text}</span>
        </Tab>
    )
}