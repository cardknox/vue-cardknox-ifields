import { createApp } from 'vue'
import Oruga from '@oruga-ui/oruga-next';
import App from './App.vue'
import '@oruga-ui/oruga-next/dist/oruga-full.css';
import 'bulma/css/bulma.css'

const app = createApp(App)

app.use(Oruga);
app.mount('#app')
