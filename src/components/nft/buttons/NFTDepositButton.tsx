import { useEthers } from "@usedapp/core"
import { BigNumber } from "ethers"
import { useState } from "react"
import { FaArrowAltCircleUp } from "react-icons/fa"
import NFTDepositDialog from "../dialogs/NFTDepositDialog"

interface INFTDepositButton {
    contractAddress: string
    tokenIds: BigNumber[]
    text?: string
}

export default function NFTDepositButton({ contractAddress, tokenIds, text = "Deposit" }: INFTDepositButton) {

    const { account } = useEthers()

    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        
        setIsOpen(false)
    }

    function openModal() {
        
        setIsOpen(true)
    }

    return (
        <div>
            <button className="px-2 py-1 text-sm font-semibold uppercase rounded border-2 border-emerald-500 text-emerald-500 hover:border-emerald-400 hover:text-emerald-400 disabled:border-slate-100 disabled:text-slate-300 disabled:bg-slate-100" onClick={openModal} disabled={!account}>
                <div className="flex items-center gap-2">
                    <FaArrowAltCircleUp className="h-4" />
                    <span>{text}</span>
                </div>
            </button>
            <NFTDepositDialog isOpen={isOpen} openModal={openModal} closeModal={closeModal} tokenIds={tokenIds} contractAddress={contractAddress} />
        </div>
    )
}