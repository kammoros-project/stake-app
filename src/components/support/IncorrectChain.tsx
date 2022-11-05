import { useChainId } from "@thirdweb-dev/react"
import { desiredChainId } from "../../constants"

export default function IncorrectChain() {

    const chainId = useChainId()

    return (
        <div className="flex flex-col gap-4 items-center text-slate-500">
            <div>You are connected to chain {chainId}.</div>
            <div>You need to connect to chain {desiredChainId}.</div>
        </div>
    )
}