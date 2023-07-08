import JSBI from 'jsbi'
import { FeeAmount } from '../constants'
import { NEGATIVE_ONE, Q96, ZERO } from '../internalConstants'
import { FullMath } from './fullMath'
import { SqrtPriceMath } from './sqrtPriceMath'

const BPS = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(5))
const TWO_BPS = JSBI.multiply(BPS, JSBI.BigInt(2))
export abstract class SwapMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static computeSwapStepPromm(
    sqrtRatioCurrentX96: JSBI,
    sqrtRatioTargetX96: JSBI,
    liquidity: JSBI,
    amountRemaining: JSBI,
    feePips: FeeAmount,
    exactIn: boolean,
    zeroForOne: boolean 
  ): [JSBI, JSBI, JSBI, JSBI]{
    const returnValues = {sqrtRatioNextX96: ZERO, amountIn: ZERO, amountOut: ZERO, deltaL: ZERO}
    if (JSBI.equal(sqrtRatioCurrentX96, sqrtRatioTargetX96)) return [sqrtRatioCurrentX96, ZERO, ZERO, ZERO]
    let usedAmount = SwapMath.calcReachAmount(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, feePips, exactIn, zeroForOne)
    console.log("======usedAmount of tick 480,", usedAmount.toString())
    if ((exactIn && JSBI.greaterThanOrEqual(usedAmount, amountRemaining)) || (!exactIn && JSBI.lessThanOrEqual(usedAmount, amountRemaining)) ) {
      usedAmount = amountRemaining;
    }else {
      returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96
    } 
    returnValues.amountIn = usedAmount
    
    const absUsedAmount = JSBI.greaterThanOrEqual(usedAmount, ZERO) ? usedAmount :  JSBI.multiply(usedAmount, JSBI.BigInt(-1))
    
    if (JSBI.equal(returnValues.sqrtRatioNextX96, ZERO)) {
      //last step 
      returnValues.deltaL = SwapMath.estimateIncrementalLiquidity(
        absUsedAmount,
        liquidity,
        sqrtRatioCurrentX96,
        feePips,
        exactIn,
        zeroForOne
      );

    
      returnValues.sqrtRatioNextX96 = SwapMath.calcFinalPrice(absUsedAmount, liquidity, returnValues.deltaL, sqrtRatioCurrentX96, exactIn, zeroForOne)
    }else {
      returnValues.deltaL = SwapMath.calcIncrementalLiquidity(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, absUsedAmount, exactIn, zeroForOne)
    } 
    returnValues.amountOut = SwapMath.calcReturnedAmount(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, returnValues.deltaL, exactIn, zeroForOne)
    return [returnValues.sqrtRatioNextX96, returnValues.amountIn, returnValues.amountOut, returnValues.deltaL]
  }

  public static calcReachAmount(
    sqrtRatioCurrentX96: JSBI,
    sqrtRatioTargetX96: JSBI,
    liquidity: JSBI, 
    feePips: FeeAmount,
    exactIn: boolean,
    zeroForOne: boolean ){
    const absPriceDiff = sqrtRatioCurrentX96 >= sqrtRatioTargetX96 ? JSBI.subtract(sqrtRatioCurrentX96, sqrtRatioTargetX96) :  JSBI.subtract(sqrtRatioTargetX96, sqrtRatioCurrentX96)

    let reachAmount
    if (exactIn) {
      if (zeroForOne){
        //exactInput + swap 0 -> 1
        const denominator = JSBI.subtract(JSBI.multiply(TWO_BPS, sqrtRatioTargetX96), JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioCurrentX96))
        const numerator = FullMath.mulDiv(liquidity, JSBI.multiply(TWO_BPS, absPriceDiff), denominator)
        reachAmount = FullMath.mulDiv(numerator, Q96, sqrtRatioCurrentX96)
      }else {
        //exactInput + swap 1 -> 0
        const denominator = JSBI.subtract(JSBI.multiply(TWO_BPS, sqrtRatioCurrentX96), JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioTargetX96))
        const numerator = FullMath.mulDiv(liquidity, JSBI.multiply(TWO_BPS, absPriceDiff), denominator)
        reachAmount = FullMath.mulDiv(numerator, sqrtRatioCurrentX96, Q96)
      }
    }else {
      if (zeroForOne) {
        //exactOut + swap 0 -> 1
        const denominator = JSBI.subtract(JSBI.multiply(TWO_BPS, sqrtRatioCurrentX96), JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioTargetX96))
        let numerator = JSBI.subtract(denominator, JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioCurrentX96))
        numerator = FullMath.mulDiv(JSBI.leftShift(liquidity, JSBI.BigInt(96)), numerator, denominator)
        reachAmount = JSBI.divide( 
          FullMath.mulDiv(numerator, absPriceDiff, sqrtRatioCurrentX96),
          sqrtRatioTargetX96)
        reachAmount = JSBI.multiply(reachAmount, JSBI.BigInt(-1)) 
      } else {
        const denominator = JSBI.subtract(JSBI.multiply(TWO_BPS, sqrtRatioTargetX96), JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioCurrentX96))
        let numerator = JSBI.subtract(denominator, JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioTargetX96))
        numerator = FullMath.mulDiv(liquidity, numerator, denominator)
        reachAmount = FullMath.mulDiv(numerator, absPriceDiff, Q96)
        reachAmount = JSBI.multiply(reachAmount, JSBI.BigInt(-1)) 
      } 
    } 
    return reachAmount
  }

  public static calcReturnedAmount(
    sqrtRatioCurrentX96: JSBI,
    sqrtRatioTargetX96: JSBI,
    liquidity: JSBI,
    deltaL: JSBI,
    exactIn: boolean,
    zeroForOne: boolean
  ): JSBI {
    let returnedAmount
    if (zeroForOne) {
      if (exactIn) {
        returnedAmount = JSBI.add(
          FullMath.mulDivRoundingUp(deltaL, sqrtRatioTargetX96, Q96),
          JSBI.multiply(FullMath.mulDiv(liquidity, JSBI.subtract(sqrtRatioCurrentX96, sqrtRatioTargetX96), Q96), JSBI.BigInt(-1)) 
        )
      }else {
        returnedAmount = JSBI.add(
          FullMath.mulDivRoundingUp(deltaL, sqrtRatioTargetX96, Q96),
          FullMath.mulDivRoundingUp(liquidity, JSBI.subtract(sqrtRatioTargetX96, sqrtRatioCurrentX96), Q96)
        )
      }
    }else {
      returnedAmount = JSBI.add(
        FullMath.mulDivRoundingUp(JSBI.add(liquidity, deltaL), Q96, sqrtRatioTargetX96 ),
        JSBI.multiply(FullMath.mulDivRoundingUp(liquidity, Q96, sqrtRatioCurrentX96), JSBI.BigInt(-1)) 
      )
    }

    if (exactIn && JSBI.equal(returnedAmount, JSBI.BigInt(1))) {
      returnedAmount = ZERO
    }
    return returnedAmount
  }

  public static calcIncrementalLiquidity(
    sqrtRatioCurrentX96: JSBI,
    sqrtRatioTargetX96: JSBI,
    liquidity: JSBI,
    absAmount: JSBI,
    exactIn: boolean,
    zeroForOne: boolean
  ): JSBI {
    // this is when we reach the target, then we have target_X96
    if (zeroForOne) {
      const tmp1 = FullMath.mulDiv(liquidity, Q96, sqrtRatioCurrentX96)
      const tmp2 = exactIn ? JSBI.add(tmp1, absAmount) : JSBI.subtract(tmp1, absAmount)
      const tmp3 = FullMath.mulDiv(sqrtRatioTargetX96, tmp2, Q96)
      return JSBI.greaterThan(tmp3, liquidity) ? JSBI.subtract(tmp3, liquidity) : ZERO
    } else {
      const tmp1 = FullMath.mulDiv(liquidity, sqrtRatioCurrentX96, Q96)
      const tmp2 = exactIn ? JSBI.add(tmp1, absAmount) : JSBI.subtract(tmp1, absAmount)
      const tmp3 = FullMath.mulDiv(tmp2, Q96, sqrtRatioTargetX96)
      return JSBI.greaterThan(tmp3, liquidity) ? JSBI.subtract(tmp3, liquidity) : ZERO
    } 
  }

  public static estimateIncrementalLiquidity(
    absAmount: JSBI,
    liquidity: JSBI,
    sqrtRatioCurrentX96: JSBI,
    feePips: FeeAmount,
    exactIn: boolean,
    zeroForOne: boolean
  ) : JSBI {
    // this is when we didn't reach the target (last step before loop end), then we have to recalculate the target_X96, deltaL ...
    let deltaL
    let fee = JSBI.BigInt(feePips)
    if (exactIn) {
      if (zeroForOne) {
        // deltaL = feeInBps * absDelta * currentSqrtP / 2
        deltaL = FullMath.mulDiv(sqrtRatioCurrentX96, JSBI.multiply(absAmount, fee), JSBI.leftShift(TWO_BPS, JSBI.BigInt(96)));
      }else {
        // deltaL = feeInBps * absDelta * / (currentSqrtP * 2)
        // Because nextSqrtP = (liquidity + absDelta / currentSqrtP) * currentSqrtP / (liquidity + deltaL)
        // so we round down deltaL, to round up nextSqrtP
        deltaL = FullMath.mulDiv(
          Q96,
          JSBI.multiply(absAmount, fee),
          JSBI.multiply(TWO_BPS, sqrtRatioCurrentX96)
        );
      }
    }else {
      // obtain the smaller root of the quadratic equation
      // ax^2 - 2bx + c = 0 such that b > 0, and x denotes deltaL
      let a = fee
      let b = JSBI.subtract(BPS, fee)
      let c = JSBI.multiply(JSBI.multiply(fee, liquidity), absAmount)
      if (zeroForOne) {
        b = JSBI.subtract(b, FullMath.mulDiv(JSBI.multiply(BPS, absAmount), sqrtRatioCurrentX96, Q96))
        c = FullMath.mulDiv(c, sqrtRatioCurrentX96, Q96)
      }else{
        b = JSBI.subtract(b, FullMath.mulDiv(JSBI.multiply(BPS, absAmount), Q96, sqrtRatioCurrentX96))
        c = FullMath.mulDiv(c, Q96, sqrtRatioCurrentX96)
      }
      deltaL = FullMath.getSmallerRootOfQuadEqn(a, b, c);
    }
    return deltaL
  }

  public static calcFinalPrice(
    absAmount: JSBI,
    liquidity: JSBI,
    deltaL: JSBI,
    sqrtRatioCurrentX96: JSBI,
    exactIn: boolean,
    zeroForOne: boolean
  ) :JSBI {
    if (zeroForOne){
      let tmp = FullMath.mulDiv(absAmount, sqrtRatioCurrentX96, Q96)
      if (exactIn) {
        return FullMath.mulDivRoundingUp(JSBI.add(liquidity, deltaL), sqrtRatioCurrentX96, JSBI.add(liquidity, tmp)) 
      }else {
        return FullMath.mulDiv(JSBI.add(liquidity, deltaL), sqrtRatioCurrentX96, JSBI.subtract(liquidity, tmp)) 
      }
    }else{
      let tmp = FullMath.mulDiv(absAmount, Q96, sqrtRatioCurrentX96)
      if (exactIn) {
        return FullMath.mulDiv(JSBI.add(liquidity, tmp), sqrtRatioCurrentX96, JSBI.add(liquidity, deltaL)) 
      }else {
        return FullMath.mulDivRoundingUp(JSBI.subtract(liquidity, tmp), sqrtRatioCurrentX96, JSBI.add(liquidity, deltaL)) 
      }
    } 
  }

  public static computeSwapStep(
    sqrtRatioCurrentX96: JSBI,
    sqrtRatioTargetX96: JSBI,
    liquidity: JSBI,
    amountRemaining: JSBI,
    feePips: FeeAmount
  ): [JSBI, JSBI, JSBI, JSBI] {
    const returnValues: Partial<{
      sqrtRatioNextX96: JSBI
      amountIn: JSBI
      amountOut: JSBI
      feeAmount: JSBI
    }> = {}
    //sqrtRatioCurrentX96 > sqrtRatioTargetX96 means direction = Pb -> Pa <=> add zero, remove one <=> zeroForOne true
    const zeroForOne = JSBI.greaterThanOrEqual(sqrtRatioCurrentX96, sqrtRatioTargetX96)
    const exactIn = JSBI.greaterThanOrEqual(amountRemaining, ZERO)

    if (exactIn) {
      //reduce fee
      const amountRemainingLessFee = JSBI.divide(
        JSBI.multiply(amountRemaining, JSBI.subtract(BPS, JSBI.BigInt(feePips))),
        BPS
      )
      // calculate amount in between 2 ticks
      // if zeroForOne -> calc the input amount of token0 -> getAmount0Delta,
      //               -> sqrtRatioCurrentX96 > sqrtRatioTargetX96 -> Pa = sqrtRatioTargetX96
      //                                                              Pb = sqrtRatioCurrentX96
      // if !zeroForOne -> calc the input amount of token1 -> getAmount1Delta
      //                -> sqrtRatioCurrentX96 < sqrtRatioTargetX96 -> Pa = sqrtRatioCurrentX96
      //                                                               Pb = sqrtRatioTargetX96
      returnValues.amountIn = zeroForOne
        ? SqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true)
        : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true)

      if (JSBI.greaterThanOrEqual(amountRemainingLessFee, returnValues.amountIn!)) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96
      } else {
        // case amountIn calculated by next tick price > amountRemainingLessFee
        // so must to recalculate the sqrtRatioNextX96 by the amountRemainingLessFee
        // and update the amountin accordingly later, base on the recalculated sqrtRatioNextX96
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(
          sqrtRatioCurrentX96,
          liquidity,
          amountRemainingLessFee,
          zeroForOne
        )
      }
    } else {
      // exactOut
      // calculate amount out between 2 ticks
      // if zeroForOne -> calc the ouput amount of token1 -> getAmount1Delta
      //               -> sqrtRatioCurrentX96 > sqrtRatioTargetX96 -> Pa = sqrtRatioTargetX96
      //                                                              Pb = sqrtRatioCurrentX96
      // if !zeroForOne -> calc the ouput amount of token0 -> getAmount0Delta
      //                -> sqrtRatioCurrentX96 < sqrtRatioTargetX96 -> Pa = sqrtRatioCurrentX96
      //                                                               Pb = sqrtRatioTargetX96
      returnValues.amountOut = zeroForOne
        ? SqrtPriceMath.getAmount1Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, false)
        : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, false)
      if (JSBI.greaterThanOrEqual(JSBI.multiply(amountRemaining, NEGATIVE_ONE), returnValues.amountOut)) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromOutput(
          sqrtRatioCurrentX96,
          liquidity,
          JSBI.multiply(amountRemaining, NEGATIVE_ONE),
          zeroForOne
        )
      }
    }

    const max = JSBI.equal(sqrtRatioTargetX96, returnValues.sqrtRatioNextX96)

    //recalculate amountIn/Out base on sqrtRatioNextX96 recalculated if needed
    if (zeroForOne) {
      returnValues.amountIn =
        max && exactIn
          ? returnValues.amountIn
          : SqrtPriceMath.getAmount0Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, true)
      returnValues.amountOut =
        max && !exactIn
          ? returnValues.amountOut
          : SqrtPriceMath.getAmount1Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, false)
    } else {
      returnValues.amountIn =
        max && exactIn
          ? returnValues.amountIn
          : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, true)
      returnValues.amountOut =
        max && !exactIn
          ? returnValues.amountOut
          : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, false)
    }

    if (!exactIn && JSBI.greaterThan(returnValues.amountOut!, JSBI.multiply(amountRemaining, NEGATIVE_ONE))) {
      returnValues.amountOut = JSBI.multiply(amountRemaining, NEGATIVE_ONE)
    }

    if (exactIn && JSBI.notEqual(returnValues.sqrtRatioNextX96, sqrtRatioTargetX96)) {
      // we didn't reach the target, so take the remainder of the maximum input as fee
      returnValues.feeAmount = JSBI.subtract(amountRemaining, returnValues.amountIn!)
    } else {
      returnValues.feeAmount = FullMath.mulDivRoundingUp(
        returnValues.amountIn!,
        JSBI.BigInt(feePips),
        JSBI.subtract(BPS, JSBI.BigInt(feePips))
      )
    }

    return [returnValues.sqrtRatioNextX96!, returnValues.amountIn!, returnValues.amountOut!, returnValues.feeAmount!]
  }
}
