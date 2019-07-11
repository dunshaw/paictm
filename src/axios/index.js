import axios from 'axios'
import { Loading, Message } from 'element-ui'
import qs from 'qs'
import store from '@/store/index'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout =5000






export default axios