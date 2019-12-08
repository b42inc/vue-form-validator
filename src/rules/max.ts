import { Validator } from '../Validator'

Validator.defineRule(
    'max',
    (value, max) => parseFloat(value) <= max,
    (_value, max) => `値は ${max} 以下にする必要があります。`,
)