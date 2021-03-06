import { Validator } from '../Validator'

Validator.defineRule(
    'required',
    (value) => !!value.trim(),
    (_value, _options, el) => {
        if (el.tagName.toLowerCase() === 'select') {
            return 'リスト内の項目を選択してください。'
        }
        
        switch (el.type) {
            case 'checkbox':
                return '次に進むにはこのチェックボックスをオンにしてください。'
            case 'radio':
                return (el as HTMLInputElement).multiple ?
                    'これらのオプションから 1 つ以上選択してください。' :
                    'これらのオプションから 1 つ選択してください。'
            default:
                return 'このフィールドを入力してください。'
        }
    }
)