import Vue from 'vue'
import Sample from './Sample'
import '../src/index'

new Vue({
  el: '#sample',
  render: h => h(Sample)
})