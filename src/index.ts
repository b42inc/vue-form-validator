import directive from './directives/valid'
import { PluginObject } from 'vue/types/umd'
import { FieldValue, Field} from './Field'
import { Validator } from './Validator'
import './rules/jp'
import './rules/max'
import './rules/maxlength'
import './rules/min'
import './rules/minlength'
import './rules/number'
import './rules/pattern'
import './rules/required'
import './rules/step'
import './rules/string'
import './rules/tel'

export default {
    install(Vue) {
        directive(Vue)
    }
} as PluginObject<{}>

export { FieldValue, Field, Validator }