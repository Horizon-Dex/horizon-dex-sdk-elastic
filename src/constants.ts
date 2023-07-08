export const FACTORY_ADDRESS = '0x0C7369F931a8D809E443c1d4A5DCe663fF888a73'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const POOL_INIT_CODE_HASH = '0xd71790a46dff0e075392efbd706356cd5a822a782f46e9859829440065879f81'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  STABLE = 8,
  LOWEST = 10,
  LOW = 40,
  MEDIUM = 300,
  HIGH = 1000
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } & Record<string, number> = {
  [FeeAmount.STABLE]: 1,
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW]: 8,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200,
  '50': 10 //for legacy unittest
} as const

export const MIN_LIQUIDITY = 100
