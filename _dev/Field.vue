<template>
<label :for="name">
    <span :class="{'is-invalid': hasError(), 'is-valid':valid}">{{label}}</span>:
    <input :type="type"
           :id="name"
           :name="name"
           v-valid="field"
           v-bind="nativeAttributes" />
    <p v-if="hasError()">{{ errors }}</p>
</label>
</template>

<script>
import { FieldValue } from '../src';

export default {
    props: {
        label: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'text'
        },
        name: {
            type: String,
            required: true
        },
        field: {
            type: FieldValue,
            required: true
        },

        // nativeAttributes
        minlength: {type: Number | String},
        maxlength: {type: Number | String},
        min: {type: Number | String},
        max: {type: Number | String},
        step: {type: Number | String},
        pattern: {type: String},
        required: {type: Boolean}
    },
    computed: {
        nativeAttributes() {
            const {
                minlength,
                maxlength,
                min,
                max,
                step,
                pattern,
                required
            } = this

            return {
                minlength,
                maxlength,
                min,
                max,
                step,
                pattern,
                required
            }
        },
        valid() {
            return this.field.valid
        },
        errors() {
            return this.field.errors
        }
    },
    methods: {
        hasError() {
            return this.field.hasError()
        }
    }
}
</script>

<style>

</style>