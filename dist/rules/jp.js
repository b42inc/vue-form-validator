import { Validator } from '../Validator';
const REGX_HIRA = /^[\s\u3040-\u309F]+$/;
const REGX_KANA = /^[\s\u30A0-\u30FF]+$/;
Validator.defineRule('hira', (value) => REGX_HIRA.test(value), 'ひらがな以外の文字が含まれています。');
Validator.defineRule('kana', (value) => REGX_KANA.test(value), 'カタカナ以外の文字が含まれています。');
