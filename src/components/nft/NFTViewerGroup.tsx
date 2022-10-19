import { ThirdwebNftMedia, useAddress, useContract, useContractRead, useContractWrite, useOwnedNFTs } from "@thirdweb-dev/react"
import { NFT, NFTDrop } from "@thirdweb-dev/sdk"
import { useEffect, useState } from "react"
import Spin from "../support/Spin"

interface INFTViewer {
    stakingContract: any
    nftDropContract: NFTDrop | undefined
    nft: NFT
    staked?: boolean
}

function NFTViewer({ stakingContract, nftDropContract, nft, staked = false }: INFTViewer) {

    const address = useAddress()

    const { mutateAsync: depositNFT } = useContractWrite(stakingContract, "depositNFT")
    const { mutateAsync: withdrawNFT } = useContractWrite(stakingContract, "withdrawNFT")

    const [withdrawing, setWithdrawing] = useState<boolean>(false)
    const [depositing, setDepositing] = useState<boolean>(false)

    async function stakeNft(id: string) {
        if (!address) return;
        setDepositing(true)

        const isApproved = await nftDropContract?.isApproved(address, stakingContract.getAddress())

        if (!isApproved) {
            await nftDropContract?.setApprovalForToken(stakingContract.getAddress(), id)
        }
        await depositNFT([[id]])
        setDepositing(false)
    }

    async function unstakeNft(id: string) {
        if (!address) return;
        setWithdrawing(true)
        await withdrawNFT([[id]])
        setWithdrawing(false)
    }

    return (
        <div className="py-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div>
                    <ThirdwebNftMedia metadata={nft.metadata} className="max-h-12" />
                </div>
                <div>
                    <h3 className="text-slate-50">{nft.metadata.name}</h3>
                </div>
            </div>
            {staked ? <button className="text-xs uppercase border border-orange-400 text-orange-400 rounded p-2 hover:bg-orange-400 hover:text-orange-800" onClick={() => unstakeNft(nft.metadata.id)}>
                <div className="flex justify-between items-center gap-2">
                    {withdrawing ? <Spin /> : <></>}
                    <span>Unstake</span>
                </div>
            </button> : <button className="text-xs uppercase border border-emerald-400 text-emerald-400 rounded p-2 hover:bg-emerald-400 hover:text-emerald-800" onClick={() => stakeNft(nft.metadata.id)}>
                <div className="flex justify-between items-center gap-2">
                    {depositing ? <Spin /> : <></>}
                    <span>Stake</span>
                </div>
            </button>}
        </div>
    )
}


interface INFTViewerGroup {
    stakingContract: any
}

function NFTViewerGroup({ stakingContract }: INFTViewerGroup) {

    const address = useAddress()
    const { mutateAsync: depositNFT } = useContractWrite(stakingContract, "depositNFT")
    const { mutateAsync: withdrawNFT } = useContractWrite(stakingContract, "withdrawNFT")
    const { data: nftCollection } = useContractRead(stakingContract, "nftCollection")
    const { contract: nftDropContract } = useContract(nftCollection, "nft-drop");
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address)

    const { data: depositedTokenIdsForAddress } = useContractRead(stakingContract, "depositedTokenIdsForAddress", address)
    const { data: stakedNfts } = useOwnedNFTs(nftDropContract, stakingContract.getAddress())

    const [myStakedNFTs, setMyStakedNFTs] = useState<NFT[]>([])

    const [withdrawing, setWithdrawing] = useState<boolean>(false)
    const [depositing, setDepositing] = useState<boolean>(false)

    useEffect(() => {
        if (stakedNfts && depositedTokenIdsForAddress) {
            const myStakedNFTs = []
            for (let i = 0; i < stakedNfts.length; i++) {
                const nft = stakedNfts[i];
                for (let j = 0; j < depositedTokenIdsForAddress.length; j++) {
                    const id = depositedTokenIdsForAddress[j];
                    if (id.toNumber() === parseInt(nft.metadata.id)) {
                        myStakedNFTs.push(nft)
                    }
                }
            }
            setMyStakedNFTs(myStakedNFTs)
        }

    }, [depositedTokenIdsForAddress, stakedNfts])

    async function stakeAll() {
        if (!address) return;
        if (!ownedNfts) return;
        setDepositing(true)
        const isApproved = await nftDropContract?.isApproved(address, stakingContract.getAddress())

        if (!isApproved) {
            await nftDropContract?.setApprovalForAll(stakingContract.getAddress(), true)
        }

        const ids = ownedNfts?.map((nft) => nft.metadata.id)

        await depositNFT([ids])
        setDepositing(false)
    }

    async function unstakeAll() {
        if (!address) return;
        if (!myStakedNFTs) return;
        setWithdrawing(true)
        const ids = myStakedNFTs?.map((nft) => nft.metadata.id)
        await withdrawNFT([ids])
        setWithdrawing(false)
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4 bg-slate-700 p-4">
                <div className="flex justify-end">
                    <button className="text-xs uppercase border border-emerald-400 text-emerald-400 rounded p-2 hover:bg-emerald-400 hover:text-emerald-800" onClick={() => stakeAll()}>
                        <div className="flex justify-between items-center gap-2">
                            {depositing ? <Spin /> : <></>}
                            <span>Stake All</span>
                        </div>
                    </button>
                </div>
                <div className="flex flex-col">
                    {ownedNfts?.map((nft) => (<NFTViewer key={nft.metadata.id.toString()} stakingContract={stakingContract} nftDropContract={nftDropContract} nft={nft} />))}
                </div>
            </div>
            <div className="flex flex-col gap-4 bg-slate-700 p-4">
                <div className="flex justify-end">
                    <button className="text-xs uppercase border border-orange-400 text-orange-400 rounded p-2 hover:bg-orange-400 hover:text-orange-800" onClick={() => unstakeAll()}>
                        <div className="flex justify-between items-center gap-2">
                            {withdrawing ? <Spin /> : <></>}
                            <span>Unstake All</span>
                        </div>
                    </button>
                </div>
                <div className="flex flex-col">
                    {myStakedNFTs?.map((nft) => (<NFTViewer key={nft.metadata.id.toString()} stakingContract={stakingContract} nftDropContract={nftDropContract} nft={nft} staked={true} />))}
                </div>
            </div>

        </div>
    )
}

export default NFTViewerGroup