import { Dialog } from '@headlessui/react'
import { INFTWithdrawDialog } from '../../../types/dialogs'
import DialogWrapper from '../../dialogs/DialogWrapper'
import { FaCheckCircle, FaSpinner, FaSync, FaTimes } from "react-icons/fa"
import { FaArrowAltCircleDown } from "react-icons/fa"
import { useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import ERC721Staking from "../../../abi/ERC721Staking.json"
import { useState } from 'react'
import { BigNumber } from 'ethers'
import { TransactionError } from '@thirdweb-dev/sdk'

const tdClass = "text-sm text-right py-1 text-slate-900 border-slate-200"

interface IStatusView {
    tokenIds: number[]
}

function LoadingView({ tokenIds }: IStatusView) {
    return (
        <div className="flex flex-col gap-4 items-center text-center mb-8">
            <h4 className="text-sm text-slate-400 uppercase">Step 1 of 1</h4>
            <FaSpinner className="animate-spin h-6 w-6" />
            <h3 className="font-semibold uppercase text-slate-900">Withdrawing NFT(s)</h3>
            <h3 className="font-semibold uppercase text-slate-400">{tokenIds.map((num, key) => <span key={key}>{num}</span>)}</h3>
            <p className="text-slate-400">Confirm this transaction in your wallet</p>
        </div>
    )
}

function ErrorView({ error, withdraw }: { error: unknown, withdraw: () => void }) {
    return (
        <div className="flex flex-col gap-4 items-center text-center mb-8">
            <h4 className="text-sm text-slate-400 uppercase">Error</h4>
            <h3 className="font-semibold uppercase text-red-900">Oops! Something went wrong.</h3>
            <p className="text-slate-400 w-full text-xs font-mono">
                {(error as TransactionError).toString()}
            </p>
            <button
                type="button"
                className="rounded-md border border-transparent bg-amber-100 px-6 py-3 text-amber-900 hover:bg-amber-200 w-full text-base font-semibold"
                onClick={withdraw}
            >
                <div className="flex items-center justify-center gap-2">
                    <FaSync className="h-4" />
                    <span>Try again</span>
                </div>
            </button>
        </div>
    )
}

function SuccessView({ tokenIds }: IStatusView) {
    return (
        <div className="flex flex-col gap-4 items-center text-center mb-8">
            <h4 className="text-sm text-slate-400 uppercase">Congratulations</h4>
            <FaCheckCircle className="text-emerald-500 h-6 w-6" />
            <h3 className="font-semibold uppercase text-emerld-900">Withdrew NFT</h3>
            <h3 className="font-semibold uppercase text-slate-400">{tokenIds.map((num, key) => <span key={key}>{num}</span>)}</h3>
            <p className="text-slate-400">The NFT has been transferred to your wallet.</p>
        </div>
    )
}

export default function NFTWithdrawDialog({ contractAddress, tokenIds, isOpen, openModal, closeModal }: INFTWithdrawDialog) {

    const { contract } = useContract(contractAddress, ERC721Staking.abi)
    const { mutateAsync: withdrawNFT, status, error } = useContractWrite(contract, "withdrawNFT");

    async function withdraw() {
        await withdrawNFT([tokenIds])
    }

    return (
        <DialogWrapper isOpen={isOpen} openModal={openModal} closeModal={closeModal}>
            <div className='flex flex-col gap-8'>
                <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-slate-900 uppercase"
                >
                    <div className='flex items-center justify-between'>
                        <span>Withdraw NFTs</span>
                        <button onClick={closeModal}><FaTimes /></button>
                    </div>
                </Dialog.Title>

                {status === "loading" && <LoadingView tokenIds={tokenIds} />}
                {status === "error" && <ErrorView error={error} withdraw={withdraw} />}
                {status === "success" && <SuccessView tokenIds={tokenIds} />}
                {status === "idle" &&
                    <>
                        <div className='text-center'>
                            <h3 className="font-semibold uppercase text-slate-400">{tokenIds?.map((num, key) => <span key={key}>{num}</span>)}</h3>
                        </div>
                        <button
                            type="button"
                            className="rounded-md border border-transparent bg-amber-100 px-6 py-3 text-amber-900 hover:bg-amber-200 w-full text-base font-semibold disabled:border-slate-100 disabled:text-slate-300 disabled:bg-slate-100"
                            onClick={withdraw}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FaArrowAltCircleDown className="h-4" />
                                { tokenIds.length == 1 ? <span>Withdraw NFT</span> : <span>Withdraw {tokenIds.length} NFTs</span>}
                            </div>
                        </button>
                    </>}
            </div>
        </DialogWrapper>
    )
}
