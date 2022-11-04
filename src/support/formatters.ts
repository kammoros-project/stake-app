import { BigNumber, ethers } from "ethers";
import humanizeDuration, { HumanizerOptions } from "humanize-duration";
import { IRound } from "../types/rounds";

export function formatBalance(balance: any): string {
    if (!(balance instanceof BigNumber)) return ""
    return Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(parseInt(ethers.utils.formatEther(balance)));
}

export function formatPercentage(num: any, den: any): string {
    if (!(num instanceof BigNumber)) return ""
    if (!(den instanceof BigNumber)) return ""

    const percent = num.mul(100).div(den).toNumber() / 100

    return Intl.NumberFormat('en-US', {
        style: "percent",
        maximumFractionDigits: 2
    }).format(percent); 
}

export function formatCountdown(round: any): string {
    if (round === undefined) return ""
    const endTime = (round as IRound).endTime.toNumber() * 1000
    if (endTime < Date.now()) return "Ended"
    const duration = endTime - Date.now()
    let options: HumanizerOptions = { round: true }
    if (duration < 60*1000) {
        options = { ...options, units: ["s"] }
    } else if (duration < 60*60*1000) {
        options = { ...options, units: ["m"] }
    } else if (duration < 24*60*60*1000) {
        options = { ...options, units: ["h"] }
    } else {
        options = { ...options, units: ["d"] }
    }
    return humanizeDuration(duration, options)
}

export function formatCommify(nb: any): string {
    if (!(nb instanceof BigNumber)) return ""
    nb = ethers.utils.formatEther(nb)
    const str = ethers.utils.commify(nb)
    const index = str.indexOf(".") + 4
    return str.substring(0, index)
    // return str
}

export function formatDuration(nb: BigNumber): string {
    const duration: number = nb.toNumber() * 1000
    let options: HumanizerOptions = { round: true }
    if (duration < 60*1000) {
        options = { ...options, units: ["s"] }
    } else if (duration < 60*60*1000) {
        options = { ...options, units: ["m"] }
    } else if (duration < 24*60*60*1000) {
        options = { ...options, units: ["h"] }
    } else {
        options = { ...options, units: ["d"] }
    }
    return humanizeDuration(duration, options)
}

export function formatSimplePercent(percent: any): string {
    if (!(percent instanceof BigNumber)) return ""
    return Intl.NumberFormat('en-US', {
        style: "percent",
        maximumFractionDigits: 2
    }).format(parseFloat(ethers.utils.formatEther(percent))); 
}