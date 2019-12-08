<template>
  <div>
      <form @submit="handleSubmit" @reset="handleReset">
          <label for="id">
              ID: <input type="text"
                         id="id"
                         name="id"
                         v-valid="id"
                         @resolve="handleResolve"
                         @reject="handleReject" />
              <p v-if="id.hasError()">{{ id.errors }}</p>
          </label>
          <label for="name">
              Name: <input type="text"
                           id="name"
                           name="name"
                           v-valid="name"
                           minlength="5"
                           maxlength="20"
                           required
                           />
              <p v-if="name.hasError()">{{ name.errors }}</p>
          </label>
          <label for="email">
              Email: <input type="email" v-valid.prevent="email">
              <p v-if="email.hasError()">{{ email.errors }}</p>
          </label>
          <label for="password">
              Password: <input type="password"
                               id="password"
                               name="password"
                               v-valid="password" />
              <p v-if="password.hasError()">{{ password.errors }}</p>
          </label>
          <label for="re_password">
              Password(Confirm): <input type="password"
                               id="re_password"
                               name="re_password"
                               v-valid="rePassword"
                               @confirm:blur="handleConfirm" />
              <p v-if="rePassword.hasError()">{{ rePassword.errors }}</p>
          </label>
          <button type="reset">Reset</button>
          <button type="submit" :disabled="!allClear">Send</button>
      </form>
  </div>
</template>

<script>
import { Validator } from '../src/Validator'
import { FieldValue } from '../src/Field'

Validator.defineRule(
    'id-allowed',
    (value, {regx}) => regx.test(value),
    '半角英数字と記号（-と_）のみを使って入力してください。',
    { regx: /^[-_a-zA-Z0-9]+$/ }
)
Validator.difineRuleset('id', ['id-allowed'])
Validator.defineRule(
    'pw-allowed',
    (value, { regx }) => regx.test(value),
    '半角英数字と記号（!"#$%&\'()*+,–.\\/:;<=>?@[]^_`{|}~）のみを使って入力してください。',
    {
        regx: /^[!"#$%&'()*+,–.\\/:;<=>?@[\]^_`{|}~0-9a-zA-Z]+$/
    }
)
Validator.defineRule(
    'pw-required',
    (value, { regxes, min }) => {
        return regxes.filter(regx => regx.test(value)).length >= min
    },
    (value, { min }) => {
        return `大文字英字、小文字英字、数字、記号のうち${min}つ以上を組み合わせてください`
    },
    {
        regxes: [
            /[0-9]+/,
            /[a-z]+/,
            /[A-Z]+/,
            /[!"#$%&'()*+,–.\\/:;<=>?@[\]^_`{|}~]+/
        ],
        min: 3
    }
)
Validator.difineRuleset('pw-input', [
    'pw-allowed'
])
Validator.difineRuleset('pw-blur', [
    'required',
    {rule:'minlength', options: 8},
    {rule:'maxlength', options: 32},
    'pw-required'
])

export default {
    data() {
        return {
            id: new FieldValue('id', 2220, {
                input: 'id',
                blur: ['required', 'id']
            }),
            name: new FieldValue('name', 'John Paul'),
            email: new FieldValue('email', '', {
                blur: ['required']
            }),
            password: new FieldValue('password', '', {
                blur: 'pw-blur',
                input: 'pw-input'
            }),
            rePassword: new FieldValue('rePassword', '', {
                blur: 'pw-blur',
                input: 'pw-input'
            })
        }
    },
    computed: {
        allClear() {
            const {id, name, password, rePassword} = this
            return id.valid && name.valid && password.valid && rePassword.valid
        }
    },
    methods: {
        // 設定済のvalidationを通過したら最後に発火
        // ここでfalseを返すとrejectにtrueを返すと正式にresolveとなる
        handleConfirm({filed}) {
            if (filed.name === 're_password' && filed.value !== this.password.value) {
                filed.preventResolve()
            }
        },
        // フォーム単体がresolveになったら発火
        handleResolve({filed}) {
            console.log(`${filed.name} is valid!`)
        },
        // フォーム単体がrejectになったら発火
        handleReject({filed}) {
            // return falseでエラー扱いにしない
            // 例えば年齢制限のバリデーションをかけたい場合に
            // 年と月で誕生日を入力するフォームで、年と月のフォームを入れるタイミングなどによって
            // エラー判定が難しい場合はここで再度バリデーションをかけて最終的なエラー扱いを決める
            console.error(`${filed.name} is invalid!`)
        },
        // フォーム全体がresolveになったら発火
        handleSubmit() {debugger
            if (!this.allClear) {
                return
            }
            const {id, name, password} = this

            this.$axios.post('/api', {
                id: id.value,
                name: name.value,
                password: password.value
            })
        },
        // フォーム全体で1つでもrejectになると発火
        handleReset() {
            const {id, name, password, rePassword} = this
            id.reset()
            name.reset()
            password.reset()
            rePassword.reset()
        }
    }
}
</script>

<style>
label {
    display: block;
    margin-bottom: 20px;
}

input {
    border: 1px solid #000;
}
</style>