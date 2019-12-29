<template>
  <div>
      <form @submit="handleSubmit" @reset="handleReset">
          <label for="id">
              <span :class="{'is-invalid': id.hasError(), 'is-valid':id.valid}">ID</span>:
              <input type="text"
                     id="id"
                     name="id"
                     v-valid="id"
                     @resolve="handleResolve"
                     @reject="handleReject" />
              <p v-if="id.hasError()">{{ id.errors }}</p>
          </label>
          <label for="name">
              <span :class="{'is-invalid': name.hasError(), 'is-valid':name.valid}">Name</span>:
              <input type="text"
                     id="name"
                     name="name"
                     v-valid="name"
                     minlength="5"
                     maxlength="20"
                     required />
              <p v-if="name.hasError()">{{ name.errors }}</p>
          </label>
          <label for="email">
              <span :class="{'is-invalid': email.hasError(), 'is-valid':email.valid}">Email</span>:
              <input type="email" v-valid.prevent="email">
              <p v-if="email.hasError()">{{ email.errors }}</p>
          </label>
          <label for="password">
              <span :class="{'is-invalid': password.hasError(), 'is-valid':password.valid}">Password</span>:
              <input type="password"
                     id="password"
                     name="password"
                     v-valid="password"
                     @confirm:change="handleConfirm" />
              <p v-if="password.hasError()">{{ password.errors }}</p>
          </label>
          <label for="re_password">
              <span :class="{'is-invalid': rePassword.hasError(), 'is-valid':rePassword.valid}">Password(Confirm)</span>:
              <input type="password"
                     id="re_password"
                     name="re_password"
                     v-valid="rePassword"
                     @confirm:change="handleConfirm" />
              <p v-if="rePassword.hasError()">{{ rePassword.errors }}</p>
          </label>
          <button type="reset">Reset</button>
          <button type="submit" :disabled="!allClear">Send</button>
      </form>
      <div>
          <button @click="handleChangeEvent">イベントの変更</button>
          <button @click="handleChangeValue">プログラミングからの値の変更</button>
      </div>
  </div>
</template>

<script>
import { Validator, FieldValue } from '../src'

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
Validator.difineRuleset('pw-change', [
    'required',
    {rule:'minlength', options: 8},
    {rule:'maxlength', options: 32},
    'pw-required'
])

export default {
    count:0,
    data() {
        return {
            id: new FieldValue('id', 2220, {
                init: null,
                input: ['id', 'required']
            }),
            name: new FieldValue('name', 'John Paul'),
            email: new FieldValue('email', 'test', {
                init: null,
                change: ['required']
            }),
            password: new FieldValue('password', '', {
                input: 'pw-input',
                change: 'pw-change'
            }),
            rePassword: new FieldValue('rePassword', '', {
                input: 'pw-input',
                change: 'pw-change'
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
        handleConfirm({field}) {
            const {value, name} = field
            switch (name) {
                case 'password':
                    if (this.rePassword.value && value !== this.rePassword.value) {
                        // TODO:パスワード確認の方のエラーメッセージを更新できるようにしたい
                        field.preventResolve('パスワードと入力された内容が異なります。')
                    }
                    break
                case 're_password':
                    if (value !== this.password.value) {
                        field.preventResolve('パスワードと入力された内容が異なります。')
                    }
                    break
            }
        },
        // フォーム単体がresolveになったら発火
        handleResolve({field}) {
            console.log(`${field.name} is valid!`)
        },
        // フォーム単体がrejectになったら発火
        handleReject({field}) {
            // return falseでエラー扱いにしない
            // 例えば年齢制限のバリデーションをかけたい場合に
            // 年と月で誕生日を入力するフォームで、年と月のフォームを入れるタイミングなどによって
            // エラー判定が難しい場合はここで再度バリデーションをかけて最終的なエラー扱いを決める
            console.error(`${field.name} is invalid!`)
        },
        // フォーム全体がresolveになったら発火
        handleSubmit() {
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
        },
        handleChangeEvent() {
            this.name.validations = this.$options.count++ % 2 ? { 'input': null } : { 'blur': null }
        },
        handleChangeValue() {
            this.id.value = Date.now()
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

.is-valid {
    color: #0f0;
}

.is-invalid {
    color: #f00;
}
</style>