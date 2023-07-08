import { Token, CurrencyAmount, WETH } from '@kyberswap/ks-sdk-core'
import { FeeAmount, TICK_SPACINGS } from '../constants'
import { nearestUsableTick } from '../utils/nearestUsableTick'
import { TickMath } from '../utils/tickMath'
import { Pool } from './pool'
import { encodeSqrtRatioX96 } from '../utils/encodeSqrtRatioX96'
import JSBI from 'jsbi'
import { NEGATIVE_ONE } from '../internalConstants'

const ONE_ETHER = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))

describe('Pool', () => {
  const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => {
        new Pool(USDC, WETH[5], FeeAmount.MOST_PAIR2, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
      }).toThrow('CHAIN_IDS')
    })

    it('fee must be integer', () => {
      expect(() => {
        new Pool(USDC, WETH[1], FeeAmount.MOST_PAIR2 + 0.5, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
      }).toThrow('FEE')
    })

    it('fee cannot be more than 1e6', () => {
      expect(() => {
        new Pool(USDC, WETH[1], 1e6, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
      }).toThrow('FEE')
    })

    it('cannot be given two of the same token', () => {
      expect(() => {
        new Pool(USDC, USDC, FeeAmount.MOST_PAIR2, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
      }).toThrow('ADDRESSES')
    })

    it('price must be within tick price bounds', () => {
      expect(() => {
        new Pool(USDC, WETH[1], FeeAmount.MOST_PAIR2, encodeSqrtRatioX96(1, 1), 0, 0, 1, [])
      }).toThrow('PRICE_BOUNDS')
      expect(() => {
        new Pool(USDC, WETH[1], FeeAmount.MOST_PAIR2, JSBI.add(encodeSqrtRatioX96(1, 1), JSBI.BigInt(1)), 0, 0, -1, [])
      }).toThrow('PRICE_BOUNDS')
    })

    it('works with valid arguments for empty pool medium fee', () => {
      new Pool(USDC, WETH[1], FeeAmount.MOST_PAIR2, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
    })

    it('works with valid arguments for empty pool low fee', () => {
      new Pool(USDC, WETH[1], FeeAmount.VERY_STABLE1, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
    })

    it('works with valid arguments for empty pool lowest fee', () => {
      new Pool(USDC, WETH[1], FeeAmount.VERY_STABLE, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
    })

    it('works with valid arguments for empty pool high fee', () => {
      new Pool(USDC, WETH[1], FeeAmount.EXOTIC, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
    })
  })
  // describe('#getAddress', () => {
  //   it('matches an example', () => {
  //     const result = Pool.getAddress(USDC, DAI, FeeAmount.LOW)
  //     expect(result).toEqual('0xB98192CFEf8B1697CC327E03b336305a6B6e7E3D')
  //   })
  // })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      let pool = new Pool(USDC, DAI, FeeAmount.STABLE, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
      expect(pool.token0).toEqual(DAI)
      pool = new Pool(DAI, USDC, FeeAmount.STABLE, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
      expect(pool.token0).toEqual(DAI)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      let pool = new Pool(USDC, DAI, FeeAmount.STABLE, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
      expect(pool.token1).toEqual(USDC)
      pool = new Pool(DAI, USDC, FeeAmount.STABLE, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
      expect(pool.token1).toEqual(USDC)
    })
  })
  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(
        new Pool(
          USDC,
          DAI,
          FeeAmount.STABLE,
          encodeSqrtRatioX96(101e6, 100e18),
          0,
          0,
          TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(101e6, 100e18)),
          []
        ).token0Price.toSignificant(5)
      ).toEqual('1.01')
      expect(
        new Pool(
          DAI,
          USDC,
          FeeAmount.STABLE,
          encodeSqrtRatioX96(101e6, 100e18),
          0,
          0,
          TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(101e6, 100e18)),
          []
        ).token0Price.toSignificant(5)
      ).toEqual('1.01')
    })
  })
  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(
        new Pool(
          USDC,
          DAI,
          FeeAmount.STABLE,
          encodeSqrtRatioX96(101e6, 100e18),
          0,
          0,
          TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(101e6, 100e18)),
          []
        ).token1Price.toSignificant(5)
      ).toEqual('0.9901')
      expect(
        new Pool(
          DAI,
          USDC,
          FeeAmount.STABLE,
          encodeSqrtRatioX96(101e6, 100e18),
          0,
          0,
          TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(101e6, 100e18)),
          []
        ).token1Price.toSignificant(5)
      ).toEqual('0.9901')
    })
  })

  describe('#priceOf', () => {
    const pool = new Pool(USDC, DAI, FeeAmount.STABLE, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
    it('returns price of token in terms of other token', () => {
      expect(pool.priceOf(DAI)).toEqual(pool.token0Price)
      expect(pool.priceOf(USDC)).toEqual(pool.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pool.priceOf(WETH[1])).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      let pool = new Pool(USDC, DAI, FeeAmount.STABLE, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
      expect(pool.chainId).toEqual(1)
      pool = new Pool(DAI, USDC, FeeAmount.STABLE, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
      expect(pool.chainId).toEqual(1)
    })
  })

  describe('#involvesToken', () => {
    const pool = new Pool(USDC, DAI, FeeAmount.STABLE, encodeSqrtRatioX96(1, 1), 0, 0, 0, [])
    expect(pool.involvesToken(USDC)).toEqual(true)
    expect(pool.involvesToken(DAI)).toEqual(true)
    expect(pool.involvesToken(WETH[1])).toEqual(false)
  })

  describe('swaps', () => {
    let pool: Pool
    beforeEach(() => {
      //tickCurrent = 0
      //currentX96 = encodeSqrtRatioX96(1, 1)
      //liquid = ONE_ETHER
      pool = new Pool(USDC, DAI, FeeAmount.STABLE, encodeSqrtRatioX96(1, 1), ONE_ETHER, 0, 0, [
        {
          index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[FeeAmount.STABLE]),
          liquidityNet: ONE_ETHER,
          liquidityGross: ONE_ETHER
        },
        {
          index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[FeeAmount.STABLE]),
          liquidityNet: JSBI.multiply(ONE_ETHER, NEGATIVE_ONE),
          liquidityGross: ONE_ETHER
        }
      ])
      // pool = new Pool(USDC, DAI, FeeAmount.LOW, encodeSqrtRatioX96(1, 1), ONE_ETHER, 0, [])
    })
    //token 0 = DAI => zeroForOne=false
    //outputAmount = swap( zeroForOne, inputAmount.quotient, sqrtPriceLimitX96 )
    //while loop amountSpecifiedRemaining !== 0
    //  tickNext = nextInitializedTickWithinOneWord(tick = tickCurrent = 0,
    //                                              lte = zeroForOne = false,
    //                                              tickSpacing = TICK_SPACINGS[FeeAmount.LOW])
    //  tickNext = 2^8 * 10 - 1 = 2559
    //  zeroForOne . as long as swaping token 0->1, X96 of token 0 come to 0, then sqrtPriceLimitX96 = MIN_SQRT_RATIO is the limit
    //  !zeroForOne . as long as swaping token 0->1, X96 of token 0 come to infinity, then sqrtPriceLimitX96 = MAX_SQRT_RATIO is the limit
    //  next96 = 90041927759339286931870012045
    //  [step.amountIn, step.amountOut, step.feeAmount] = SwapMath.computeSwapStep( currentX96 = at first encodeSqrtRatioX96(1, 1)
    //                                                                             targetX96 = (limitX96 || nextX96) = nextX96 (!zeroForOne => compare nextX96 to maxTick)
    //                                                                             liquid = ONE_ETHER
    //                                                                             amountRemaining = at 1st inputAmount = raw(100)
    //                                                                             feePips = FeeAmount.LOW
    //                                                                            )
    //
    //  amountRemaining = 100
    //  amountRemainingLessFee = inputAmount - fee = 99
    //  exactInput = true + given the 2 ticks: currentX96 vs targetX96 -> amountIn_this_step
    //  amountIn_this_step = amount USDC = amount token 1 = SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true)
    //                                                   = 136488906241237458
    //  amountRemainingLessFee < amountIn_this_step, mean the last step before while loop end
    //  -> recalculate nextX96 = SqrtPriceMath.getNextSqrtPriceFromInput( sqrtRatioCurrentX96, liquidity, amountRemainingLessFee, zeroForOne=false)
    //                        = 79228162514264345437132039248
    //  -> recalculate amountIn = SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, nextX96_recalc = 79228162514264345437132039248, liquidity, true)
    //                         = 99
    //  amountOut = SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, nextX96_recalc = 79228162514264345437132039248, liquidity, false)
    //              = 98
    //  feeAmount = amountRemaining - amountIn_recalculated = 100 - 99 = 1
    describe('#getOutputAmount', () => {
      it('USDC -> DAI', async () => {
        const inputAmount = CurrencyAmount.fromRawAmount(USDC, 100)
        const [outputAmount, lastestPool] = await pool.getOutputAmount(inputAmount)
        expect(outputAmount.currency.equals(DAI)).toBe(true)
        expect(outputAmount.quotient).toEqual(JSBI.BigInt(98))
        expect(lastestPool.tickCurrent).toEqual(0)
      })
    })
  })

  describe('swaps_PROMM', () => {
    let pool: Pool
    const FEE_AMOUNT = FeeAmount.MOST_PAIR
    beforeEach(() => {
      //tickCurrent = 0
      //currentX96 = encodeSqrtRatioX96(1, 1)
      //liquid = ONE_ETHER
      pool = new Pool(USDC, DAI, FEE_AMOUNT, encodeSqrtRatioX96(1, 1), ONE_ETHER, 0, 0, [
        {
          index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[FEE_AMOUNT]),
          liquidityNet: ONE_ETHER,
          liquidityGross: ONE_ETHER
        },
        {
          index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[FEE_AMOUNT]),
          liquidityNet: JSBI.multiply(ONE_ETHER, NEGATIVE_ONE),
          liquidityGross: ONE_ETHER
        }
      ])
      // pool = new Pool(USDC, DAI, FeeAmount.LOW, encodeSqrtRatioX96(1, 1), ONE_ETHER, 0, [])
    })
    describe('#getOutputAmount', () => {
      it('USDC -> DAI', async () => {
        // token 0 = DAI => zeroForOne=false
        // amount = 24295310180196433 > 0 => exactIn
        // no priceLimit + !zeroForOne => priceLimit = TickMath.MAX_SQRT_RATIO - 1
        // !isToken0 && isExactInput -> amountIn = amount1 —> swap 1->0 —> price0 = qty1/qty0 increase -> willUpTick

        // state = {
        //   amountSpecifiedRemaining: 24295310180196433,
        //   amountCalculated: 0,
        //   baseL: 10**18, // = ONE_ETHER
        //   reinvestL: 0,
        //   sqrtPriceX96: 79228162514264337593543950336, // encodeSqrtRatioX96(1, 1) = Q96
        //   tick: 0
        // }

        // step1 =  {
        //   tickNext: 480, // min(state.tick + 480 , next_initialized_tick) = 480
        //   initialized: false,  // 480 not existed at tick_list provider
        //   sqrtPriceNextX96: 81152542391008068215614429470 // TickMath.getSqrtRatioAtTick(step.tickNext)
        // }

        // step1.usedAmount = SwapMath.calcReachAmount(
        //                         79228162514264337593543950336, // currentPrice = state.sqrtPriceX96
        //                         81152542391008068215614429470, // nextPrice = step1.sqrtPriceNextX96
        //                         10**18                       , // liquidity = state.baseL + state.reinvestL = 10**18 + 0 = 10**18
        //                         5                            , // fee = 5
        //                         true                         , // exactIn
        //                         false                        , // !zeroForOne
        //                     ) RoundDown
        //                      10**18 * 20000 * (81152542391008068215614429470 - 79228162514264337593543950336)
        //                      ________________________________________________________________________________ * 79228162514264337593543950336
        //                          20000 * 79228162514264337593543950336 - 5 * 81152542391008068215614429470
        //                  = _________________________________________________________________________________________________________________
        //                                                                            Q96
        //                  = 24295310180196333
        // exactIn && step1.usedAmount < state.amountSpecifiedRemaining (24295310180196333 < 24295310180196433)
        // --> NOT last step
        // --> state.sqrtPriceX96 = step1.sqrtRatioNextX96 = 81152542391008068215614429470
        //     step1.amountIn = usedAmount = 24295310180196333
        //     step1.deltaL = SwapMath.calcIncrementalLiquidity(
        //                                79228162514264337593543950336, // currentPrice = state.sqrtPriceX96
        //                                81152542391008068215614429470, // targetPrice = step1.sqrtRatioNextX96
        //                                10**18,                      , // liquidity
        //                                24295310180196333            , // abs(usedAmount)
        //                                true                         , // exactIn
        //                                false                        , // !zeroForOne
        //                      ) RoundDown
        //                          10**18 * 79228162514264337593543950336
        //                        ___________________________________________ + 24295310180196333
        //                                          Q96
        //                      = ______________________________________________________________________ * Q96 - 10**18
        //                                      81152542391008068215614429470
        //                      = 6073827545048
        //    step1.amountOut = SwapMath.calcReturnedAmount(
        //                                79228162514264337593543950336, // currentPrice = state.sqrtPriceX96
        //                                81152542391008068215614429470, // targetPrice = step1.sqrtRatioNextX96
        //                                10**18,                      , // liquidity
        //                                6073827545048                , // deltaL
        //                                true                         , // exactIn
        //                                false                        , // !zeroForOne
        //                          ) RoundUp
        //                      = (10**18 + 6073827545048) * 2**96      10**18 * 2**96
        //                        __________________________________ - _________________________________
        //                          81152542391008068215614429470       79228162514264337593543950336
        //                      = -23707188978482100
        // state = {
        //   amountSpecifiedRemaining: 100 //  24295310180196433 - step1.amountIn = 24295310180196433 - 24295310180196333,
        //   amountCalculated: -23707188978482100, // 0 + step1.amount
        //   baseL: 10**18, // = ONE_ETHER
        //   reinvestL: 6073827545048, // 0 + step1.deltaL
        //   sqrtPriceX96: 81152542391008068215614429470, // step1.sqrtRatioNextX96
        //   tick: 480 // not last step + not initialized + !zeroForOne -> tick = step1.tickNext = 480
        // }

        // step2 =  {
        //   tickNext: 960, // min(state.tick + 480 , next_initialized_tick) = 960
        //   initialized: false,  // 480 not existed at tick_list provider
        //   sqrtPriceNextX96: 83123663701510905396168601196 // TickMath.getSqrtRatioAtTick(step.tickNext)
        // }

        // step2.usedAmount = .... > state.amountSpecifiedRemaining = 100 -> last step
        // --> LAST STEP
        // step2.usedAmount = step2.amountIn = state.amountSpecifiedRemaining = 100
        // step2.deltaL = SwapMath.estimateIncrementalLiquidity(
        //                                  100                             , // step2.usedAmount = 100
        //                                  10**18 + 6073827545048          , // state.baseL + state.reinvestL
        //                                  81152542391008068215614429470   , // state.sqrtPriceX96
        //                                  5                               , // fee
        //                                  true                            , // exactIn
        //                                  false                           , // !zeroForOne
        //                      ) RoundUp
        //                            2**96 * (100 * 5)
        //                = _________________________________________
        //                     20000 * 81152542391008068215614429470
        //                = 1 // wrong
        //                = 0 (fix: RoundDown deltaL)
        // step2.sqrtRatioNextX96 = SwapMath.calcFinalPrice(
        //                                  100                             , // step2.usedAmount = 100
        //                                  10**18 + 6073827545048          , // state.baseL + state.reinvestL
        //                                  0                               , // deltaL
        //                                  81152542391008068215614429470   , // state.sqrtPriceX96
        //                                  true                            , // exactIn
        //                                  false                           , // !zeroForOne
        //                           )
        //                                                  100 * 2**96
        //                        10**18 + 6073827545048 + _________________________________
        //                                                  81152542391008068215614429470
        //                   =    ________________________________________________________________ * 81152542391008068215614429470
        //                                10**18 + 6073827545048 + 0
        //                    = 81152542391008076087363229753
        // --> state.sqrtPriceX96 = step1.sqrtRatioNextX96 = 81152542391008076087363229753
        //    step2.amountOut = SwapMath.calcReturnedAmount(
        //                                81152542391008068215614429470, // currentPrice = state.sqrtPriceX96
        //                                81152542391008076087363229753, // targetPrice = step2.sqrtRatioNextX96
        //                                10**18 + 6073827545048       , // liquidity
        //                                0                            , // deltaL
        //                                true                         , // exactIn
        //                                false                        , // !zeroForOne
        //                          ) RoundUp
        //                      = (10**18 + 6073827545048 + 0) * 2**96      (10**18 + 6073827545048) * 2**96
        //                        _____________________________________ - _________________________________
        //                          81152542391008076087363229753           81152542391008068215614429470
        //                      = -95
        // state = {
        //   amountSpecifiedRemaining: 0 //  100 - step2.amountIn = 100 - 100,
        //   amountCalculated: -23707188978482195, // -23707188978482100 + step2.amount = -23707188978482100 + (-95)
        //   baseL: 10**18, // = ONE_ETHER
        //   reinvestL: 6073827545048, // 6073827545048 + 0
        //   sqrtPriceX96: 81152542391008076087363229753, // step2.sqrtRatioNextX96
        //   tick: 480 // last step -> tick = tick at sqrtPriceX96 81152542391008076006211180266
        // }
        const inputAmount = CurrencyAmount.fromRawAmount(USDC, JSBI.BigInt('24295310180196433'))
        const [outputAmount] = await pool.getOutputAmountProMM(inputAmount)
        expect(outputAmount.currency.equals(DAI)).toBe(true)
        expect(outputAmount.quotient).toEqual(JSBI.BigInt('23695329346163753'))
      })

      it('TickMath.getSqrtRatioAtTick', async () => {
        expect(TickMath.getTickAtSqrtRatio(JSBI.BigInt('81152542391008068215614429470'))).toEqual(480)
      })
      it('TickMath.getSqrtRatioAtTick', async () => {
        expect(TickMath.getTickAtSqrtRatio(JSBI.BigInt('81152542391008076006211180266'))).toEqual(480)
      })
    })
  })
})
