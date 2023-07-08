import { BigintIsh } from '@kyberswap/ks-sdk-core';
import { Tick, TickConstructorArgs } from './tick';
import { TickDataProvider } from './tickDataProvider';
export declare class TickListDataProvider implements TickDataProvider {
    private ticks;
    constructor(ticks: (Tick | TickConstructorArgs)[], tickSpacing: number);
    getTick(tick: number): Promise<{
        liquidityNet: BigintIsh;
        liquidityGross: BigintIsh;
    }>;
    nextInitializedTickWithinOneWord(tick: number, lte: boolean, tickSpacing: number): Promise<[number, boolean]>;
    nextInitializedTickWithinFixedDistance(tick: number, lte: boolean, distance: number): Promise<[number, boolean]>;
}
