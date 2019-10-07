import TmsVue from '@/tms/components/startup'

import Shell from './Shell.vue'
import router from './router.js'

new TmsVue({
  router,
  render: h => h(Shell)
}).$mount('#app')
