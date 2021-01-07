import { HelperJS } from '../commonJS/C-Helper'

let UserKeyData = HelperJS.setSessionStorageFn('G', 'UserKeyData')?HelperJS.setSessionStorageFn('G', "UserKeyData"):''
let UserInfoData = HelperJS.setSessionStorageFn('G', 'UserInfoData')?JSON.parse(HelperJS.setSessionStorageFn('G', 'UserInfoData')): {}
let CusInfoData = HelperJS.setSessionStorageFn('G', 'CusInfoData')?JSON.parse(HelperJS.setSessionStorageFn('G', 'CusInfoData')): {}

const defaultData = {
  UserKeyData,
  UserInfoData,
  CusInfoData,
}

const reducer = (state = defaultData, action ) => {
  switch (action.type) {
    case 'LOGIN_KEY':
      console.log("set LOGIN_KEY")
      HelperJS.setSessionStorageFn('S', "UserKeyData", action.UserKeyData)
      return { ...state, ...{ UserKeyData:action.UserKeyData } }
    case 'USER_INFO':
      console.log("set USER_INFO")
      HelperJS.setSessionStorageFn('S', "UserInfoData", JSON.stringify(action.UserInfoData))
      return { ...state, ...{ UserInfoData:action.UserInfoData } }
    case 'CUS_INFO':
      console.log("set CUS_INFO")
      HelperJS.setSessionStorageFn('S', "CusInfoData", JSON.stringify(action.CusInfoData))
      return { ...state, ...{ CusInfoData:action.CusInfoData } }
    default:
      return defaultData
  }
}

export default reducer