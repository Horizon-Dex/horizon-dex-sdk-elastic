import { Percent, Token } from '@kyberswap/ks-sdk-core'
import JSBI from 'jsbi'
import { FeeAmount, TICK_SPACINGS } from '../constants'
import { encodeSqrtRatioX96 } from '../utils/encodeSqrtRatioX96'
import { nearestUsableTick } from '../utils/nearestUsableTick'
import { TickMath } from '../utils/tickMath'
import { Pool } from './pool'
import { Position } from './position'

describe('#_____', () => {
  it('is correct for in-range position', () => {
    //vutien
    // ====pool DAI WETH 5 0 -80068 1446478496690157252386646498
    // ====position -81610 -78240 2090273127815954756
    // token0 = DAI, token1 = WETH
    // add 10 DAI = 10 * 10**18
    // => L =
    const ETH = new Token(1, '0xc778417e063141139fce010982780140aa0cd5ab', 18, 'USDC', 'USD Coin')
    const DAI = new Token(1, '0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C', 18, 'DAI', 'DAI Stablecoin')
    const POOL_SQRT_RATIO_START = JSBI.BigInt('1446478496690157252386646498') //mock pool when init, then = exact price at POOL_TICK_CURRENT
    const POOL_TICK_CURRENT = -80068
    const DAI_ETH_POOL = new Pool(DAI, ETH, FeeAmount.VERY_STABLE, POOL_SQRT_RATIO_START, 0, 0, POOL_TICK_CURRENT, [])

    //x96_Lower = 1339151004338250763518426559
    //x96_Upper = 1584909661611945058891648556
    //                      L . (X96(B) - X96(A))         2090273127815954756 * (1446478496690157252386646498 - 1339151004338250763518426559)
    // minimum amount1 = ___________________________ = ___________________________________________________________________________
    //                              Q96                                             2^96
    //                 = 2831616511346850
    //         roundUp = 2831616511346851
    expect(
      new Position({
        pool: DAI_ETH_POOL,
        liquidity: JSBI.BigInt('2090273127815954756'),
        tickLower: -81610,
        tickUpper: -78240
      }).mintAmounts.amount1.toString()
    ).toEqual('2831616511346851')
  })

  it('is correct for in-range position', () => {
    //vutien
    // ====pool DAI WETH 5 0 -80068 1446478496690157252386646498
    // ====position -81610 -78240 2090273127815954756
    // token0 = DAI, token1 = WETH
    const ETH = new Token(1, '0xc778417e063141139fce010982780140aa0cd5ab', 18, 'USDC', 'USD Coin')
    const DAI = new Token(1, '0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C', 18, 'DAI', 'DAI Stablecoin')
    const POOL_SQRT_RATIO_START = JSBI.BigInt('1446478496690157252386646498')
    const POOL_TICK_CURRENT = -80068
    const DAI_ETH_POOL = new Pool(DAI, ETH, FeeAmount.VERY_STABLE, POOL_SQRT_RATIO_START, 0, 0, POOL_TICK_CURRENT, [])

    //x96_Lower = 1339151004338250763518426559
    //x96_Upper = 1584909661611945058891648556
    //                  (L<<96).(X96(B) - X96(A))      (2090273127815954756 << 96) * (1584909661611945058891648556 - 1446478496690157252386646498)
    // minimum amount0 = __________________________ = ________________________________________________________________________
    //                      X96(B) . X96(A)               1584909661611945058891648556 * 1446478496690157252386646498
    //                 = 9999999999999997883
    //         roundUp = 9999999999999997884
    expect(
      new Position({
        pool: DAI_ETH_POOL,
        liquidity: JSBI.BigInt('2090273127815954756'),
        tickLower: -81610,
        tickUpper: -78240
      }).mintAmounts.amount0.toString()
    ).toEqual('9999999999999997884')
  })
})
