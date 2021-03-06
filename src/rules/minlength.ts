import { Validator } from '../Validator'

Validator.defineRule(
    'minlength',
    (value, min) => value.length >= min,
    (value, min) => `このテキストを ${min} 文字以上にしてください（現時点で ${value.length} 文字です）。`
)