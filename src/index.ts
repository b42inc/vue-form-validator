import install, { Directive } from './directives/valid'
import { PluginObject } from 'vue/types/umd'
import { Field} from './Field'
import { FieldValue } from './FieldValue'
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

export default { install } as PluginObject<any>

export { FieldValue, Field, Validator, Directive }