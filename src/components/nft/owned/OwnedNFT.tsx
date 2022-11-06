import { BigNumber } from "ethers"
import { useState, useEffect } from "react"
import useTokenURI from "../../../hooks/DropERC721/useTokenURI"
import NFTDepositButton from "../buttons/NFTDepositButton"

const REPLACE_FROM = "ipfs://"
const REPLACE_TO = "https://cloudflare-ipfs.com/ipfs/"

interface IOwnedNFT {
    contractAddress: string
    nftDropAddress: string
    tokenId: BigNumber
}

interface IMetadata {
    name: string
    image: string
}

export default function OwnedNFT({ contractAddress, nftDropAddress, tokenId }: IOwnedNFT) {

    const tokenURI = useTokenURI(nftDropAddress, tokenId)
    const [metadata, setMetadata] = useState<IMetadata>()

    useEffect(() => {
        const fetchMetadata = async (tokenURI: string) => {
            const httpURI = tokenURI.replace(REPLACE_FROM, REPLACE_TO)
            const response = await fetch(httpURI)
            const json = await response.json()
            setMetadata(json)
        }

        if (tokenURI) {
            fetchMetadata(tokenURI)
        }
    })

    return (
        <>
            {metadata ?
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <img src={metadata.image.replace(REPLACE_FROM, REPLACE_TO)} alt={metadata.name} className="w-12 h-12 rounded" />
                        <h3>{metadata.name}</h3>
                    </div>
                    <div>
                        <NFTDepositButton contractAddress={contractAddress} tokenIds={[tokenId]} />
                    </div>
                </div>
                : <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <div className="animate-pulse bg-slate-200 w-12 h-4 rounded-full" />
                    <div className="animate-pulse bg-slate-200 w-24 h-4 rounded-full" />
                </div>
                <div>
                    <div className="animate-pulse bg-slate-200 w-24 h-4 rounded-full" />
                </div>
            </div>}
        </>
    )
}