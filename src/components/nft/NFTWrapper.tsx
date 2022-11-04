import NFTStakingTable from "./NFTStakingTable"
import OwnedNFTList from "./owned/OwnedNFTList"
import StakedNFTList from "./staked/StakedNFTList"

interface INFTWrapper {
    contractAddress: string
}

export default function NFTWrapper({ contractAddress }: INFTWrapper) {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid lg:grid-cols-2 gap-4">
                <OwnedNFTList contractAddress={contractAddress} />
                <StakedNFTList contractAddress={contractAddress} />
            </div>
            <div>
                <NFTStakingTable contractAddress={contractAddress} />
            </div>
        </div>
    )
}