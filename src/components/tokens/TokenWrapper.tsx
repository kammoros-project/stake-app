import { useAddress } from "@thirdweb-dev/react";
import OwnedTokens from "./OwnedTokens";

export default function TokenWrapper() {

    const address = useAddress()

    return (
        <div className="flex flex-col gap-4">
            <div className="grid lg:grid-cols-2 gap-4">
                { address && <OwnedTokens />}
                {/* <StakedNFTList contractAddress={tokenStakingContract} /> */}
            </div>
            <div>
                {/* <NFTStakingTable contractAddress={tokenStakingContract} /> */}
            </div>
        </div>
    )
}