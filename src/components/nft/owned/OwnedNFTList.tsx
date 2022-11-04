import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { BigNumber } from "ethers"
import { useState, useEffect } from "react"
import ERC721Staking from "../../../abi/ERC721Staking.json"
import tokenOfOwnerByIndexes from "../../../helpers/tokenOfOwnerByIndexes"
import NFTDepositButton from "../buttons/NFTDepositButton"
import OwnedNFT from "./OwnedNFT"

interface IStakedNFTList {
    contractAddress: string
}

export default function OwnedNFTList({ contractAddress }: IStakedNFTList) {

    const address = useAddress()
    const { contract: stakingContract } = useContract(contractAddress, ERC721Staking.abi)
    const { data: nftDropAddress } = useContractRead(stakingContract, "nftCollection")
    const { contract: nftDropContract } = useContract(nftDropAddress, "nft-drop");
    const { data: balanceOf, status: statusBalanceOf } = useContractRead(nftDropContract, "balanceOf", address)
    const [tokenIds, setTokenIds] = useState<BigNumber[]>()

    useEffect(() => {

        async function fetchTokenIds(array: number[]) {
            const tokenIds = await tokenOfOwnerByIndexes(nftDropAddress, array, address)
            setTokenIds(tokenIds)
        }

        if (balanceOf) {
            const array = Array.from(Array(balanceOf.toNumber()).keys())
            // setOwnedIndexes(array)
            fetchTokenIds(array)
        }
    }, [balanceOf, address, nftDropAddress])

    return (
        <div className="bg-slate-700 text-slate-50 p-4 rounded-lg">
            <div className="flex flex-col justify-between gap-4 h-full">
                <div className="flex justify-between items-center text-slate-50">
                    <div className="font-semibold flex gap-1 items-center">
                        {statusBalanceOf !== "success" ?
                            <div className="bg-slate-200 w-4 h-2 rounded-full animate-pulse" />
                            :
                            <div>{balanceOf.toNumber()}</div>
                        }
                        <div>Owned</div>
                    </div>
                    {statusBalanceOf === "success" && tokenIds && tokenIds?.length > 0 && balanceOf.gt(0) && <NFTDepositButton contractAddress={contractAddress} tokenIds={tokenIds} text="Deposit All" />}
                </div>
                <div>
                    {statusBalanceOf === "loading" && <div className="text-center animate-pulse">Loading balance</div>}
                    {statusBalanceOf === "error" && <div className="text-center">Opps! Something unexpected happened. Please try again later.</div>}
                    {statusBalanceOf === "success" && !tokenIds && <div className="text-center animate-pulse">Loading NFTs</div>}
                    {statusBalanceOf === "success" && tokenIds && tokenIds.length === 0 && <div className="text-center">No NFTs Found</div>}
                    {tokenIds?.map((tokenId, key) => <OwnedNFT key={key} tokenId={tokenId} contractAddress={contractAddress} nftDropAddress={nftDropAddress} />)}
                </div>
                <div className="text-xs text-slate-400 font-mono">{nftDropAddress}</div>
            </div>
        </div>
    )

}