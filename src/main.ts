import { createApp } from 'vue'
import {name} from '../package.json'
import App from './App.vue'

document.title = name
createApp(App).mount('#app')
