import { Percent, Token } from '@kyberswap/ks-sdk-core'
import JSBI from 'jsbi'
import { FeeAmount, TICK_SPACINGS } from '../constants'
import { encodeSqrtRatioX96 } from '../utils/encodeSqrtRatioX96'
import { nearestUsableTick } from '../utils/nearestUsableTick'
import { TickMath } from '../utils/tickMath'
import { Pool } from './pool'
import { Position } from './position'

import { maxLiquidityForAmounts } from '../utils/maxLiquidityForAmounts'

const FEE_AMOUNT = 100

describe('Position', () => {
  const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  const POOL_SQRT_RATIO_START = encodeSqrtRatioX96(100e6, 100e18)
  const POOL_TICK_CURRENT = TickMath.getTickAtSqrtRatio(POOL_SQRT_RATIO_START)
  const TICK_SPACING = TICK_SPACINGS[FEE_AMOUNT]
  const DAI_USDC_POOL = new Pool(DAI, USDC, FEE_AMOUNT, POOL_SQRT_RATIO_START, 0, 0, POOL_TICK_CURRENT, [])
  it('can be constructed around 0 tick', () => {
    const position = new Position({
      pool: DAI_USDC_POOL,
      liquidity: 1,
      tickLower: -10,
      tickUpper: 10
    })
    expect(position.liquidity).toEqual(JSBI.BigInt(1))
  })
  it('can use min and max ticks', () => {
    const position = new Position({
      pool: DAI_USDC_POOL,
      liquidity: 1,
      tickLower: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACING),
      tickUpper: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACING)
    })
    expect(position.liquidity).toEqual(JSBI.BigInt(1))
  })

  it('tick lower must be less than tick upper', () => {
    expect(
      () =>
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 1,
          tickLower: 10,
          tickUpper: -10
        })
    ).toThrow('TICK_ORDER')
  })

  it('tick lower cannot equal tick upper', () => {
    expect(
      () =>
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 1,
          tickLower: -10,
          tickUpper: -10
        })
    ).toThrow('TICK_ORDER')
  })

  it('tick lower must be multiple of tick spacing', () => {
    expect(
      () =>
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 1,
          tickLower: -5,
          tickUpper: 10
        })
    ).toThrow('TICK_LOWER')
  })

  it('tick lower must be greater than MIN_TICK', () => {
    expect(
      () =>
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 1,
          tickLower: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACING) - TICK_SPACING,
          tickUpper: 10
        })
    ).toThrow('TICK_LOWER')
  })

  it('tick upper must be multiple of tick spacing', () => {
    expect(
      () =>
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 1,
          tickLower: -10,
          tickUpper: 15
        })
    ).toThrow('TICK_UPPER')
  })

  it('tick upper must be less than MAX_TICK', () => {
    expect(
      () =>
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 1,
          tickLower: -10,
          tickUpper: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACING) + TICK_SPACING
        })
    ).toThrow('TICK_UPPER')
  })
  describe('#amount0', () => {
    //POOL_SQRT_RATIO_START = 79228162514264337593543 (100e6 / 100e18)
    //POOL_TICK_CURRENT = -276325
    //TICK_SPACING = 10
    //nearestUsableTick = -276320
    it('is correct for price above', () => {
      //tickLower = -276310
      //tickUpper = -276300
      //POOL_TICK_CURRENT < tickLower <=> P < Pa
      // => amount0 = getAmount0Delta(tickLower, tickUpper)
      // X96(A) = getSqrtRatioAtTick(-276310) = 79283743674911602647011
      // X96(B) = getSqrtRatioAtTick(-276300) = 79323393475916303018909
      // (L<<96).(X96(B) - X96(A))      (100e12 << 96) . (79323393475916303018909 - 79283743674911602647011)
      // __________________________ = ________________________________________________________________________
      //      X96(B) . X96(A)               79323393475916303018909 . 79283743674911602647011
      // roundUp = false => = [(L<<96).(X96(B) - X96(A)) / X96(B)] / X96(A)
      // = (((100 * 10^12 << 96) * (79323393475916303018909 - 79283743674911602647011)) /  79323393475916303018909) / 79283743674911602647011
      // = 49949961958869841
      expect(
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e12,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        }).amount0.quotient.toString()
      ).toEqual('49949961958869841')
    })
    it('is correct for price below', () => {
      //tickLower = -276340
      //tickUpper = -276330
      //POOL_TICK_CURRENT > tickUpper => P > Pb
      //=> amount0 = 0
      expect(
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING
        }).amount0.quotient.toString()
      ).toEqual('0')
    })
    it('is correct for in-range position', () => {
      //POOL_TICK_CURRENT = -276325
      //tickLower = -276340
      //tickUpper = -276300
      //tickLower < POOL_TICK_CURRENT < tickUpper
      // => amount0 = getAmount0Delta(tickCurrent, tickUpper)
      // X96(A) = X96(current) = POOL_SQRT_RATIO_START = 79228162514264337593543
      // X96(B) = getSqrtRatioAtTick(-276300) = 79323393475916303018909
      // => amount0 = (((100 * 10^18 << 96) * (79323393475916303018909 - 79228162514264337593543)) /  79323393475916303018909) / 79228162514264337593543
      // = 120054069145287995769396
      //TODO: getSqrtRatioAtTick(currentTick) != POOL_SQRT_RATIO_START
      expect(
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        }).amount0.quotient.toString()
      ).toEqual('120054069145287995769396')
    })
  })
  describe('#amount1', () => {
    it('is correct for price above', () => {
      expect(
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        }).amount1.quotient.toString()
      ).toEqual('0')
    })
    it('is correct for price below', () => {
      //POOL_TICK_CURRENT = -276325
      //tickLower: -276340
      //tickUpper: -276330
      //tickLower < tickUpper < POOL_TICK_CURRENT
      //amount1 = getAmount1Delta(tickLower, tickUpper)
      //X96(A) = getSqrtRatioAtTick(-276340) = 79164913146002951047547
      //X96(B) = getSqrtRatioAtTick(-276330) = 79204503519858955838074
      //                L.(X96(B) - X96(A))
      //        = __________________________
      //                    2^96
      // = (100*10^18) * (79204503519858955838074 - 79164913146002951047547) / 2^96
      // = 49970077052
      expect(
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING
        }).amount1.quotient.toString()
      ).toEqual('49970077052')
    })
    it('is correct for in-range position', () => {
      //POOL_TICK_CURRENT = -276325
      //tickLower: -276340
      //tickUpper: -276300
      //tickLower < POOL_TICK_CURRENT < tickUpper
      //amount1 = getAmount1Delta(tickLower, POOL_TICK_CURRENT)
      //X96(A) = getSqrtRatioAtTick(-276340) = 79164913146002951047547
      //X96(B) = POOL_SQRT_RATIO_START = 79228162514264337593543
      //amount1 = (100*10^18) * (79228162514264337593543 - 79164913146002951047547) / 2^96
      //        = 79831926242
      expect(
        new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        }).amount1.quotient.toString()
      ).toEqual('79831926242')
    })
  })
  describe('#mintAmountsWithSlippage', () => {
    describe('0 slippage', () => {
      const slippageTolerance = new Percent(0)
      it('is correct for positions below', () => {
        //POOL_TICK_CURRENT = -276325
        // POOL_SQRT_RATIO_START = 79228162514264337593543
        //tickLower: -276310
        //tickUpper: -276300
        // X96(A) = getSqrtRatioAtTick(-276310) = 79283743674911602647011
        // X96(B) = getSqrtRatioAtTick(-276300) = 79323393475916303018909

        //positionThatWillBeCreated. recalculate L with passed mintAmounts (no slippage)
        // X96(A) = getSqrtRatioAtTick(-276310) = 79283743674911602647011
        // X96(B) = getSqrtRatioAtTick(-276300) = 79323393475916303018909
        //           (L<<96).(X96(B) - X96(A))      (100e18 << 96) . (79323393475916303018909 - 79283743674911602647011)
        //amount0 =  __________________________ = ________________________________________________________________________
        //               X96(B) . X96(A)               79323393475916303018909 . 79283743674911602647011
        //
        // roundUp = true <=> roundUP after / X96(B), then after / X96(B)
        // amount0 = 49949961958869841754182
        // amount1 = 0
        // => Recalculate the L = maxLiquidityForAmounts(X96(current), X96(A), X96(B), amount0, amount1)
        //        amount0 . P.Pb                    amount1
        //L0 =  ____________________        L1 = ______________
        //             Pb - P                        P - Pa
        //imprecise => L0 = P.Pb/Q96, then .amount0, then (Pb - P)
        //=> L = L0 = ((79323393475916303018909 * 79283743674911602647011 /2^96) * 49949961958869841754182) / (79323393475916303018909 - 79283743674911602647011)
        //     = 99999999999999999968

        // we have recalculated L, now we calculate the minimum amount0 and minimum amount after slippage adjusted with the new L
        // poolLower is pool where currentX96 -= slippage
        // poolUpper is pool where currentX96 +== slippage
        // Returns the minimum amounts that must be sent in order to safely mint the amount of liquidity held by the position
        // meanwhile      amount0 = getAmount0Delta( X96(current), X96(B))
        // so the minimum amount0 = getAmount0Delta( X96(current) + slippage, X96(B), L)  = getAmount0Delta(poolUpper, X96(B), L)
        //    the minimum amount1 = getAmount1Delta( X96(A), X96(current) - slippage)  = getAmount0Delta(X96(A), poolLower, L)
        // (L<<96).(X96(B) - X96(A))      (99999999999999999968 << 96) * (79323393475916303018909 - 79283743674911602647011)
        // __________________________ = ________________________________________________________________________
        //      X96(B) . X96(A)               79323393475916303018909 * 79283743674911602647011
        // = 49949961958869841738197
        // roundUp = true => amount0 = 49949961958869841738198
        //                   amount1 = 0
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        })
        const { amount0, amount1 } = position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('49949961958869841738198')
        expect(amount1.toString()).toEqual('0')
      })
      it('is correct for positions above', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING
        })

        const { amount0, amount1 } = position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('0')
        expect(amount1.toString()).toEqual('49970077053')
      })

      it('is correct for positions within', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        })

        const { amount0, amount1 } = position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('120054069145287995740584')
        expect(amount1.toString()).toEqual('79831926243')
      })
    })
    describe('.05% slippage', () => {
      const slippageTolerance = new Percent(5, 10000)
      it('is correct for positions below', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        })

        const { amount0, amount1 } = position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('49949961958869841738198')
        expect(amount1.toString()).toEqual('0')
      })

      it('is correct for positions above', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING
        })

        const { amount0, amount1 } = position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('0')
        expect(amount1.toString()).toEqual('49970077053')
      })

      it('is correct for positions within', () => {
        //POOL_TICK_CURRENT = -276325
        // POOL_SQRT_RATIO_START = 79228162514264337593543
        //tickLower: -276340
        //tickUpper: -276300
        // X96(A) = getSqrtRatioAtTick(-276340) = 79164913146002951047547
        // X96(B) = getSqrtRatioAtTick(-276300) = 79323393475916303018909
        // Returns the minimum amounts that must be sent in order to mint the amount of liquidity held by the position at
        //             (L<<96).(X96(B) - P)        ((100*10^18) << 96) * (79323393475916303018909 - 79228162514264337593543)
        // amount 0 = __________________________ = ________________________________________________________________________
        //                   X96(B) . P               79323393475916303018909 * 79228162514264337593543
        //          =
        //             L.(P - X96(A))               100*10^18 * (79228162514264337593543 - 79164913146002951047547)
        // amount 1 = __________________________ = ________________________________________________________________________
        //                  Q96                                                 Q96
        // roundUp = true <=> amount0  roundUP after / X96(B), then after / X96(B)
        //                    amount1  roundUP after / Q96
        // amount0 quotient = 120054069145287995769396, roundUp => 120054069145287995769397
        // amount1 quotient =  79831926242, roundUp => 79831926243

        //Recalculate L maxLiquidityForAmounts(X96(current), X96(A), X96(B), amount0, amount1)
        //        amount0 . P.Pb                  amount1*Q96
        //L0 =  ____________________        L1 = ______________
        //        (Pb - P)*Q96                        P - Pa
        //imprecise => L0 = P.Pb/Q96, then .amount0, then (Pb - P)
        //L0 = ((79228162514264337593543 * 79323393475916303018909/ 2^96) * 120054069145287995769397) / (79323393475916303018909 - 79228162514264337593543)
        //L1 = 79831926243 * 2^96 / (79228162514264337593543 - 79164913146002951047547) = 100000000001083227176
        //L0 = 99999999999999999976
        //L1 = 100000000001083227176
        //=> L = min = 99999999999999999976

        // we have recalculated L, now we calculate the minimum amount0 and minimum amount after slippage adjusted with the new L
        // poolLower is pool where currentX96 -= slippage
        // poolUpper is pool where currentX96 +== slippage
        // token0Price = [6277101735386680763835638836457564104275292849, 6277101735386680763835789423207666416102355444464034512896]
        // feeLower = [9995, 10000]
        // feeUpper = [10005, 10000]
        // PriceLower = token0Price * feeLower
        //            = [6277101735386680763835638836457564104275292849 * 9995, 6277101735386680763835789423207666416102355444464034512896 * 10000]
        //            = [62739631845189874234537210170393353222231552025755, 62771017353866807638357894232076664161023554444640345128960000]
        // PriceUpper = token0Price * feeUpper
        //            = [62802402862543741042175566558757928863274304954245, 62771017353866807638357894232076664161023554444640345128960000]
        // X96Lower   = encodeSqrtRatioX96(num, den) = sqrt((num << 192)/den)
        //            = sqrt(6273963184518987423453721017039335322223155202)
        //            = 79208352997136529422884
        // X96Upper   = sqrt(6280240286254374104217556655875792886327430495)
        //            = 79247967079631601766366
        // check the sqrt function of core to handle the value > MAX_SAFE_INT (which can be handle by Math.sqrt)

        // Returns the minimum amounts that must be sent in order to safely mint the amount of liquidity held by the position
        // meanwhile      amount0 = getAmount0Delta( X96(current), X96(B))
        // so the minimum amount0 = getAmount0Delta( X96Upper, X96(B), L)  = getAmount0Delta(poolUpper, X96(B), L)
        //    the minimum amount1 = getAmount1Delta( X96(A), X96Lower)  = getAmount0Delta(X96(A), poolLower, L)
        //                  (L<<96).(X96(B) - X96(A))      (99999999999999999976 << 96) * (79323393475916303018909 - 79247967079631601766366)
        // minimum amount0 = __________________________ = ________________________________________________________________________
        //                      X96(B) . X96(A)               79323393475916303018909 * 79247967079631601766366
        //                 = 95063440240746211432006
        //         roundUp = 95063440240746211432007
        //                      L . (X96(B) - X96(A))         99999999999999999976 * (79208352997136529422884 - 79164913146002951047547)
        // minimum amount1 = ___________________________ = ___________________________________________________________________________
        //                              Q96                                             2^96
        //                 = 54828800461
        //         roundUp = 54828800461
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        })

        const { amount0, amount1 } = position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('95063440240746211432007')
        expect(amount1.toString()).toEqual('54828800461')
      })
    })
    describe('5% slippage tolerance', () => {
      const slippageTolerance = new Percent(5, 100)

      it('is correct for pool at min price', () => {
        const position = new Position({
          pool: new Pool(DAI, USDC, FEE_AMOUNT, TickMath.MIN_SQRT_RATIO, 0, 0, TickMath.MIN_TICK, []),
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        })

        const { amount0, amount1 } = position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('49949961958869841754181')
        expect(amount1.toString()).toEqual('0')
      })

      it('is correct for pool at max price', () => {
        const position = new Position({
          pool: new Pool(
            DAI,
            USDC,
            FEE_AMOUNT,
            JSBI.subtract(TickMath.MAX_SQRT_RATIO, JSBI.BigInt(1)),
            0,
            0,
            TickMath.MAX_TICK - 1,
            []
          ),
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        })

        const { amount0, amount1 } = position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('0')
        expect(amount1.toString()).toEqual('50045084659')
      })
    })
  })

  describe('#burnAmountsWithSlippage', () => {
    describe('0 slippage', () => {
      const slippageTolerance = new Percent(0)

      it('is correct for positions below', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        })

        const { amount0, amount1 } = position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('49949961958869841754181')
        expect(amount1.toString()).toEqual('0')
      })

      it('is correct for positions above', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING
        })

        const { amount0, amount1 } = position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('0')
        expect(amount1.toString()).toEqual('49970077052')
      })

      it('is correct for positions within', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        })

        const { amount0, amount1 } = position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('120054069145287995769396')
        expect(amount1.toString()).toEqual('79831926242')
      })
    })

    describe('.05% slippage', () => {
      const slippageTolerance = new Percent(5, 10000)

      it('is correct for positions below', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        })
        const { amount0, amount1 } = position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('49949961958869841754181')
        expect(amount1.toString()).toEqual('0')
      })

      it('is correct for positions above', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING
        })
        const { amount0, amount1 } = position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('0')
        expect(amount1.toString()).toEqual('49970077052')
      })

      it('is correct for positions within', () => {
        const position = new Position({
          pool: DAI_USDC_POOL,
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        })
        const { amount0, amount1 } = position.burnAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('95063440240746211454822')
        expect(amount1.toString()).toEqual('54828800460')
      })
    })

    describe('5% slippage tolerance', () => {
      const slippageTolerance = new Percent(5, 100)

      it('is correct for pool at min price', () => {
        const position = new Position({
          pool: new Pool(DAI, USDC, FEE_AMOUNT, TickMath.MIN_SQRT_RATIO, 0, 0, TickMath.MIN_TICK, []),
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        })

        const { amount0, amount1 } = position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('49949961958869841738198')
        expect(amount1.toString()).toEqual('0')
      })

      it('is correct for pool at max price', () => {
        const position = new Position({
          pool: new Pool(
            DAI,
            USDC,
            FEE_AMOUNT,
            JSBI.subtract(TickMath.MAX_SQRT_RATIO, JSBI.BigInt(1)),
            0,
            0,
            TickMath.MAX_TICK - 1,
            []
          ),
          liquidity: 100e18,
          tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
          tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
        })

        const { amount0, amount1 } = position.mintAmountsWithSlippage(slippageTolerance)
        expect(amount0.toString()).toEqual('0')
        expect(amount1.toString()).toEqual('50045084660')
      })
    })
  })

  describe('#mintAmounts', () => {
    it('is correct for price above', () => {
      const { amount0, amount1 } = new Position({
        pool: DAI_USDC_POOL,
        liquidity: 100e18,
        tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING,
        tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
      }).mintAmounts
      expect(amount0.toString()).toEqual('49949961958869841754182')
      expect(amount1.toString()).toEqual('0')
    })
    it('is correct for price below', () => {
      const { amount0, amount1 } = new Position({
        pool: DAI_USDC_POOL,
        liquidity: 100e18,
        tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
        tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING
      }).mintAmounts
      expect(amount0.toString()).toEqual('0')
      expect(amount1.toString()).toEqual('49970077053')
    })
    it('is correct for in-range position', () => {
      const { amount0, amount1 } = new Position({
        pool: DAI_USDC_POOL,
        liquidity: 100e18,
        tickLower: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) - TICK_SPACING * 2,
        tickUpper: nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING) + TICK_SPACING * 2
      }).mintAmounts
      // note these are rounded up
      expect(amount0.toString()).toEqual('120054069145287995769397')
      expect(amount1.toString()).toEqual('79831926243')
    })
  })
})
