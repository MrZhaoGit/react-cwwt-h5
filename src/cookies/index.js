import cookie from 'react-cookies'

// 获取当前用户cookie信息
export const loginUser = (loadName) => {
  return cookie.load(loadName)
}

// 保存当前用户cookie信息 path：/（适用于任何路径下的页面）
export const onLogin = (saveName,saveVal,saveConfig) => {
  const expiresNum = saveConfig.expires;
  const expires = new Date()
  expires.setDate(Date.now() + 1000 * 60 * 60 * 24 * expiresNum)
  saveConfig.expires = expires
  cookie.save(saveName, saveVal, saveConfig)
}

// 删除当前用户的cookie信息
export const loginOut = (removeName, isLoginOut) => {
  cookie.remove(removeName)
  if(isLoginOut){
    window.location.href = '/Login'
  }
}