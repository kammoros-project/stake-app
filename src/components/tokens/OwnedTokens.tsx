import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { tokenStakingAddress } from "../../contracts"
import ERC20Staking from "../../abi/ERC20Staking.json"
import ERC20 from "../../abi/KMCToken.json"
import { formatCommify } from "../../support/formatters"

export default function OwnedTokens() {

    const address = useAddress()
    const { contract: stakingContract } = useContract(tokenStakingAddress, ERC20Staking.abi)
    const { data: tokenAddress } = useContractRead(stakingContract, "token")
    const { contract: tokenContract } = useContract(tokenAddress, ERC20.abi)
    const { data: balanceOf, status: statusBalanceOf } = useContractRead(tokenContract, "balanceOf", address)

    return (
        <div className="bg-slate-700 text-slate-50 p-4 rounded-lg">
        <div className="flex flex-col justify-between gap-4 h-full">
            <div className="flex justify-between items-center text-slate-50">
                <div>Owned</div>
                {statusBalanceOf === "success" && balanceOf.gt(0) && <div>Token Deposit Button</div>}
            </div>
            <div>
                {statusBalanceOf === "loading" && <div className="text-center animate-pulse">Loading balance</div>}
                {statusBalanceOf === "error" && <div className="text-center">Opps! Something unexpected happened. Please try again later.</div>}
                {statusBalanceOf === "success" && <div className="text-center text-3xl font-semibold">{formatCommify(balanceOf)}</div>}
            </div>
            <div className="text-xs text-slate-400 font-mono">{tokenAddress}</div>
        </div>
    </div>
    )

}