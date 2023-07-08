import { MaxUint256 } from '@kyberswap/ks-sdk-core'
import JSBI from 'jsbi'
import { encodeSqrtRatioX96 } from './encodeSqrtRatioX96'
import { maxLiquidityForAmounts } from './maxLiquidityForAmounts'

describe('#maxLiquidityForAmounts', () => {
  describe('imprecise', () => {
    describe('price inside', () => {
      it('100 token0, 200 token1', () => {
        //Pa = 100/110
        //Pb = 110/100
        //P = 1
        //amount0 = 100
        //amount1 = 200
        //100/110  <  1  < 110/100  => L = min(L0, L1)
        //        amount0 . P.Pb                    amount1 * Q96
        //L0 =  ____________________        L1 = __________________
        //              (Pb - P) * Q96                      P - Pa
        //L0 = 100 . sqrt(1<<192 / 1) . sqrt(110<<192 / 100) / (sqrt(110<<192 / 100) - sqrt(1<<192/1)) / 2^96
        //   = 100*(1<<192)**0.5 * ((110<<192) / 100)**0.5 / (((110<<192) / 100)**0.5 - (1<<192)**0.5) / 2**96
        //   =  21 48. 808 848 170 148
        //L1 = 200 * 2**96 / (sqrt(1<<192/1) - sqrt(100<<192/110))
        //   = 200 * 2**96 / ((1<<192)**0.5 -((100<<192)/110)**0.5)
        //   = 42 97. 617 696 340 307
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(1, 1),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            '200',
            true
          )
        ).toEqual(JSBI.BigInt(2148))
      })

      it('100 token0, max token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(1, 1),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            MaxUint256,
            false
          )
        ).toEqual(JSBI.BigInt(2148))
      })

      it('max token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(1, 1),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            MaxUint256,
            '200',
            false
          )
        ).toEqual(JSBI.BigInt(4297))
      })
    })
    describe('price below', () => {
      it('100 token0, 200 token1', () => {
        // P < Pa => y = 0 => L = L0
        //        amount0 . Pa.Pb
        //L0 =  ____________________
        //             Pb - Pa
        //L0 = 100 . sqrt(100<<192 / 110) . sqrt(110<<192 / 100) / (sqrt(110<<192 / 100) - sqrt(100<<192/110)) / 2^96
        //   = 100*((100<<192)/110)**0.5 * ((110<<192) / 100)**0.5 / (((110<<192) / 100)**0.5 - ((100<<192)/110)**0.5) / 2**96
        //   = 1048
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(99, 110),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            '200',
            false
          )
        ).toEqual(JSBI.BigInt(1048))
      })

      it('100 token0, max token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(99, 110),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            MaxUint256,
            false
          )
        ).toEqual(JSBI.BigInt(1048))
      })

      it('max token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(99, 110),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            MaxUint256,
            '200',
            false
          )
        ).toEqual(JSBI.BigInt('1214437677402050006470401421068302637228917309992228326090730924516431320489727'))
      })
    })
    describe('price above', () => {
      it('100 token0, 200 token1', () => {
        // P > Pb => x = 0 => L = L1
        //        amount1
        //L1 = ______________
        //         Pb - Pa
        //L1 = 200 * 2**96 / (sqrt(110<<192/100) - sqrt(100<<192/110))
        //   = 200 * 2**96 / (((110<<192)/100)**0.5 -((100<<192)/110)**0.5)
        //   = 2097
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(111, 100),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            '200',
            false
          )
        ).toEqual(JSBI.BigInt(2097))
      })
      it('100 token0, max token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(111, 100),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            '100',
            MaxUint256,
            false
          )
        ).toEqual(JSBI.BigInt('1214437677402050006470401421098959354205873606971497132040612572422243086574654'))
      })
      it('max token0, 200 token1', () => {
        expect(
          maxLiquidityForAmounts(
            encodeSqrtRatioX96(111, 100),
            encodeSqrtRatioX96(100, 110),
            encodeSqrtRatioX96(110, 100),
            MaxUint256,
            '200',
            false
          )
        ).toEqual(JSBI.BigInt(2097))
      })
    })
  })
})
