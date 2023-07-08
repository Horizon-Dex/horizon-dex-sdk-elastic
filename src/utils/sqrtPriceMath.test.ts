import JSBI from 'jsbi'
import { TickMath } from './tickMath'
import { FeeAmount } from '../constants'
import { SqrtPriceMath } from '..'

describe('sqrtPriceMathTest', () => {
  describe('#getAmount0Delta', () => {
    const L = JSBI.BigInt(100e12)
    const tickLower = -276310
    const tickUpper = -276300
    const X96_A = TickMath.getSqrtRatioAtTick(tickLower)
    const X96_B = TickMath.getSqrtRatioAtTick(tickUpper)
    // X96(A) = getSqrtRatioAtTick(-276310) = 79283743674911602647011
    // X96(B) = getSqrtRatioAtTick(-276300) = 79323393475916303018909
    describe('#normal', () => {
      it('roundup false', () => {
        expect(SqrtPriceMath.getAmount0Delta(X96_A, X96_B, L, false).toString()).toEqual('49949961958869841')
      })
      it('roundup true', () => {
        expect(SqrtPriceMath.getAmount0Delta(X96_A, X96_B, L, true).toString()).toEqual('49949961958869842')
      })
    })

    //            2.(L<<96).(X96(B) - X96(A))
    // x_delta = ___________________________________
    //            X96(B).(2.X96(A) - fee.X96(B))

    describe('#fee compounding', () => {
      const fee = 50
      it('roundup false', () => {
        // amount0Delta = (2*(100*10^12 << 96) * (79323393475916303018909 - 79283743674911602647011) / 79323393475916303018909) / (2*79283743674911602647011 - 500 * 79323393475916303018909 / 10**6)
        //              =  49962458820131413
        // LDelta       = 49962458820131413 * (500 * 79323393475916303018909 / 10**6) / 2 / Q96
        //              = 990797945003387269102579326972126108 / q96
        //              = 12505628
        expect(SqrtPriceMath.getAmount0DeltaFeeCompounding(X96_A, X96_B, L, fee, false)[0].toString()).toEqual(
          '49962458820131413'
        )
        expect(SqrtPriceMath.getAmount0DeltaFeeCompounding(X96_A, X96_B, L, fee, false)[1].toString()).toEqual(
          '12505628'
        )
      })
      it('roundup true', () => {
        // amount0Delta = (2*(100*10^12 << 96) * (79323393475916303018909 - 79283743674911602647011) / 79283743674911602647011) / (2*79323393475916303018909 - 500 * 79283743674911602647011 / 10**6)
        //              = 49962458820131414
        // LDelta       = 49962458820131414 * (500 * 79323393475916303018909 / 10**6) / 2
        //              = 990797945003387288933427695951201863
        expect(SqrtPriceMath.getAmount0DeltaFeeCompounding(X96_A, X96_B, L, fee, true)[0].toString()).toEqual(
          '49962458820131414'
        )
        expect(SqrtPriceMath.getAmount0DeltaFeeCompounding(X96_A, X96_B, L, fee, true)[1].toString()).toEqual(
          '12505629'
        )
      })
    })
  })
})
