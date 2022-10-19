import { ThirdwebNftMedia, useAddress, useContract, useContractRead, useContractWrite, useNFT, useNFTDrop, useOwnedNFTs } from "@thirdweb-dev/react"
import { NFT, NFTDrop } from "@thirdweb-dev/sdk"

interface INFTViewer {
    stakingContract: any
    nftDropContract: NFTDrop | undefined
    nft: NFT
}

function NFTViewer({ stakingContract, nftDropContract, nft }: INFTViewer) {

    const address = useAddress()

    const { mutateAsync: deposit } = useContractWrite(stakingContract, "deposit")

    async function stakeNft(id: string) {
        if (!address) return;

        const isApproved = await nftDropContract?.isApproved(address, stakingContract.getAddress())

        if (!isApproved) {
            await nftDropContract?.setApprovalForToken(stakingContract.getAddress(), id)
        }
        await deposit([[id]])
    }

    return (
        <div className="p-2 rounded-3xl flex flex-col gap-2 w-fit">
            <div>
                <ThirdwebNftMedia metadata={nft.metadata} className="max-h-32 rounded-2xl" />
            </div>
            <h3>{nft.metadata.name}</h3>
            <button className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-400" onClick={() => stakeNft(nft.metadata.id)}>
                Stake
            </button>
        </div>
    )
}


interface INFTViewerGroup {
    stakingContract: any
}

function NFTViewerGroup({ stakingContract }: INFTViewerGroup) {

    const address = useAddress()
    const { mutateAsync: deposit } = useContractWrite(stakingContract, "deposit")
    const { data: nftCollection, isLoading } = useContractRead(stakingContract, "nftCollection")
    const { contract: nftDropContract } = useContract(nftCollection, "nft-drop");
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address)

    async function stakeAll() {
        if (!address) return;
        if (!ownedNfts) return;

        const isApproved = await nftDropContract?.isApproved(address, stakingContract.getAddress())

        if (!isApproved) {
            await nftDropContract?.setApprovalForAll(stakingContract.getAddress(), true)
        }

        const ids = ownedNfts?.map((nft) => nft.metadata.id)

        await deposit([ids])
    }

    return (
        <div className="flex gap-4">
            {ownedNfts && ownedNfts.length > 0 ?
                <div className="flex flex-col gap-4 border-2 border-slate-500 p-4 rounded-3xl">
                    <div className="flex justify-center">
                        <button className="bg-blue-500 text-white text-xl font-semibold uppercase rounded px-4 py-2 hover:bg-blue-400" onClick={() => stakeAll()}>
                            Stake All
                        </button>
                    </div>
                    <div className="flex gap-4">
                        {ownedNfts?.map((nft) => (<NFTViewer key={nft.metadata.id.toString()} stakingContract={stakingContract} nftDropContract={nftDropContract} nft={nft} />))}
                    </div>
                </div> : <></>}
                
        </div>
    )
}

export default NFTViewerGroup