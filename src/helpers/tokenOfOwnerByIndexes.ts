import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
const sdk = new ThirdwebSDK("binance");

export default async function tokenOfOwnerByIndexes(nftDropAddress: string | undefined, indexes: number[], address: string | undefined): Promise<BigNumber[] | []> {
    if (!address) return []
    if (!nftDropAddress) return []
    const contract = await sdk.getContract(nftDropAddress);
    const promises = await indexes.map(index => contract.call("tokenOfOwnerByIndex", address, index))
    const results = await Promise.all(promises)
    return results
}