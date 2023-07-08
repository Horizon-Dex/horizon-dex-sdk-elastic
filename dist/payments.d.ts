import { Interface } from '@ethersproject/abi';
import { Percent, Token } from '@kyberswap/ks-sdk-core';
import JSBI from 'jsbi';
export interface FeeOptions {
    /**
     * The percent of the output that will be taken as a fee.
     */
    fee: Percent;
    /**
     * The recipient of the fee.
     */
    recipient: string;
}
export declare abstract class Payments {
    static INTERFACE: Interface;
    /**
     * Cannot be constructed.
     */
    private constructor();
    private static encodeFeeBips;
    static encodeUnwrapWETH(amountMinimum: JSBI, recipient: string, feeOptions?: FeeOptions): string;
    static encodeSweepToken(token: Token, amountMinimum: JSBI, recipient: string, feeOptions?: FeeOptions): string;
    static encodeRefundETH(): string;
}
