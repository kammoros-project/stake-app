import { Dialog } from '@headlessui/react'
import { INFTDepositDialog } from '../../../types/dialogs'
import DialogWrapper from '../../dialogs/DialogWrapper'
import { FaArrowAltCircleUp, FaCheckCircle, FaSpinner, FaTimes } from "react-icons/fa"
import { useAddress, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import ERC721Staking from "../../../abi/ERC721Staking.json"
import { TransactionError } from '@thirdweb-dev/sdk'
import { BigNumber } from 'ethers'

interface IError {
    error: TransactionError
}

interface IDepositView {
    tokenIds: BigNumber[]
}

function ApprovalLoading() {
    return (
        <div className="flex flex-col gap-4 items-center text-center mb-8">
            <h4 className="text-sm text-slate-400 uppercase">Step 1 of 2</h4>
            <FaSpinner className="animate-spin h-6 w-6" />
            <h3 className="font-semibold uppercase text-slate-900">Approve NFT(s) Deposit</h3>
            <p className="text-slate-400">Confirm this transaction in your wallet</p>
        </div>
    )
}

function ApprovalError({ error }: IError) {
    return (
        <div className="flex flex-col gap-4 items-center text-center mb-8">
            <h4 className="text-sm text-slate-400 uppercase">Error</h4>
            <h3 className="font-semibold uppercase text-red-900">Oops! Something went wrong.</h3>
            <p className="text-slate-400 w-full text-xs font-mono">
                {error.toString()}
            </p>
        </div>
    )
}

function DepositLoading({ tokenIds }: IDepositView) {
    return (
        <div className="flex flex-col gap-4 items-center text-center mb-8">
            <h4 className="text-sm text-slate-400 uppercase">Step 2 of 2</h4>
            <FaSpinner className="animate-spin h-6 w-6" />
            <h3 className="font-semibold uppercase text-slate-900">Deposit NFT(s)</h3>
            <h4 className="font-semibold uppercase text-slate-400">
                {tokenIds.map((bn, key) => <div key={key}>#{bn.toString()}, </div>)}
            </h4>
            <p className="text-slate-400">Confirm this transaction in your wallet</p>
        </div>
    )
}

function DepositError({ error }: IError) {
    return (
        <div className="flex flex-col gap-4 items-center text-center mb-8">
            <h4 className="text-sm text-slate-400 uppercase">Error</h4>
            <h3 className="font-semibold uppercase text-red-900">Oops! Something went wrong.</h3>
            <p className="text-slate-400 w-full text-xs font-mono">
                {error.toString()}
            </p>
        </div>
    )
}

function DepositSuccess({ tokenIds }: IDepositView) {
    return (
        <div className="flex flex-col gap-4 items-center text-center mb-8">
            <h4 className="text-sm text-slate-400 uppercase">Congratulations</h4>
            <FaCheckCircle className="text-emerald-500 h-6 w-6" />
            <h3 className="font-semibold uppercase text-emerld-900">Deposited NFT(s)</h3>
            <h4 className="font-semibold uppercase text-slate-400">
                {tokenIds.map((bn, key) => <div key={key}>#{bn.toString()}, </div>)}
            </h4>
            {/* <p className="text-slate-400">View your deposit in the Deposits section.</p> */}
        </div>
    )
}

export default function NFTDepositDialog({ tokenIds, contractAddress, isOpen, openModal, closeModal }: INFTDepositDialog) {

    const address = useAddress()
    const { contract: stakingContract } = useContract(contractAddress, ERC721Staking.abi)
    const { data: nftDropAddress, status: statusNFTDropAddress } = useContractRead(stakingContract, "nftCollection")
    const { contract: nftDropContract } = useContract(nftDropAddress, "nft-drop");
    const { mutateAsync: approve, isLoading: isApproving, status: statusApproval, error: errorApproval } = useContractWrite(nftDropContract, "setApprovalForAll");
    const { mutateAsync: depositNFT, isLoading: isDepositing, status: statusDeposit, error: errorDeposit } = useContractWrite(stakingContract, "depositNFT")

    async function deposit() {
        if (!address) return;

        const isApproved = await nftDropContract?.isApproved(address, contractAddress)

        if (!isApproved) {
            await approve([contractAddress, true])
        }

        await depositNFT([tokenIds])
    }

    return (
        <DialogWrapper isOpen={isOpen} openModal={openModal} closeModal={closeModal}>
            <Dialog.Title
                as="h3"
                className="text-lg font-semibold leading-6 text-slate-900 uppercase"
            >
                <div className='flex items-center justify-between'>
                    <span>Deposit</span>
                    <button onClick={closeModal}><FaTimes /></button>
                </div>
            </Dialog.Title>
            <div className="mt-8">
                {statusApproval == "error" && <ApprovalError error={errorApproval as TransactionError} />}
                {statusApproval == "loading" && <ApprovalLoading />}
                {statusDeposit == "error" && <DepositError error={errorDeposit as TransactionError} />}
                {statusDeposit == "loading" && <DepositLoading tokenIds={tokenIds} />}
                {statusDeposit == "success" && <DepositSuccess tokenIds={tokenIds} />}

                {(statusApproval == "idle" && statusDeposit == "idle") &&
                    <div className='text-center my-4'>
                        <h3 className="font-semibold uppercase text-emerld-900">Deposit NFT(s)</h3>
                        <h4 className="font-semibold uppercase text-slate-400">
                            {tokenIds.map((bn, key) => <div key={key}>#{bn.toString()}, </div>)}
                        </h4>
                    </div>
                }
                {!isApproving && !isDepositing &&
                    <button className="w-full text-xl font-semibold text-white py-3 px-4 bg-emerald-500 rounded-md hover:border-emerald-500 hover:bg-emerald-400" onClick={deposit}>
                        <div className="flex items-center justify-center gap-2">
                            <FaArrowAltCircleUp className="h-4" />
                            <span>Deposit</span>
                        </div>
                    </button>
                }
            </div>
        </DialogWrapper>
    )
}
