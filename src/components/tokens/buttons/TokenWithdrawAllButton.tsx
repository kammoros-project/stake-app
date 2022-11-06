import { BigNumber } from "ethers"
import { useState } from "react"
import { FaArrowAltCircleDown } from "react-icons/fa"
import { tokenStakingAddress } from "../../../constants"
import TokenWithdrawAllDialog from "../dialogs/TokenWithdrawAllDialog"
import { useEthers } from "@usedapp/core"
import useBalanceOf from "../../../hooks/ERC20Staking/useBalanceOf"

export default function TokenWithdrawAllButton() {

    const { account } = useEthers()
    const balanceOf = useBalanceOf(tokenStakingAddress, account)
    
    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    function isDisabled(): boolean {
        if (!account) return true
        if (!(balanceOf instanceof BigNumber)) return true
        if (balanceOf.lte(0)) return true
        return false
    }

    return (
        <>
            <button className="px-2 py-1 text-sm font-semibold uppercase rounded border-2 border-amber-500 text-amber-500 hover:border-amber-400 hover:text-amber-400 disabled:border-slate-100 disabled:text-slate-300 disabled:bg-slate-100" onClick={openModal} disabled={isDisabled()}>
                <div className="flex items-center gap-2">
                    <FaArrowAltCircleDown className="h-4" />
                    <span>Withdraw All</span>
                </div>
            </button>
            <TokenWithdrawAllDialog isOpen={isOpen} openModal={openModal} closeModal={closeModal} />
        </>
    )
}