import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { BigNumber } from "ethers"
import { useState, useEffect } from "react"
import ERC721Staking from "../../../abi/ERC721Staking.json"
import NFTWithdrawButton from "../buttons/NFTWithdrawButton"
import StakedNFTFilter from "./StakedNFTFilter"

interface IStakedNFTList {
    contractAddress: string
}

export default function StakedNFTList({ contractAddress }: IStakedNFTList) {

    const address = useAddress()
    const { contract: stakingContract } = useContract(contractAddress, ERC721Staking.abi)
    const { data: depositedTokenIdsForAddress, isLoading: isLoadingDepositedTokenIdsForAddress } = useContractRead(stakingContract, "depositedTokenIdsForAddress", address)
    const { data: nftDropAddress } = useContractRead(stakingContract, "nftCollection")
    const { contract: nftDropContract } = useContract(nftDropAddress, "nft-drop");
    const { data: balanceOf, status: statusBalanceOf } = useContractRead(nftDropContract, "balanceOf", contractAddress)

    const [stakedOwnerIndexes, setStakedOwnerIndexes] = useState<number[]>([])

    useEffect(() => {
        if (balanceOf) {
            const array = Array.from(Array(balanceOf.toNumber()).keys())
            setStakedOwnerIndexes(array)
        }
    }, [balanceOf])


    return (
        <div className="bg-slate-700 text-slate-50 p-4 rounded-lg">
            <div className="flex flex-col justify-between gap-4 h-full">
            <div className="flex justify-between items-center text-slate-50">
                    <div className="font-semibold flex gap-1 items-center">
                        { isLoadingDepositedTokenIdsForAddress ? 
                            <div className="bg-slate-200 w-4 h-2 rounded-full animate-pulse" />
                        :
                            <div>{depositedTokenIdsForAddress.length}</div>
                        }
                        <div>Staked</div>
                    </div>
                    { depositedTokenIdsForAddress?.length > 0 && <NFTWithdrawButton contractAddress={contractAddress} tokenIds={depositedTokenIdsForAddress.map((bn: BigNumber) => bn.toNumber())} text="Withdraw All" />}
                </div>
            <div>
                { statusBalanceOf === "loading" && <div className="text-center animate-pulse">Loading balance</div> }
                { statusBalanceOf === "error" && <div className="text-center">Opps! Something unexpected happened. Please try again later.</div> }
                { statusBalanceOf === "success" && address && stakedOwnerIndexes && nftDropAddress && depositedTokenIdsForAddress && stakedOwnerIndexes.map((index, key) => <StakedNFTFilter key={key} index={index} contractAddress={contractAddress} nftDropAddress={nftDropAddress} depositedTokenIdsForAddress={depositedTokenIdsForAddress} />)}
            </div>
            <div className="text-xs text-slate-400 font-mono">{contractAddress}</div>
            </div>
        </div>
    )

}