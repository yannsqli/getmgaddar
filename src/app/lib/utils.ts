export function formatValue(value: number) {
    return Intl.NumberFormat('FR', { notation: 'compact', maximumSignificantDigits: 2 }).format(value)
}