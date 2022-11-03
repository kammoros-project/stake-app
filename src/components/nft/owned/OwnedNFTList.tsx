import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react"
import { useState, useEffect } from "react"
import ERC721Staking from "../../../abi/ERC721Staking.json"
import OwnedNFT from "./OwnedNFT"

interface IStakedNFTList {
    contractAddress: string
}

export default function OwnedNFTList({ contractAddress }: IStakedNFTList) {

    const address = useAddress()
    const { contract: stakingContract } = useContract(contractAddress, ERC721Staking.abi)
    const { data: nftDropAddress, status: statusNFTDropAddress } = useContractRead(stakingContract, "nftCollection")
    const { contract: nftDropContract } = useContract(nftDropAddress, "nft-drop");
    const { data: balanceOf, status: statusBalanceOf } = useContractRead(nftDropContract, "balanceOf", address)

    const [ownedIndexes, setOwnedIndexes] = useState<number[]>([])

    useEffect(() => {
        if (balanceOf) {
            const array = Array.from(Array(balanceOf.toNumber()).keys())
            setOwnedIndexes(array)
        }
    }, [balanceOf])

    return (
        <div className="bg-slate-700 text-slate-50 p-4 rounded-lg">
            <div className="flex flex-col justify-between gap-4 h-full">
            <div className="flex justify-between items-center text-slate-50">
                    <div className="font-semibold flex gap-1 items-center">
                        { statusBalanceOf != "success" ? 
                            <div className="bg-slate-200 w-4 h-2 rounded-full animate-pulse" />
                        :
                            <div>{balanceOf.toNumber()}</div>
                        }
                        <div>Owned</div>
                    </div>
                    {/* { depositedTokenIdsForAddress ? <NFTWithdrawButton contractAddress={contractAddress} tokenIds={[depositedTokenIdsForAddress]} text="Withdraw All" /> : <div className="animate-pulse bg-slate-200 w-24 h-4 rounded-full" />} */}
                </div>
            <div>
                { statusBalanceOf == "loading" && <div className="text-center animate-pulse">Loading balance</div> }
                { statusBalanceOf == "error" && <div className="text-center">Opps! Something unexpected happened. Please try again later.</div> }
                { statusBalanceOf == "success" && ownedIndexes?.map((index, key) => <OwnedNFT key={key} index={index}  contractAddress={contractAddress} nftDropAddress={nftDropAddress} />)}
            </div>
            <div className="text-xs text-slate-400 font-mono">{nftDropAddress}</div>
            </div>
        </div>
    )

}