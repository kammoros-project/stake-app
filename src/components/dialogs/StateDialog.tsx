interface IStateDialog {
    heading: string
    icon: JSX.Element
    subheading?: string
    description?: string
    action?: () => void
    actionLabel?: string

}

export default function StateDialog({ heading, icon, subheading, description, action, actionLabel }: IStateDialog) {

    return (
        <div className="flex flex-col gap-4 items-center text-center mb-8">
            <h1 className="text-sm text-slate-400 uppercase">{heading}</h1>
            <div>{icon}</div>
            <h2 className="font-semibold uppercase text-slate-900">{subheading}</h2>
            <p className="font-mono text-xs text-slate-400">{description}</p>
            {action && actionLabel && <button onClick={action}>{actionLabel}</button>}
        </div>
    )

}