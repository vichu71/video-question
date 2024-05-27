import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
      options: {
        customProperties: true,
      },
    themes: {
      light: {
        'primary': '#572364',
        'secondary': '#424242',
        'accent': '#82B1FF',
        'background': '#b2c4db',
        'light-background': '#f7f8fd',
        'error': '#FF5252',
        'info': '#2196F3',
        'success': '#4CAF50',
        'warning': '#FFC107'
      },
    },
  },
  icons: {
    iconfont: 'mdiSvg',
  },
})
