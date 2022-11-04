import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { tokenStakingAddress } from "../../contracts"
import ERC20Staking from "../../abi/ERC20Staking.json"
import { formatCommify } from "../../support/formatters"

export default function DelegatedTokens() {

    const address = useAddress()
    const { contract: stakingContract } = useContract(tokenStakingAddress, ERC20Staking.abi)
    const { data: balanceOf, status: statusBalanceOf } = useContractRead(stakingContract, "balanceOf", address)

    return (
        <div className="bg-slate-700 text-slate-50 p-4 rounded-lg">
        <div className="flex flex-col justify-between gap-4 h-full">
            <div className="flex justify-between items-center text-slate-50">
                <div>Delegated</div>
                {/* {statusBalanceOf === "success" && balanceOf.gt(0) && <TokenDepositButton />} */}
            </div>
            <div>
                {statusBalanceOf === "loading" && <div className="text-center animate-pulse">Loading balance</div>}
                {statusBalanceOf === "error" && <div className="text-center">Opps! Something unexpected happened. Please try again later.</div>}
                {statusBalanceOf === "success" && <div className="text-center text-3xl font-semibold">{formatCommify(balanceOf)}</div>}
            </div>
            <div className="text-xs text-slate-400 font-mono">{tokenStakingAddress}</div>
        </div>
    </div>
    )

}