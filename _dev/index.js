import Vue from 'vue'
import Sample from './Sample'
import ValidDirective from '../src'

Vue.use(ValidDirective)

new Vue({
  el: '#sample',
  render: h => h(Sample)
})