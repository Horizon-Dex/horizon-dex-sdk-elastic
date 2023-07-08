import { Price, Token } from '@kyberswap/ks-sdk-core';
/**
 * Returns a price object corresponding to the input tick and the base/quote token
 * Inputs must be tokens because the address order is used to interpret the price represented by the tick
 * @param baseToken the base token of the price
 * @param quoteToken the quote token of the price
 * @param tick the tick for which to return the price
 */
export declare function tickToPrice(baseToken: Token, quoteToken: Token, tick: number): Price<Token, Token>;
/**
 * Returns tick for which the given price is closest to the tick price
 * @param price for which to return the closest tick that represents a price less than or equal to the input price,
 * i.e. the price of the returned tick is less than or equal to the input price
 *
 * Solving this equation: `price = 1.0001 ^ tick` => tick = log_1.0001(price)
 */
export declare function priceToClosestTick(price: Price<Token, Token>): number;
