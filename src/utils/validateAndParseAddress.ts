import { validateAndParseAddress as validateAndParseAddressCore } from '@kyberswap/ks-sdk-core'

export const validateAndParseAddress = (address: string) => validateAndParseAddressCore(address)
