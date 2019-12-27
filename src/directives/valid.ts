import { VNode } from 'vue'
import { HTMLFieldElement } from '../../@types'
import { Field, FieldValue } from '../Field'
import { DirectiveBinding } from 'vue/types/options'
import { VueConstructor } from 'vue/types/umd'

export default (Vue:VueConstructor) => {
    const map = new WeakMap()

    Vue.directive('valid', {
        bind(el:HTMLElement, binding:DirectiveBinding, vnode:VNode) {
            const { prevent } = binding.modifiers
            const value:FieldValue = binding.value
            const field = new Field(el as HTMLFieldElement, vnode, value, {
                preventInvalid: !!prevent,
                validEvent: Object.keys(value.validations)
            })

            map.set(el, field)
        },
        
        // TODO: 更新に対応させる
        // inserted(el, binding, vnode) {},
        // update(el, binding, vnode) {},
        // componentUpdated(el, binding, vnode, oldVnode) {},

        unbind(el:HTMLElement) {
            const field:Field = map.get(el)
            if (field) {
                field.dispose()
                map.delete(el)
            }
        }
    })
}