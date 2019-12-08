import { Validator } from '../Validator'

const REGX_URL_SAFETY = /^[-._~a-zA-Z0-9]+$/
const REGX_HALF_STRING = /^[\x01-\x7E]+$/
const REGX_FULL_STRING = /^[^\x01-\x7E]+$/

// URL上で安全に取り扱える文字列
Validator.defineRule(
    'url-safety-string',
    (value) => REGX_URL_SAFETY.test(value),
    '指定されている形式で入力してください。'
)

// IDやパスワードでの使用を想定した文字列
Validator.defineRule(
    'custom-string',
    (value, { lowercase, uppercase, number, synbol }) => {
        const pattern = (synbol || '') + (number || '') + (uppercase || '') + (lowercase || '')
        const regx = new RegExp(`^[${pattern}]+$`)
        return regx.test(value)
    },
    '指定されている形式で入力してください。',
    {
        // 英字小文字
        lowercase: 'a-z',
        // 英字大文字
        uppercase: 'A-Z',
        // 数字
        number: '0-9',
        // 記号
        synbol: '!"#$%&\'()*+,–.\\/:;<=>?@[]^_`{|}~'
    }
)

// 半角
Validator.defineRule(
    'half-string',
    (value) => REGX_HALF_STRING.test(value),
    '半角文字以外の文字が含まれています。'
)

// 全角
Validator.defineRule(
    'full-string',
    (value) => REGX_FULL_STRING.test(value),
    '全角文字以外の文字が含まれています。'
)