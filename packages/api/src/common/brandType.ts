export type Brand<Generic, BrandTag extends string> = Generic & { __brand: BrandTag };
export function createBrandedGeneric<Generic, Brand>() {
    return (generic: Generic) => (generic as unknown) as Brand;
}
