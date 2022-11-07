# ERC20Staking Contract Migration

## Migration Process

- Deploy ERC20StakingV2.sol
- Deploy dApp updates:
    - [ ] Message notifying users they need to migrate their tokens to the new contract, that the old contract will no longer accumulate after date X.
    - [ ] Add migrate button
        - 3 Steps:
            - [ ] Withdraw Tokens from V1
            - [ ] Approve Tokens for V2
            - [ ] Deposit Tokens for V2
    - [ ] Update the Deposit button to V2
    - [ ] Update the Withdraw button to V2
- On date X run script (pseudo below):

```
count = v1.countAllDeposits()
deposits = []

for index in count
    deposit = v1.deposits(index)
    if deposit.withdrawlTime != MaxUint
        // see notes on why we only take withdrawn deposits
        deposits.push(deposit)

v2.migrateDeposits(deposits)
```

### Notes

#### Attack vector

Given
- V1 does not have rescueERC20. We cannot force withdrawl.
- V1 is not pausible, users can withdraw at anytime.
- We can not migrate the tokens themselves.

Then
- A user can keep staking in V1
- User waits for migration to happen
- If we include unwithdrawn deposits, the users active deposits will be recreated in v2
- Thus allocated them "free" tokens
- They can still withdrawn tokens from v1 and sell them.

Mitigation
- We only migrate withdrawn deposits (so we keep the history, but we don't take active deposits)

What this means
- Users with active deposits in v1 will not be represented in v2

#### Other
- V1 users will still receive rewards until date x
- V2 users will start accumulating straight away