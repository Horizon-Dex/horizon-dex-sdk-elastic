import { MaxUint256 } from '@kyberswap/ks-sdk-core'
import { FeeAmount, MIN_LIQUIDITY } from '../constants'
import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { ONE, ZERO, Q96 } from '../internalConstants'
import { FullMath } from './fullMath'

const MaxUint160 = JSBI.subtract(JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(160)), ONE)

const MAX_FEE = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(5))

function multiplyIn256(x: JSBI, y: JSBI): JSBI {
  const product = JSBI.multiply(x, y)
  return JSBI.bitwiseAnd(product, MaxUint256)
}

function addIn256(x: JSBI, y: JSBI): JSBI {
  const sum = JSBI.add(x, y)
  return JSBI.bitwiseAnd(sum, MaxUint256)
}

export abstract class SqrtPriceMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static getAmount0Unlock(sqrtRatioInitX96: JSBI) {
    return FullMath.mulDivRoundingUp(JSBI.BigInt(MIN_LIQUIDITY), Q96, sqrtRatioInitX96)
  }

  public static getAmount1Unlock(sqrtRatioInitX96: JSBI) {
    return FullMath.mulDivRoundingUp(JSBI.BigInt(MIN_LIQUIDITY), sqrtRatioInitX96, Q96)
  }
  //L value = encodeSqrt = X96
  //Come from equation
  // (x + L/sqrt(Pb)).(y + L.sqrt(Pa)) = L^2
  public static getAmount0Delta(sqrtRatioAX96: JSBI, sqrtRatioBX96: JSBI, liquidity: JSBI, roundUp: boolean): JSBI {
    //getAmount0Delta equivalent when y= 0
    //X96(A) -> X96(B) | L
    // (L<<96).(X96(B) - X96(A))
    // __________________________
    //      X96(B) . X96(A)
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
    }

    const numerator1 = JSBI.leftShift(liquidity, JSBI.BigInt(96))
    const numerator2 = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96)
    return roundUp
      ? FullMath.mulDivRoundingUp(FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), ONE, sqrtRatioAX96)
      : JSBI.divide(JSBI.divide(JSBI.multiply(numerator1, numerator2), sqrtRatioBX96), sqrtRatioAX96)
  }

  public static getAmount0DeltaFeeCompounding(
    sqrtRatioAX96: JSBI,
    sqrtRatioBX96: JSBI,
    liquidity: JSBI,
    feePips: FeeAmount,
    roundUp: boolean
  ): [JSBI, JSBI] {
    //getAmount0Delta equivalent when y= 0
    //  L_delta = x_delta.fee.x96(B) / 2            (1)
    //  X96(A) = (L + L_delta) / (x + x_delta)
    //            (L + L_delta) . X96(B)
    //         = ______________________
    //            (x + x_delta).X96(B)
    //
    //            (L + L_delta) . X96(B)
    //         =  ______________________            (2)
    //             L + x_delta.X96(B)
    // (1) + (2)
    //            2.(L<<96).(X96(B) - X96(A))
    // x_delta = ___________________________________
    //            X96(B).(2.X96(A) - fee.X96(B))
    // L_delta = x_delta.fee.x96(B) / 2 / Q96
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
    }

    const numerator1 = JSBI.multiply(JSBI.BigInt(2), JSBI.leftShift(liquidity, JSBI.BigInt(96)))
    const numerator2 = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96)
    const denominator = JSBI.subtract(
      JSBI.multiply(JSBI.BigInt(2), sqrtRatioAX96),
      JSBI.divide(JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioBX96), JSBI.subtract(MAX_FEE, JSBI.BigInt(0)))
    )
    const amount0Delta = roundUp
      ? FullMath.mulDivRoundingUp(FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), ONE, denominator)
      : JSBI.divide(JSBI.divide(JSBI.multiply(numerator1, numerator2), sqrtRatioBX96), denominator)
    const Ldelta = roundUp
      ? FullMath.mulDivRoundingUp(
          FullMath.mulDivRoundingUp(
            amount0Delta,
            JSBI.divide(JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioBX96), JSBI.subtract(MAX_FEE, JSBI.BigInt(0))),
            JSBI.BigInt(2)
          ),
          ONE,
          Q96
        )
      : JSBI.divide(
          JSBI.divide(
            JSBI.multiply(
              amount0Delta,
              JSBI.divide(JSBI.multiply(JSBI.BigInt(feePips), sqrtRatioBX96), JSBI.subtract(MAX_FEE, JSBI.BigInt(0)))
            ),
            JSBI.BigInt(2)
          ),
          Q96
        )
    return [amount0Delta, Ldelta]
  }

  public static getAmount1Delta(sqrtRatioAX96: JSBI, sqrtRatioBX96: JSBI, liquidity: JSBI, roundUp: boolean): JSBI {
    //getAmount1Delta equivalent when x = 0
    // (L<<96).(X96(B) - X96(A))

    //    L.(X96(B) - X96(A))
    // __________________________
    //            2^96
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
    }

    return roundUp
      ? FullMath.mulDivRoundingUp(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96), Q96)
      : JSBI.divide(JSBI.multiply(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96)), Q96)
  }

  public static getNextSqrtPriceFromInput(sqrtPX96: JSBI, liquidity: JSBI, amountIn: JSBI, zeroForOne: boolean): JSBI {
    invariant(JSBI.greaterThan(sqrtPX96, ZERO))
    invariant(JSBI.greaterThan(liquidity, ZERO))

    return zeroForOne
      ? this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountIn, true)
      : this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountIn, true)
  }

  public static getNextSqrtPriceFromOutput(
    sqrtPX96: JSBI,
    liquidity: JSBI,
    amountOut: JSBI,
    zeroForOne: boolean
  ): JSBI {
    invariant(JSBI.greaterThan(sqrtPX96, ZERO))
    invariant(JSBI.greaterThan(liquidity, ZERO))

    return zeroForOne
      ? this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountOut, false)
      : this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountOut, false)
  }

  private static getNextSqrtPriceFromAmount0RoundingUp(
    sqrtPX96: JSBI,
    liquidity: JSBI,
    amount: JSBI,
    add: boolean
  ): JSBI {
    // L <<96
    //amount . sqrtPX96
    if (JSBI.equal(amount, ZERO)) return sqrtPX96
    const numerator1 = JSBI.leftShift(liquidity, JSBI.BigInt(96))

    if (add) {
      //add amount 0, mean sqrtPX96 = Pb, need to calculate Pa
      //from equation of getAmount0Delta
      //                L<<96
      // -> Pa = ___________________
      //                      L
      //           amount+ _________
      //                    sqrtPX96
      let product = multiplyIn256(amount, sqrtPX96)
      if (JSBI.equal(JSBI.divide(product, amount), sqrtPX96)) {
        const denominator = addIn256(numerator1, product)
        if (JSBI.greaterThanOrEqual(denominator, numerator1)) {
          return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator)
        }
      }

      return FullMath.mulDivRoundingUp(numerator1, ONE, JSBI.add(JSBI.divide(numerator1, sqrtPX96), amount))
    } else {
      //remove amount 0, mean sqrtPX96 = Pa, need to calculate Pb
      //from equation of getAmount0Delta
      //              L.sqrtPX96
      // ->Pb = ______________________
      //          L - amount.sqrtPX96
      let product = multiplyIn256(amount, sqrtPX96)

      invariant(JSBI.equal(JSBI.divide(product, amount), sqrtPX96))
      invariant(JSBI.greaterThan(numerator1, product))
      const denominator = JSBI.subtract(numerator1, product)
      return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator)
    }
  }

  private static getNextSqrtPriceFromAmount1RoundingDown(
    sqrtPX96: JSBI,
    liquidity: JSBI,
    amount: JSBI,
    add: boolean
  ): JSBI {
    if (add) {
      //add amount 1, means sqrtPX96 = Pa, need to calculate Pb
      //from equation of getAmount1Delta
      //         amount
      // Pb =  _________ + sqrtPX96
      //            L
      const quotient = JSBI.lessThanOrEqual(amount, MaxUint160)
        ? JSBI.divide(JSBI.leftShift(amount, JSBI.BigInt(96)), liquidity)
        : JSBI.divide(JSBI.multiply(amount, Q96), liquidity)

      return JSBI.add(sqrtPX96, quotient)
    } else {
      //remove amount 1, mean sqrtPX96 = Pb, need to calculate Pa
      //from equation of getAmount1Delta
      //                  amount
      //Pa = sqrtPX96 - __________
      //                    L
      const quotient = FullMath.mulDivRoundingUp(amount, Q96, liquidity)

      invariant(JSBI.greaterThan(sqrtPX96, quotient))
      return JSBI.subtract(sqrtPX96, quotient)
    }
  }
}
