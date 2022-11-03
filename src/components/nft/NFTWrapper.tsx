import StakedNFTList from "./staked/StakedNFTList"

interface INFTWrapper {
    contractAddress: string
}

export default function NFTWrapper({ contractAddress }: INFTWrapper) {
    return (
        <div className="flex flex-col">
            <div className="grid lg:grid-cols-2 gap-4">
                <div>Owned</div>
                <StakedNFTList contractAddress={contractAddress} />
            </div>
        </div>
    )
}