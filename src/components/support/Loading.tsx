interface ILoading {
    width?: "w-full" | "w-8" | "w-12" | "w-16"
}

export default function Loading({ width = "w-full" }: ILoading) {

    const klass = `h-4 animate-pulse bg-slate-200 rounded-full ${width}`

    return (
        <div className="flex justify-end">
            <div className={klass} />
        </div>
    )
}