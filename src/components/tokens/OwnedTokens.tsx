import { tokenStakingAddress } from "../../constants"
import { formatCommify } from "../../support/formatters"
import TokenDepositButton from "./buttons/TokenDepositButton"
import { useEthers, useTokenBalance } from "@usedapp/core"
import useToken from "../../hooks/ERC20Staking/useToken"

export default function OwnedTokens() {

    const { account } = useEthers()
    const tokenAddress = useToken(tokenStakingAddress)
    const balanceOf = useTokenBalance(tokenAddress, account)

    return (
        <div className="bg-slate-700 text-slate-50 p-4 rounded-lg">
        <div className="flex flex-col justify-between gap-4 h-full">
            <div className="flex justify-between items-center text-slate-50">
            <div className="text-white text-xs font-semibold uppercase">Owned</div>
                <div className="flex gap-2">
                    <a href="https://pancakeswap.finance/swap?outputCurrency=0x0974e5f2772a998301d7d6e9aca3f74d80eef709" target={"_blank"} rel="noreferrer" className="px-2 py-1 text-sm font-semibold uppercase rounded border-2 border-slate-500 text-slate-500 hover:border-slate-400 hover:text-slate-400">Purchase</a>
                    {balanceOf && balanceOf.gt(0) && <TokenDepositButton />}
                </div>
            </div>
            <div>
                {!balanceOf && <div className="text-center animate-pulse">Loading...</div>}
                {balanceOf && <div className="text-center text-3xl font-semibold">{formatCommify(balanceOf)}</div>}
            </div>
            <div className="text-xs text-slate-400 font-mono">{tokenAddress}</div>
        </div>
    </div>
    )

}