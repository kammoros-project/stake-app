import { useEthers } from "@usedapp/core"
import { desiredChainId } from "../../constants"

export default function IncorrectChain() {

    const { chainId } = useEthers()

    return (
        <div className="flex flex-col gap-4 items-center text-slate-500">
            <div>You are connected to chain {chainId}.</div>
            <div>You need to connect to chain {desiredChainId}.</div>
        </div>
    )
}