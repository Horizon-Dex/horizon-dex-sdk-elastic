import { Price, Token } from '@kyberswap/ks-sdk-core'
import JSBI from 'jsbi'
import { Q192 } from '../internalConstants'
import { encodeSqrtRatioX96 } from './encodeSqrtRatioX96'
import { TickMath } from './tickMath'

/**
 * Returns a price object corresponding to the input tick and the base/quote token
 * Inputs must be tokens because the address order is used to interpret the price represented by the tick
 * @param baseToken the base token of the price
 * @param quoteToken the quote token of the price
 * @param tick the tick for which to return the price
 */
export function tickToPrice(baseToken: Token, quoteToken: Token, tick: number): Price<Token, Token> {
  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick)

  const ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96)
  return baseToken.sortsBefore(quoteToken)
    ? new Price(baseToken, quoteToken, Q192, ratioX192)
    : new Price(baseToken, quoteToken, ratioX192, Q192)
}

/**
 * Returns tick for which the given price is closest to the tick price
 * @param price for which to return the closest tick that represents a price less than or equal to the input price,
 * i.e. the price of the returned tick is less than or equal to the input price
 *
 * Solving this equation: `price = 1.0001 ^ tick` => tick = log_1.0001(price)
 */

export function priceToClosestTick(price: Price<Token, Token>): number {
  const sorted = price.baseCurrency.sortsBefore(price.quoteCurrency)
  const sqrtRatioX96 = sorted
    ? encodeSqrtRatioX96(price.numerator, price.denominator)
    : encodeSqrtRatioX96(price.denominator, price.numerator)
  let tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96)

  const lower2TickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, getCorrectTick(tick - 2))
  const lowerTickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, getCorrectTick(tick - 1))
  const tickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, tick)
  const nextTickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, getCorrectTick(tick + 1))
  const next2TickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, getCorrectTick(tick + 2))

  const nearestPrice = findNearestValue(price, [
    lower2TickPrice,
    lowerTickPrice,
    tickPrice,
    nextTickPrice,
    next2TickPrice
  ])
  if (nearestPrice?.equalTo(lower2TickPrice)) return getCorrectTick(tick - 2)
  if (nearestPrice?.equalTo(lowerTickPrice)) return getCorrectTick(tick - 1)
  if (nearestPrice?.equalTo(tickPrice)) return tick
  if (nearestPrice?.equalTo(nextTickPrice)) return getCorrectTick(tick + 1)
  if (nearestPrice?.equalTo(next2TickPrice)) return getCorrectTick(tick + 2)

  return tick
}

const getCorrectTick = (value: number) => {
  if (value < TickMath.MIN_TICK) return TickMath.MIN_TICK
  if (value > TickMath.MAX_TICK) return TickMath.MAX_TICK
  return value
}

const findNearestValue = (current: Price<Token, Token>, prices: Price<Token, Token>[]): Price<Token, Token> | null => {
  if (!prices.length) return null
  let best = prices[0]
  prices.forEach(price => (best = findNearerValue(current, best, price)))
  return best
}

const findNearerValue = (
  current: Price<Token, Token>,
  val1: Price<Token, Token>,
  val2: Price<Token, Token>
): Price<Token, Token> => {
  const lower = val1.lessThan(val2) ? val1 : val2
  const upper = val1.lessThan(val2) ? val2 : val1
  const middle = upper.add(lower).divide(2)
  return middle.lessThan(current) || middle.equalTo(current) ? upper : lower
}
