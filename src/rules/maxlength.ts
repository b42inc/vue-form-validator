import { Validator } from '../Validator'

Validator.defineRule(
    'maxlength',
    (value, max) => value.length <= max,
    (value, max) => `このテキストを ${max} 文字以下にしてください（現時点で ${value.length} 文字です）。`
)