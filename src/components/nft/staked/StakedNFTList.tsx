import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { ethers } from "ethers"
import { useState, useEffect } from "react"
import ERC721Staking from "../../../abi/ERC721Staking.json"
import NFTWithdrawButton from "../withdrawl/NFTWithdrawButton"
import StakedNFTFilter from "./StakedNFTFilter"

interface IStakedNFTList {
    contractAddress: string
}

export default function StakedNFTList({ contractAddress }: IStakedNFTList) {

    const address = useAddress()
    const { contract: stakingContract } = useContract(contractAddress, ERC721Staking.abi)
    const { data: depositedTokenIdsForAddress, status: statusDepositedTokenIdsForAddress } = useContractRead(stakingContract, "depositedTokenIdsForAddress", address)
    const { data: nftDropAddress, status: statusNFTDropAddress } = useContractRead(stakingContract, "nftCollection")
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
        <div className="bg-slate-700 text-slate-50 p-4">
            <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-slate-50">
                    <h3 className="font-semibold">Staked ({depositedTokenIdsForAddress?.length})</h3>
                    { depositedTokenIdsForAddress && <NFTWithdrawButton contractAddress={contractAddress} tokenIds={[depositedTokenIdsForAddress]} text="Withdraw All" /> }
                </div>
            <div>
                {address && stakedOwnerIndexes && nftDropAddress && depositedTokenIdsForAddress && stakedOwnerIndexes.map((index, key) => <StakedNFTFilter key={key} index={index} contractAddress={contractAddress} nftDropAddress={nftDropAddress} depositedTokenIdsForAddress={depositedTokenIdsForAddress} />)}
            </div>
            <div className="text-xs text-slate-400 font-mono">{contractAddress}</div>
            </div>
        </div>
    )

}