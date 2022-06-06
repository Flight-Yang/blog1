import axios from 'axios'
import { Message } from 'element-ui'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded' //表示axios的文本类型
axios.defaults.baseURL = '//blog-server.hunger-valley.com' //表示axios线上的公共请求地址
//axios.defaults.baseURL = '//localhost:3006'

window.request = request

export default function request(url, type = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    let option = {  //判断两种请求方式，get和post,第一个是地址，第二个是类型
      url,
      method: type,
    }
    if(type.toLowerCase() === 'get') { //因为get和post请求数据书写不同，所以来判断是get给就直接拼接，post用对象形式拼接
      option.params = data
      console.log(option.params)
    }else {
      option.data = data
      console.log(option.data)
    }
    if(localStorage.token) {  //判断请求返回是否带有token
      axios.defaults.headers.common['Authorization']  = localStorage.token
    }
    //axios对应的请求方式书写，老师这么写，包括了axios.get(url?data)
    axios(option).then(res => {
      console.log(res.data)
      if(res.data.status === 'ok') {  //与后端一起写的对接数据返回成功的字段
        if(res.data.token) { //如果请求数据成功，看是否有唯一token，识别身份
          localStorage.token = res.data.token
        }
        resolve(res.data)
      }else{
        Message.error(res.data.msg)
        reject(res.data)
      }
    }).catch(err => {
      Message.error('网络异常')
      reject({ msg: '网络异常' })
    })
  })
}
