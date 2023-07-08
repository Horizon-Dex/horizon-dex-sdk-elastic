export declare const FACTORY_ADDRESS = "0x0C7369F931a8D809E443c1d4A5DCe663fF888a73";
export declare const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export declare const POOL_INIT_CODE_HASH = "0xd71790a46dff0e075392efbd706356cd5a822a782f46e9859829440065879f81";
/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export declare enum FeeAmount {
    STABLE = 8,
    LOWEST = 10,
    LOW = 40,
    MEDIUM = 300,
    HIGH = 1000
}
/**
 * The default factory tick spacings by fee amount.
 */
export declare const TICK_SPACINGS: {
    [amount in FeeAmount]: number;
} & Record<string, number>;
export declare const MIN_LIQUIDITY = 100;
