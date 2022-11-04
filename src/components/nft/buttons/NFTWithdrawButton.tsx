import { useAddress } from "@thirdweb-dev/react"
import { BigNumber } from "ethers"
import { useState } from "react"
import { FaArrowAltCircleDown } from "react-icons/fa"
import NFTWithdrawDialog from "../dialogs/NFTWithdrawDialog"

interface INFTWithdrawButton {
    contractAddress: string
    tokenIds: BigNumber[]
    text?: string
}

export default function NFTWithdrawButton({ contractAddress, tokenIds, text = "Withdraw" }: INFTWithdrawButton) {

    const address = useAddress()

    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        
        setIsOpen(false)
    }

    function openModal() {
        
        setIsOpen(true)
    }

    function isDisabled(): boolean {
        if (!address) return true
        return false
    }

    return (
        <>
            <button className="px-2 py-1 text-sm font-semibold uppercase rounded border-2 border-amber-500 text-amber-500 hover:border-amber-400 hover:text-amber-400 disabled:border-slate-100 disabled:text-slate-300 disabled:bg-slate-100" onClick={openModal} disabled={isDisabled()}>
                <div className="flex items-center gap-2">
                    <FaArrowAltCircleDown className="h-4" />
                    <span>{text}</span>
                </div>
            </button>
            <NFTWithdrawDialog contractAddress={contractAddress} tokenIds={tokenIds} isOpen={isOpen} openModal={openModal} closeModal={closeModal} />
        </>
    )
}