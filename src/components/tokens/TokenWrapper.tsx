import DelegatedTokens from "./DelegatedTokens";
import OwnedTokens from "./OwnedTokens";

export default function TokenWrapper() {

    return (
        <div className="flex flex-col gap-4">
            <div className="grid lg:grid-cols-2 gap-4">
                <OwnedTokens />
                <DelegatedTokens />
            </div>
            <div>
                {/* <NFTStakingTable contractAddress={tokenStakingContract} /> */}
            </div>
        </div>
    )
}