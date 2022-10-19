interface IContainer {
    children: JSX.Element | JSX.Element[]
}

function Container({ children }: IContainer) {
    return (
        <div className="container mx-auto p-4 md:px-16">{children}</div>
    )
}

export default Container