import { tokenStakingAddress } from "../../constants"
import { formatCommify } from "../../support/formatters"
import TokenWithdrawAllButton from "./buttons/TokenWithdrawAllButton"
import { useEthers } from "@usedapp/core"
import useBalanceOf from "../../hooks/ERC20Staking/useBalanceOf"

export default function DelegatedTokens() {

    const { account } = useEthers()
    const balanceOf = useBalanceOf(tokenStakingAddress, account)

    return (
        <div className="bg-slate-700 text-slate-50 p-4 rounded-lg">
        <div className="flex flex-col justify-between gap-4 h-full">
            <div className="flex justify-between items-center text-slate-50">
            <div className="text-white text-xs font-semibold uppercase">Delegated</div>
                {balanceOf && balanceOf.gt(0) && <TokenWithdrawAllButton />}
            </div>
            <div>
                {!balanceOf && <div className="text-center animate-pulse">Loading...</div>}
                {balanceOf && <div className="text-center text-3xl font-semibold">{formatCommify(balanceOf)}</div>}
            </div>
            <div className="text-xs text-slate-400 font-mono">{tokenStakingAddress}</div>
        </div>
    </div>
    )

}