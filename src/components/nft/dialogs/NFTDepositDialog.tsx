import { Dialog } from '@headlessui/react'
import { INFTDepositDialog } from '../../../types/dialogs'
import DialogWrapper from '../../dialogs/DialogWrapper'
import { FaArrowAltCircleUp, FaCheckCircle, FaHandPointUp, FaSpinner, FaTimes } from "react-icons/fa"
import { Contract } from 'ethers'
import { useContractFunction, useEthers } from '@usedapp/core'
import useNFTCollection from '../../../hooks/ERC721Staking/useNFTCollection'
import DropERC721 from "../../../abi/DropERC721.json"
import ERC721Staking from "../../../abi/ERC721Staking.json"
import { useEffect, useState } from 'react'
import useIsApprovedForAll from '../../../hooks/DropERC721/useIsApprovedForAll'
import StateDialog from '../../dialogs/StateDialog'

interface IWrapper {
    isOpen: boolean
    openModal: () => void
    closeModal: () => void
    children: JSX.Element | JSX.Element[]
}

function Wrapper({ isOpen, openModal, closeModal, children }: IWrapper) {
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
            <div className="mt-8">{children}</div>
        </DialogWrapper>
    )
}


export default function NFTDepositDialog({ tokenIds, contractAddress, isOpen, openModal, closeModal }: INFTDepositDialog) {

    const { account } = useEthers()
    const stakingContract = new Contract(contractAddress, ERC721Staking.abi)
    const nftDropAddress = useNFTCollection(contractAddress)
    const [nftDropContract, setNFTDropContract] = useState<Contract>()
    const isApprovedForAll = useIsApprovedForAll(nftDropAddress, account, contractAddress)

    const { state: stateApproval, send: approve } = useContractFunction(nftDropContract, 'setApprovalForAll', { transactionName: 'Set Approval For All' })
    const { state: stateDeposit, send: depositNFT } = useContractFunction(stakingContract, 'depositNFT', { transactionName: 'Deposit NFT' })

    useEffect(() => {
        const contract = new Contract(nftDropAddress, DropERC721)
        setNFTDropContract(contract)
    }, [nftDropAddress])

    const tokenIdsString = tokenIds.map(bn => ` #${bn.toString()}`).toString()

    async function approveAll() {
        await approve(contractAddress, true)
    }

    async function deposit() {
        await depositNFT(tokenIds)
    }

    if (stateApproval.status === "PendingSignature") {
        return (<Wrapper isOpen={isOpen} openModal={openModal} closeModal={closeModal}><StateDialog
            heading="Approve NFT Transfer"
            icon={<FaHandPointUp className="animate-pulse h-6 w-6" />}
            subheading={tokenIdsString}
            description="Confirm this transaction in your wallet"
        /></Wrapper>)
    }

    if (stateApproval.status === "Mining") {
        return (
            <Wrapper isOpen={isOpen} openModal={openModal} closeModal={closeModal}><StateDialog
                heading="Mining Approval"
                icon={<FaSpinner className="animate-spin h-6 w-6" />}
                subheading={tokenIdsString}
                description="Your transaction is processing"
            /></Wrapper>)
    }

    if (stateApproval.status === "Fail") {
        return (
            <Wrapper isOpen={isOpen} openModal={openModal} closeModal={closeModal}><StateDialog
                heading="Approval Failed"
                icon={<FaTimes className="h-6 w-6" />}
                subheading={stateApproval.transaction?.hash}
                description={stateApproval.errorMessage}
            /></Wrapper>)
    }

    if (stateDeposit.status === "PendingSignature") {
        return (
            <Wrapper isOpen={isOpen} openModal={openModal} closeModal={closeModal}><StateDialog
                heading="Deposit NFTs"
                icon={<FaHandPointUp className="animate-pulse h-6 w-6" />}
                subheading={tokenIdsString}
                description="Confirm this transaction in your wallet"
            /></Wrapper>)
    }

    if (stateDeposit.status === "Mining") {
        return (
            <Wrapper isOpen={isOpen} openModal={openModal} closeModal={closeModal}><StateDialog
                heading="Mining Deposit"
                icon={<FaSpinner className="animate-spin h-6 w-6" />}
                subheading={tokenIdsString}
                description="Your transaction is processing"
            /></Wrapper>)
    }

    if (stateDeposit.status === "Fail") {
        return (
            <Wrapper isOpen={isOpen} openModal={openModal} closeModal={closeModal}><StateDialog
                heading="Deposit Failed"
                icon={<FaTimes className="h-6 w-6" />}
                subheading={stateApproval.transaction?.hash}
                description={stateApproval.errorMessage}
            /></Wrapper>)
    }

    if (stateDeposit.status === "Success") {
        return (
            <Wrapper isOpen={isOpen} openModal={openModal} closeModal={closeModal}>
                <StateDialog
                    heading="Deposit Succeeded"
                    icon={<FaCheckCircle className="text-emerald-500 h-6 w-6" />}
                    subheading="NFTs successfully deposited"
                    description={stateDeposit.transaction?.hash}
                />
            </Wrapper>
        )
    }
    return (
        <Wrapper isOpen={isOpen} openModal={openModal} closeModal={closeModal}>
            <>
                <div className='text-center my-4'>
                    <h3 className="font-semibold uppercase text-emerld-900">Deposit NFT(s)</h3>
                    <h4 className="font-semibold uppercase text-slate-400">
                        {tokenIdsString}
                    </h4>
                </div>

                <div className="flex gap-4">
                    {!isApprovedForAll &&
                        <button onClick={approveAll} className="grow text-xl font-semibold text-white py-3 px-4 bg-emerald-500 rounded-md hover:border-emerald-500 hover:bg-emerald-400">
                            <div className="flex items-center justify-center gap-2">
                                <span>Approve</span>
                            </div>
                        </button>
                    }
                    <button onClick={deposit} disabled={!isApprovedForAll} className="grow text-xl font-semibold text-white py-3 px-4 bg-emerald-500 rounded-md hover:border-emerald-500 hover:bg-emerald-400 disabled:bg-slate-400">
                        <div className="flex items-center justify-center gap-2">
                            <FaArrowAltCircleUp className="h-4" />
                            <span>Deposit</span>
                        </div>
                    </button>
                </div>
            </>
        </Wrapper>
    )
}
