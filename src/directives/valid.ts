import { VNode } from 'vue'
import { HTMLFieldElement } from '../../@types'
import { Field } from '../Field'
import { FieldValue } from '../FieldValue'
import { DirectiveBinding } from 'vue/types/options'
import { VueConstructor } from 'vue/types/umd'

function createEvent(type:string) {
    try {
        return new Event(type);
    } catch (_e) {
        const event = document.createEvent('Event')
        event.initEvent(type, true, true)
        return event
    }
}

export default (Vue:VueConstructor) => {
    const map = new WeakMap()

    Vue.directive('valid', {
        // bind() {},

        inserted(el:HTMLElement, binding:DirectiveBinding, vnode:VNode) {
            const { prevent } = binding.modifiers
            const value:FieldValue = binding.value
            const field = new Field(el as HTMLFieldElement, vnode, value, {
                preventInvalid: !!prevent,
                validEvent: Object.keys(value.validations)
            })

            // 初期値のvalidation
            if (value.hasEvent('init')) {
                el.dispatchEvent(createEvent('init'))
            }

            map.set(el, field)
        },

        // TODO: 更新に対応させる
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