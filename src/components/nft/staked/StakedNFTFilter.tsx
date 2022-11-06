import { BigNumber } from "ethers";
import { useState, useEffect } from "react";
import useTokenOfOwnerByIndex from "../../../hooks/DropERC721/useTokenOfOwnerByIndex";
import StakedNFT from "./StakedNFT";

interface IStakedNFTFilter {
    contractAddress: string
    nftDropAddress: string
    index: number
    depositedTokenIdsForAddress: BigNumber[]
}

export default function StakedNFTFilter({ contractAddress, nftDropAddress, index, depositedTokenIdsForAddress }: IStakedNFTFilter) {

    const tokenId = useTokenOfOwnerByIndex(nftDropAddress, contractAddress, index)
    const [isDelegated, setIsDelegated] = useState(false)

    useEffect(() => {
        if (tokenId) {
            const result = depositedTokenIdsForAddress.findIndex((value) => value.eq(tokenId))
            if (result !== -1) {
                setIsDelegated(true)
            }
        }
    }, [tokenId, depositedTokenIdsForAddress])

    if (isDelegated) {
        return <StakedNFT tokenId={tokenId} nftDropAddress={nftDropAddress} contractAddress={contractAddress} />
    } else {
        return <></>
    }

}