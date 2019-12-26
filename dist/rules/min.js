import { Validator } from '../Validator';
Validator.defineRule('min', (value, min) => parseFloat(value) >= min, (_value, min) => `値は ${min} 以上にする必要があります。`);
