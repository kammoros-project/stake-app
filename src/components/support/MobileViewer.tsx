interface IMobileView {
    round: string
    startTime: string
    endTime: string
    duration: string
    stake: string
    allocationPercent: string
    roundAllocation: string
    allocated: string
    claimed: string
    unclaimed: string
}

function MobileView({ round, startTime, endTime, duration, stake, allocationPercent, roundAllocation, allocated, claimed, unclaimed }: IMobileView) {
    return (
        <div></div>
    )
}

export default MobileView