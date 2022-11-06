import { useEthers } from "@usedapp/core"
import { BigNumber } from "ethers"
import { useState, useEffect } from "react"
import tokenOfOwnerByIndexes from "../../../helpers/tokenOfOwnerByIndexes"
import useERC721BalanceOf from "../../../hooks/DropERC721/useERC721BalanceOf"
import useNFTCollection from "../../../hooks/ERC721Staking/useNFTCollection"
import Loading from "../../support/Loading"
import NFTDepositButton from "../buttons/NFTDepositButton"
import OwnedNFT from "./OwnedNFT"

interface IStakedNFTList {
    contractAddress: string
}

export default function OwnedNFTList({ contractAddress }: IStakedNFTList) {

    const { account } = useEthers()
    const nftDropAddress = useNFTCollection(contractAddress)
    const balanceOf = useERC721BalanceOf(nftDropAddress, account)
    const [tokenIds, setTokenIds] = useState<BigNumber[]>()

    useEffect(() => {

        async function fetchTokenIds(array: number[]) {
            const tokenIds = await tokenOfOwnerByIndexes(nftDropAddress, array, account)
            setTokenIds(tokenIds)
        }

        if (balanceOf) {
            const array = Array.from(Array(balanceOf.toNumber()).keys())
            fetchTokenIds(array)
        }
    }, [balanceOf, account, nftDropAddress])

    return (
        <div className="bg-slate-700 text-slate-50 p-4 rounded-lg">
            <div className="flex flex-col justify-between gap-4 h-full">
                <div className="flex justify-between items-center text-slate-50">
                    <div className="font-semibold flex gap-1 items-center">
                        {balanceOf ?
                            <div>{balanceOf.toNumber()}</div>
                            :
                            <Loading />
                        }
                        <div>Owned</div>
                    </div>
                    <div className="flex gap-2">
                        <a href="https://mint.kammorostoken.com" target={"_blank"} rel="noreferrer" className="px-2 py-1 text-sm font-semibold uppercase rounded border-2 border-slate-500 text-slate-500 hover:border-slate-400 hover:text-slate-400">Mint</a>
                        {balanceOf && tokenIds && tokenIds?.length > 0 && balanceOf.gt(0) && <NFTDepositButton contractAddress={contractAddress} tokenIds={tokenIds} text="Deposit All" />}
                    </div>
                </div>
                <div>
                    {!balanceOf && !tokenIds && <div className="text-center animate-pulse">Loading...</div>}
                    {tokenIds?.map((tokenId, key) => <OwnedNFT key={key} tokenId={tokenId} contractAddress={contractAddress} nftDropAddress={nftDropAddress} />)}
                </div>
                <div className="text-xs text-slate-400 font-mono">{nftDropAddress}</div>
            </div>
        </div>
    )

}