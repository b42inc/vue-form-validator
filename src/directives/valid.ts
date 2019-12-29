import { VNode } from 'vue'
import { HTMLFieldElement } from '../../@types'
import { Field } from '../Field'
import { FieldValue } from '../FieldValue'
import { VueConstructor, VNodeDirective } from 'vue/types/umd'

function createEvent(type:string) {
    try {
        return new Event(type);
    } catch (_e) {
        const event = document.createEvent('Event')
        event.initEvent(type, true, true)
        return event
    }
}

function getDirective(vnode:VNode, directiveName:string):VNodeDirective | undefined {
    if (!vnode.data || !vnode.data.directives) {
        return
    }

    return vnode.data.directives.find(directive => directive.name === directiveName)
}

export default (Vue:VueConstructor) => {
    const map = new WeakMap()

    Vue.directive('valid', {
        inserted(el, binding, vnode) {
            const { prevent } = binding.modifiers
            const value:FieldValue = binding.value
            const field = new Field(el as HTMLFieldElement, vnode, value, {
                preventInvalid: !!prevent
            })

            // 初期値のvalidation
            if (value.hasEvent('init')) {
                el.dispatchEvent(createEvent('init'))
            }

            map.set(el, field)
        },

        componentUpdated(el, binding, vnode, oldVnode) {
            const current = getDirective(vnode, 'valid')
            const old = getDirective(oldVnode, 'valid')

            if (current && old && current.value !== old.value) {
                const field:Field = map.get(el)
                const value:FieldValue = binding.value
                field.update(vnode, value)
            }
        },

        unbind(el) {
            const field:Field = map.get(el)
            if (field) {
                field.dispose()
                map.delete(el)
            }
        }
    })
}