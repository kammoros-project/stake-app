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
        <>
            <ThirdwebNftMedia metadata={nft.metadata} />
            <h3>{nft.metadata.name}</h3>
            <button onClick={() => stakeNft(nft.metadata.id)}>
                Stake
            </button>
        </>
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
        <>
            <div>
                <button onClick={() => stakeAll()}>
                    Stake All
                </button>
            </div>
            <div>
                {ownedNfts?.map((nft) => (<NFTViewer key={nft.metadata.id.toString()} stakingContract={stakingContract} nftDropContract={nftDropContract} nft={nft} />))}
            </div>
        </>
    )
}

export default NFTViewerGroup