import JSBI from 'jsbi'
import { ONE, ZERO } from '../internalConstants'
import { sqrt } from '@kyberswap/ks-sdk-core'
export abstract class FullMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}
  public static mulDivRoundingUp(a: JSBI, b: JSBI, denominator: JSBI): JSBI {
    const product = JSBI.multiply(a, b)
    let result = JSBI.divide(product, denominator)
    if (JSBI.notEqual(JSBI.remainder(product, denominator), ZERO)) result = JSBI.add(result, ONE)
    return result
  }

  public static mulDiv(a: JSBI, b: JSBI, denominator: JSBI): JSBI {
    const product = JSBI.multiply(a, b)
    return JSBI.divide(product, denominator)
  }

  public static getSmallerRootOfQuadEqn(a: JSBI, b: JSBI, c: JSBI): JSBI {
    // smallerRoot = (b - sqrt(b * b - a * c)) / a;
    const tmp1 = JSBI.multiply(b, b)
    const tmp2 = JSBI.multiply(a, c)
    const tmp3 = sqrt(JSBI.subtract(tmp1, tmp2))
    const tmp4 = JSBI.subtract(b, tmp3)
    return JSBI.divide(tmp4, a)
  }
}
