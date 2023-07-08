import JSBI from 'jsbi';
import { FeeAmount } from '../constants';
export declare abstract class SwapMath {
    /**
     * Cannot be constructed.
     */
    private constructor();
    static computeSwapStepPromm(sqrtRatioCurrentX96: JSBI, sqrtRatioTargetX96: JSBI, liquidity: JSBI, amountRemaining: JSBI, feePips: FeeAmount, exactIn: boolean, zeroForOne: boolean): [JSBI, JSBI, JSBI, JSBI];
    static calcReachAmount(sqrtRatioCurrentX96: JSBI, sqrtRatioTargetX96: JSBI, liquidity: JSBI, feePips: FeeAmount, exactIn: boolean, zeroForOne: boolean): JSBI;
    static calcReturnedAmount(sqrtRatioCurrentX96: JSBI, sqrtRatioTargetX96: JSBI, liquidity: JSBI, deltaL: JSBI, exactIn: boolean, zeroForOne: boolean): JSBI;
    static calcIncrementalLiquidity(sqrtRatioCurrentX96: JSBI, sqrtRatioTargetX96: JSBI, liquidity: JSBI, absAmount: JSBI, exactIn: boolean, zeroForOne: boolean): JSBI;
    static estimateIncrementalLiquidity(absAmount: JSBI, liquidity: JSBI, sqrtRatioCurrentX96: JSBI, feePips: FeeAmount, exactIn: boolean, zeroForOne: boolean): JSBI;
    static calcFinalPrice(absAmount: JSBI, liquidity: JSBI, deltaL: JSBI, sqrtRatioCurrentX96: JSBI, exactIn: boolean, zeroForOne: boolean): JSBI;
    static computeSwapStep(sqrtRatioCurrentX96: JSBI, sqrtRatioTargetX96: JSBI, liquidity: JSBI, amountRemaining: JSBI, feePips: FeeAmount): [JSBI, JSBI, JSBI, JSBI];
}
