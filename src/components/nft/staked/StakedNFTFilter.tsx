import { useContract, useContractRead } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { useState, useEffect } from "react";
import StakedNFT from "./StakedNFT";

interface IStakedNFTFilter {
    contractAddress: string
    nftDropAddress: string
    index: number
    depositedTokenIdsForAddress: BigNumber[]
}

export default function StakedNFTFilter({ contractAddress, nftDropAddress, index, depositedTokenIdsForAddress }: IStakedNFTFilter) {

    const { contract: nftDropContract } = useContract(nftDropAddress, "nft-drop");
    const { data: tokenId } = useContractRead(nftDropContract, "tokenOfOwnerByIndex", contractAddress, index)

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