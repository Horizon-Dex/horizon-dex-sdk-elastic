import { BigintIsh } from '@kyberswap/ks-sdk-core'
import { TickList } from '../utils/tickList'
import { Tick, TickConstructorArgs } from './tick'
import { TickDataProvider } from './tickDataProvider'

export class TickListDataProvider implements TickDataProvider {
  private ticks: readonly Tick[]

  constructor(ticks: (Tick | TickConstructorArgs)[], tickSpacing: number) {
    const ticksMapped: Tick[] = ticks.map(t => (t instanceof Tick ? t : new Tick(t)))
    TickList.validateList(ticksMapped, tickSpacing)
    this.ticks = ticksMapped
  }

  async getTick(tick: number): Promise<{ liquidityNet: BigintIsh; liquidityGross: BigintIsh }> {
    return TickList.getTick(this.ticks, tick)
  }

  async nextInitializedTickWithinOneWord(tick: number, lte: boolean, tickSpacing: number): Promise<[number, boolean]> {
    return TickList.nextInitializedTickWithinOneWord(this.ticks, tick, lte, tickSpacing)
  }

  async nextInitializedTickWithinFixedDistance(
    tick: number,
    lte: boolean,
    distance: number
  ): Promise<[number, boolean]> {
    return TickList.nextInitializedTickWithinFixedDistance(this.ticks, tick, lte, distance)
  }
}
