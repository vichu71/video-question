import { Vue } from 'vue-property-decorator'

Vue.filter('toFixed', (value: number, precision: number = 2) => {
  return value.toFixed(precision)
})
