import axios from 'axios'
import { Component } from 'react'
import {Redirect} from 'react-router-dom';
import qs from 'qs'

const $axios = axios.create({
  baseURL: 'http://localhost:49869/',
  timeout: 200000
})

$axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

$axios.interceptors.request.use(config =>{
  //console.log('this is request...')
  //console.log(config)
  return config
}, err =>{
  return Promise.reject(err)
})

$axios.interceptors.response.use(res =>{
  //console.log('this is response')
  const data = res.data
  if(data.status && data.status !== 1){
    console.log('check err')
  }
  if(typeof data.IsLogin !== "undefined" && data.IsLogin === 0){
    sessionStorage.clear()
    localStorage.clear()
    return <Redirect to='/login'/>
  }
  return res.data
}, err =>{
  return Promise.reject(err)
})

const $SingleAxios = (config)=>{
  // data: metch(默认为post请求)  
  let defRes = {}
  const defConfig = {
    method: 'post',
    url: "", // 必传，不能为空
    data: {} // 默认不传为空
  }
  const newConfig = {...defConfig, ...config}
  newConfig.data = qs.stringify(newConfig.data)
  $axios(newConfig).then((res)=>{
    defRes = res
  })
  return defRes
}

Component.prototype.$SingleAxios = $SingleAxios
Component.prototype.$axios = $axios
Component.prototype.$axios.all = axios.all
Component.prototype.$axios.spread = axios.spread