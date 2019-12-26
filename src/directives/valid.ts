import Vue, { VNode } from 'vue'
import { HTMLFieldElement, FieldValue } from '../../@types'
import { Field } from '../Field'
import { DirectiveBinding } from 'vue/types/options'
const map = new WeakMap()

Vue.directive('valid', {
    bind(el:HTMLElement, binding:DirectiveBinding, vnode:VNode) {
        const { prevent } = binding.modifiers
        const value:FieldValue = binding.value
        const filed = new Field(el as HTMLFieldElement, vnode, value, {
            preventInvalid: !!prevent,
            validEvent: Object.keys(value.validations)
        })

        map.set(el, filed)
    },
    
    // TODO: 更新に対応させる
    // inserted(el, binding, vnode) {},
    // update(el, binding, vnode) {},
    // componentUpdated(el, binding, vnode, oldVnode) {},

    unbind(el:HTMLElement) {
        const filed:Field = map.get(el)
        if (filed) {
            filed.dispose()
            map.delete(el)
        }
    }
})