import { Interface } from '@ethersproject/abi'
import { Percent, Token } from '@kyberswap/ks-sdk-core'
import JSBI from 'jsbi'
import { toHex } from './utils/calldata'
import { abi } from './abis/IProAmmRouterTokenHelperWithFee.json'
import { validateAndParseAddress } from './utils/validateAndParseAddress'
export interface FeeOptions {
  /**
   * The percent of the output that will be taken as a fee.
   */
  fee: Percent

  /**
   * The recipient of the fee.
   */
  recipient: string
}

export abstract class Payments {
  public static INTERFACE: Interface = new Interface(abi)

  /**
   * Cannot be constructed.
   */
  private constructor() {}

  private static encodeFeeBips(fee: Percent): string {
    return toHex(fee.multiply(10_000).quotient)
  }

  // Unwraps the contract's WETH9 balance and sends it to recipient as ETH.
  // The amountMinimum parameter prevents malicious contracts from stealing WETH9 from users.
  public static encodeUnwrapWETH(amountMinimum: JSBI, recipient: string, feeOptions?: FeeOptions): string {
    recipient = validateAndParseAddress(recipient)
    if (!!feeOptions) {
      const feeBips = this.encodeFeeBips(feeOptions.fee)
      const feeRecipient: string = validateAndParseAddress(feeOptions.recipient)
      return Payments.INTERFACE.encodeFunctionData('unwrapWethWithFee', [
        toHex(amountMinimum),
        recipient,
        feeBips,
        feeRecipient
      ])
    } else {
      return Payments.INTERFACE.encodeFunctionData('unwrapWeth', [toHex(amountMinimum), recipient])
    }
  }

  //Transfers the full amount of a token held by this contract to recipient
  //The amountMinimum parameter prevents malicious contracts from stealing the token from users
  public static encodeSweepToken(
    token: Token,
    amountMinimum: JSBI,
    recipient: string,
    feeOptions?: FeeOptions
  ): string {
    recipient = validateAndParseAddress(recipient)

    if (!!feeOptions) {
      const feeBips = this.encodeFeeBips(feeOptions.fee)
      const feeRecipient: string = validateAndParseAddress(feeOptions.recipient)

      return Payments.INTERFACE.encodeFunctionData('transferAllTokensWithFee', [
        token.address,
        toHex(amountMinimum),
        recipient,
        feeBips,
        feeRecipient
      ])
    } else {
      return Payments.INTERFACE.encodeFunctionData('transferAllTokens', [
        token.address,
        toHex(amountMinimum),
        recipient
      ])
    }
  }

  public static encodeRefundETH(): string {
    return Payments.INTERFACE.encodeFunctionData('refundEth')
  }
}
