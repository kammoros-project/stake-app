import { useEthers } from "@usedapp/core"
import useDepositedTokenIdsForAddress from "../../../hooks/ERC721Staking/useDepositedTokenIdsForAddress"
import useNFTCollection from "../../../hooks/ERC721Staking/useNFTCollection"
import Loading from "../../support/Loading"
import NFTWithdrawButton from "../buttons/NFTWithdrawButton"
import StakedNFT from "./StakedNFT"

interface IStakedNFTList {
    contractAddress: string
}

export default function StakedNFTList({ contractAddress }: IStakedNFTList) {

    const { account } = useEthers()

    const depositedTokenIdsForAddress = useDepositedTokenIdsForAddress(contractAddress, account)
    const nftDropAddress = useNFTCollection(contractAddress)

    return (
        <div className="bg-slate-700 text-slate-50 p-4 rounded-lg">
            <div className="flex flex-col justify-between gap-4 h-full">
                <div className="flex justify-between items-center text-slate-50">
                    <div className="font-semibold flex gap-1 items-center text-white text-xs font-semibold uppercase">
                        {depositedTokenIdsForAddress ?
                            <div>{depositedTokenIdsForAddress.length}</div>
                            :
                            <Loading />
                        }
                        <div>Staked</div>
                    </div>
                    {depositedTokenIdsForAddress && depositedTokenIdsForAddress.length > 0 && <NFTWithdrawButton contractAddress={contractAddress} tokenIds={depositedTokenIdsForAddress} text="Withdraw All" />}
                </div>
                <div>
                    {!depositedTokenIdsForAddress && <div className="text-center animate-pulse">Loading...</div>}
                    {nftDropAddress && depositedTokenIdsForAddress && depositedTokenIdsForAddress?.map((tokenId, key) => <StakedNFT key={key} tokenId={tokenId} contractAddress={contractAddress} nftDropAddress={nftDropAddress} />)}
                </div>
                <div className="text-xs text-slate-400 font-mono">{contractAddress}</div>
            </div>
        </div>
    )

}