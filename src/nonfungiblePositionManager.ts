import { BigintIsh, Percent, Token, CurrencyAmount, Currency, NativeCurrency } from '@kyberswap/ks-sdk-core'
import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { Position } from './entities/position'
import { ONE, ZERO } from './internalConstants'
import { MethodParameters, toHex } from './utils/calldata'
import { Interface } from '@ethersproject/abi'
import { abi } from './abis/IProAmmAntiSnipPositionManager.json'
// import { PermitOptions, SelfPermit } from './selfPermit'
import { Pool } from 'entities/pool'
import { Payments } from './payments'
import { Multicall } from './multicall'
import { SqrtPriceMath } from './utils/sqrtPriceMath'
import { validateAndParseAddress } from './utils/validateAndParseAddress'

const MaxUint128 = toHex(JSBI.subtract(JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)), JSBI.BigInt(1)))

export interface MintSpecificOptions {
  /**
   * The account that should receive the minted NFT.
   */
  recipient: string

  /**
   * Creates pool if not initialized before mint.
   */
  createPool?: boolean
}

export interface IncreaseSpecificOptions {
  /**
   * Indicates the ID of the position to increase liquidity for.
   */
  tokenId: BigintIsh
}

/**
 * Options for producing the calldata to add liquidity.
 */
export interface CommonAddLiquidityOptions {
  /**
   * How much the pool price is allowed to move.
   */
  slippageTolerance: Percent

  /**
   * When the transaction expires, in epoch seconds.
   */
  deadline: BigintIsh

  /**
   * Whether to spend ether. If true, one of the pool tokens must be WETH, by default false
   */
  useNative?: NativeCurrency

  /**
   * The optional permit parameters for spending token0
   */
  // token0Permit?: PermitOptions

  /**
   * The optional permit parameters for spending token1
   */
  // token1Permit?: PermitOptions
}

export type MintOptions = CommonAddLiquidityOptions & MintSpecificOptions
export type IncreaseOptions = CommonAddLiquidityOptions & IncreaseSpecificOptions

export type AddLiquidityOptions = MintOptions | IncreaseOptions

export interface SafeTransferOptions {
  /**
   * The account sending the NFT.
   */
  sender: string

  /**
   * The account that should receive the NFT.
   */
  recipient: string

  /**
   * The id of the token being sent.
   */
  tokenId: BigintIsh
  /**
   * The optional parameter that passes data to the `onERC721Received` call for the staker
   */
  data?: string
}

// type guard
function isMint(options: AddLiquidityOptions): options is MintOptions {
  return Object.keys(options).some(k => k === 'recipient')
}

export interface CollectOptions {
  /**
   * Indicates the ID of the position to collect for.
   */
  tokenId: BigintIsh

  /**
   * Expected value of tokensOwed0, including as-of-yet-unaccounted-for fees/liquidity value to be burned
   */
  expectedCurrencyOwed0: CurrencyAmount<Currency>

  /**
   * Expected value of tokensOwed1, including as-of-yet-unaccounted-for fees/liquidity value to be burned
   */
  expectedCurrencyOwed1: CurrencyAmount<Currency>

  /**
   * The account that should receive the tokens.
   */
  recipient: string

  deadline: BigintIsh

  isRemovingLiquid?: boolean

  havingFee?: boolean

  /**
   * If position is closed, don't remove 1 liquidity when collect fee
   */
  isPositionClosed?: boolean

  /**
   * Support for legacy contract which dont have syncFeeGrowth
   * */
  legacyMode?: boolean
}

export interface NFTPermitOptions {
  v: 0 | 1 | 27 | 28
  r: string
  s: string
  deadline: BigintIsh
  spender: string
}
/**
 * Options for producing the calldata to exit a position.
 */
export interface RemoveLiquidityOptions {
  /**
   * The ID of the token to exit
   */
  tokenId: BigintIsh

  /**
   * The percentage of position liquidity to exit.
   */
  liquidityPercentage: Percent

  /**
   * How much the pool price is allowed to move.
   */
  slippageTolerance: Percent

  /**
   * When the transaction expires, in epoch seconds.
   */
  deadline: BigintIsh

  /**
   * Whether the NFT should be burned if the entire position is being exited, by default false.
   */
  burnToken?: boolean

  /**
   * The optional permit of the token ID being exited, in case the exit transaction is being sent by an account that does not own the NFT
   */
  permit?: NFTPermitOptions

  /**
   * Parameters to be passed on to collect
   */
  collectOptions: Omit<CollectOptions, 'tokenId'>
}

export abstract class NonfungiblePositionManager {
  public static INTERFACE: Interface = new Interface(abi)
  /**
   * Cannot be constructed.
   */
  private constructor() {}
  private static encodeCreate(pool: Pool): string {
    return NonfungiblePositionManager.INTERFACE.encodeFunctionData('createAndUnlockPoolIfNecessary', [
      pool.token0.address,
      pool.token1.address,
      pool.fee,
      toHex(pool.sqrtRatioX96)
    ])
  }

  public static createCallParameters(pool: Pool): MethodParameters {
    Multicall.encodeMulticall([this.encodeCreate(pool)])
    return {
      calldata: this.encodeCreate(pool),
      value: toHex(0)
    }
  }

  public static createCallParametersTest(pool: Pool, ethAmount: JSBI): MethodParameters {
    return {
      calldata: this.encodeCreate(pool),
      value: toHex(ethAmount)
    }
  }

  public static addCallParameters(
    position: Position | Position[],
    ticks: number[] | number[][],
    options: AddLiquidityOptions
  ): MethodParameters {
    const positions = Array.isArray(position) ? position : [position]
    if (isMint(options) && options.createPool) {
      invariant(positions.length === 1, 'CREATE_POOL_ONLY_ACCEPT_ONE_POSITION')
    }

    const ticksPrevious = Array.isArray(ticks[0]) ? ticks : [ticks]

    invariant(positions.length === ticksPrevious.length, 'POSITIONS_AND_TICK_PREVIOUS_NOT_SAME_SIZE')
    positions.forEach(p => {
      invariant(JSBI.greaterThan(p.liquidity, ZERO), 'ZERO_LIQUIDITY')
    })

    const calldatas: string[] = []
    let value = JSBI.BigInt(0)
    let refundValue = JSBI.BigInt(0)

    positions.forEach((p, index) => {
      // get amounts
      const { amount0: amount0Desired, amount1: amount1Desired } = p.mintAmounts
      // adjust for slippage
      const minimumAmounts = p.mintAmountsWithSlippage(options.slippageTolerance)
      const amount0Min = toHex(minimumAmounts.amount0)
      const amount1Min = toHex(minimumAmounts.amount1)

      const deadline = toHex(options.deadline)
      // create pool if needed
      if (isMint(options) && options.createPool) {
        calldatas.push(this.encodeCreate(p.pool))
      }
      // permits if necessary
      // if (options.token0Permit) {
      //   calldatas.push(SelfPermit.encodePermit(position.pool.token0, options.token0Permit))
      // }
      // if (options.token1Permit) {
      //   calldatas.push(SelfPermit.encodePermit(position.pool.token1, options.token1Permit))
      // }
      // mint
      if (isMint(options)) {
        const recipient: string = validateAndParseAddress(options.recipient)
        calldatas.push(
          NonfungiblePositionManager.INTERFACE.encodeFunctionData('mint', [
            {
              token0: p.pool.token0.address,
              token1: p.pool.token1.address,
              fee: p.pool.fee,
              tickLower: p.tickLower,
              tickUpper: p.tickUpper,
              ticksPrevious: ticksPrevious[index],
              amount0Desired: toHex(amount0Desired),
              amount1Desired: toHex(amount1Desired),
              amount0Min,
              amount1Min,
              recipient,
              deadline
            }
          ])
        )
      } else {
        // increase
        calldatas.push(
          NonfungiblePositionManager.INTERFACE.encodeFunctionData('addLiquidity', [
            {
              tokenId: toHex(options.tokenId),
              ticksPrevious: ticksPrevious[index],
              amount0Desired: toHex(amount0Desired),
              amount1Desired: toHex(amount1Desired),
              amount0Min,
              amount1Min,
              deadline
            }
          ])
        )
      }

      if (options.useNative) {
        const wrapped = options.useNative.wrapped
        invariant(p.pool.token0.equals(wrapped) || p.pool.token1.equals(wrapped), 'NO_WETH')

        const wrappedValue = p.pool.token0.equals(wrapped) ? amount0Desired : amount1Desired

        // we only need to refund if we're actually sending ETH
        if (JSBI.greaterThan(wrappedValue, ZERO)) {
          // calldatas.push(Payments.encodeRefundETH())
          refundValue = JSBI.add(refundValue, wrappedValue)
        }

        if (isMint(options) && options.createPool) {
          const ethUnlock = p.pool.token0.equals(wrapped)
            ? SqrtPriceMath.getAmount0Unlock(p.pool.sqrtRatioX96)
            : SqrtPriceMath.getAmount1Unlock(p.pool.sqrtRatioX96)
          value = JSBI.add(value, JSBI.add(wrappedValue, ethUnlock))
        } else value = JSBI.add(wrappedValue, value)
      }
    })

    if (JSBI.greaterThan(refundValue, ZERO)) {
      calldatas.push(Payments.encodeRefundETH())
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(value)
    }
  }

  private static encodeCollect(options: CollectOptions): string[] {
    const calldatas: string[] = []

    const tokenId = toHex(options.tokenId)

    // const involvesETH =
    // options.expectedCurrencyOwed0.currency.isNative || options.expectedCurrencyOwed1.currency.isNative

    const recipient = validateAndParseAddress(options.recipient)

    const deadline = toHex(options.deadline)

    if (!options.isRemovingLiquid && !options.isPositionClosed) {
      if (!options.legacyMode)
        calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('syncFeeGrowth', [tokenId]))
      else
        calldatas.push(
          //remove a small amount to update the RTokens
          NonfungiblePositionManager.INTERFACE.encodeFunctionData('removeLiquidity', [
            {
              tokenId,
              liquidity: '0x1',
              amount0Min: 0,
              amount1Min: 0,
              deadline
            }
          ])
        )
    }

    if (options.havingFee) {
      // collect
      calldatas.push(
        NonfungiblePositionManager.INTERFACE.encodeFunctionData('burnRTokens', [
          {
            tokenId,
            amount0Min: 0,
            amount1Min: 0,
            deadline
          }
        ])
      )
    }

    const token0IsNative = options.expectedCurrencyOwed0.currency.isNative
    const token1IsNative = options.expectedCurrencyOwed1.currency.isNative
    const token0Amount = options.expectedCurrencyOwed0.quotient
    const token1Amount = options.expectedCurrencyOwed1.quotient

    if (token0IsNative) {
      calldatas.push(Payments.encodeUnwrapWETH(token0Amount, recipient))
    } else {
      const token = options.expectedCurrencyOwed0.currency as Token
      calldatas.push(Payments.encodeSweepToken(token, token0Amount, recipient))
    }
    if (token1IsNative) {
      calldatas.push(Payments.encodeUnwrapWETH(token1Amount, recipient))
    } else {
      const token = options.expectedCurrencyOwed1.currency as Token
      calldatas.push(Payments.encodeSweepToken(token, token1Amount, recipient))
    }

    // if (involvesETH) {
    //   const ethAmount = options.expectedCurrencyOwed0.currency.isNative
    //     ? options.expectedCurrencyOwed0.quotient
    //     : options.expectedCurrencyOwed1.quotient
    //   const token = options.expectedCurrencyOwed0.currency.isNative
    //     ? (options.expectedCurrencyOwed1.currency as Token)
    //     : (options.expectedCurrencyOwed0.currency as Token)
    //   const tokenAmount = options.expectedCurrencyOwed0.currency.isNative
    //     ? options.expectedCurrencyOwed1.quotient
    //     : options.expectedCurrencyOwed0.quotient

    //   calldatas.push(Payments.encodeUnwrapWETH(ethAmount, recipient))
    //   calldatas.push(Payments.encodeSweepToken(token, tokenAmount, recipient))
    // }

    return calldatas
  }

  public static collectCallParameters(options: CollectOptions): MethodParameters {
    const calldatas: string[] = NonfungiblePositionManager.encodeCollect(options)

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0)
    }
  }
  /**
   * Produces the calldata for completely or partially exiting a position
   * @param position The position to exit
   * @param options Additional information necessary for generating the calldata
   * @returns The call parameters
   */
  public static removeCallParameters(position: Position, options: RemoveLiquidityOptions): MethodParameters {
    const calldatas: string[] = []

    const deadline = toHex(options.deadline)
    const tokenId = toHex(options.tokenId)
    console.log(position)
    // construct a partial position with a percentage of liquidity
    const partialPosition = new Position({
      pool: position.pool,
      liquidity: options.liquidityPercentage.multiply(position.liquidity).quotient,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper
    })
    invariant(JSBI.greaterThan(partialPosition.liquidity, ZERO), 'ZERO_LIQUIDITY')

    // slippage-adjusted underlying amounts
    const { amount0: amount0Min, amount1: amount1Min } = partialPosition.burnAmountsWithSlippage(
      options.slippageTolerance
    )

    if (options.permit) {
      calldatas.push(
        NonfungiblePositionManager.INTERFACE.encodeFunctionData('permit', [
          validateAndParseAddress(options.permit.spender),
          tokenId,
          toHex(options.permit.deadline),
          options.permit.v,
          options.permit.r,
          options.permit.s
        ])
      )
    }

    // remove liquidity
    calldatas.push(
      NonfungiblePositionManager.INTERFACE.encodeFunctionData('removeLiquidity', [
        {
          tokenId,
          liquidity: toHex(partialPosition.liquidity),
          amount0Min: toHex(amount0Min),
          amount1Min: toHex(amount1Min),
          deadline
        }
      ])
    )

    const { expectedCurrencyOwed0, expectedCurrencyOwed1, ...rest } = options.collectOptions
    calldatas.push(
      ...NonfungiblePositionManager.encodeCollect({
        tokenId: toHex(options.tokenId),
        // add the underlying value to the expected currency already owed
        expectedCurrencyOwed0: expectedCurrencyOwed0.add(
          CurrencyAmount.fromRawAmount(expectedCurrencyOwed0.currency, amount0Min)
        ),
        expectedCurrencyOwed1: expectedCurrencyOwed1.add(
          CurrencyAmount.fromRawAmount(expectedCurrencyOwed1.currency, amount1Min)
        ),
        ...rest
      })
    )

    if (options.liquidityPercentage.equalTo(ONE)) {
      if (options.burnToken) {
        calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('burn', [tokenId]))
      }
    } else {
      invariant(options.burnToken !== true, 'CANNOT_BURN')
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0)
    }
  }

  public static safeTransferFromParameters(options: SafeTransferOptions): MethodParameters {
    const recipient = validateAndParseAddress(options.recipient)
    const sender = validateAndParseAddress(options.sender)

    let calldata: string
    if (options.data) {
      calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData(
        'safeTransferFrom(address,address,uint256,bytes)',
        [sender, recipient, toHex(options.tokenId), options.data]
      )
    } else {
      calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
        sender,
        recipient,
        toHex(options.tokenId)
      ])
    }
    return {
      calldata: calldata,
      value: toHex(0)
    }
  }
}
