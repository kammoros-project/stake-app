import { Dialog } from '@headlessui/react'
import { IDepositDialog } from '../../../types/dialogs'
import DialogWrapper from '../../dialogs/DialogWrapper'
import { FaCheckCircle, FaSpinner, FaSync, FaTimes } from "react-icons/fa"
import { FaArrowAltCircleDown } from "react-icons/fa"
import { tokenStakingAddress } from '../../../constants'
import ERC20Staking from "../../../abi/ERC20Staking.json"
import { formatCommify } from '../../../support/formatters'
import { useContractFunction, useEthers } from '@usedapp/core'
import useBalanceOf from '../../../hooks/ERC20Staking/useBalanceOf'
import { Contract } from 'ethers'

function LoadingView() {
    return (
        <div className="flex flex-col gap-4 items-center text-center mb-8">
            <h4 className="text-sm text-slate-400 uppercase">Step 1 of 1</h4>
            <FaSpinner className="animate-spin h-6 w-6" />
            <h3 className="font-semibold uppercase text-slate-900">Withdrawing All Tokens</h3>
            {/* <h4 className="font-semibold uppercase text-slate-900">{formatCommify(amount)}</h4> */}
            <p className="text-slate-400">Confirm this transaction in your wallet</p>
        </div>
    )
}

function ErrorView({ error, withdraw }: { error: string | undefined, withdraw: () => void }) {
    return (
        <div className="flex flex-col gap-4 items-center text-center mb-8">
            <h4 className="text-sm text-slate-400 uppercase">Error</h4>
            <h3 className="font-semibold uppercase text-red-900">Oops! Something went wrong.</h3>
            <p className="text-slate-400 w-full text-xs font-mono">
                {error}
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

function SuccessView() {
    return (
        <div className="flex flex-col gap-4 items-center text-center mb-8">
            <h4 className="text-sm text-slate-400 uppercase">Congratulations</h4>
            <FaCheckCircle className="text-emerald-500 h-6 w-6" />
            <h3 className="font-semibold uppercase text-emerld-900">Withdrew All Tokens</h3>
            <p className="text-slate-400">Tokens have been transferred to your wallet.</p>
        </div>
    )
}

export default function TokenWithdrawAllDialog({ isOpen, openModal, closeModal }: IDepositDialog) {

    const { account } = useEthers()
    const balanceOf = useBalanceOf(tokenStakingAddress, account)
    const contract = new Contract(tokenStakingAddress, ERC20Staking.abi)
    const { state, send } = useContractFunction(contract, 'withdrawToken', { transactionName: 'Withdraw' })

    async function withdraw() {
        await send()
    }

    return (
        <DialogWrapper isOpen={isOpen} openModal={openModal} closeModal={closeModal}>
            <div className='flex flex-col gap-8'>
                <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-slate-900 uppercase"
                >
                    <div className='flex items-center justify-between'>
                        <span>Withdraw All</span>
                        <button onClick={closeModal}><FaTimes /></button>
                    </div>
                </Dialog.Title>
                {state.status === "Mining" && <LoadingView />}
                {state.status === "PendingSignature" && <LoadingView />}
                {state.status === "Fail" && <ErrorView error={state.errorMessage} withdraw={withdraw} />}
                {state.status === "Success" && <SuccessView />}
                {state.status === "None" &&
                    <>
                        <div className='text-center font-semibold'>
                            <div>{formatCommify(balanceOf)}</div>
                        </div>
                        <button
                            type="button"
                            className="rounded-md border border-transparent bg-amber-100 px-6 py-3 text-amber-900 hover:bg-amber-200 w-full text-base font-semibold disabled:border-slate-100 disabled:text-slate-300 disabled:bg-slate-100"
                            onClick={withdraw}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FaArrowAltCircleDown className="h-4" />
                                <span>Withdraw All</span>
                            </div>
                        </button>
                    </>}
            </div>
        </DialogWrapper>
    )
}
