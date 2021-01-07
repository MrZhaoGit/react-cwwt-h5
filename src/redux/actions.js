// 避免常量名称的一定行重复，将常量定义命名是好的建议
export const LOGIN_KEY = 'LOGIN_KEY'
export const USER_INFO = 'USER_INFO'
export const CUS_INFO = 'CUS_INFO'
export const COMMON_INFO = 'COMMON_INFO'

// 
export const createLoginKeyFn = (data) => ({
  type: 'LOGIN_KEY',
  UserKeyData: ''
})
export const createUserInfoFn = (data) => ({
  type: 'USER_INFO',
  UserInfoData: ''
})

export const createCusInfoFn = (data) => ({
  type: 'CUS_INFO',
  CusInfoData: ''
})

export const createCommonInfoFn = (data) => ({
  type: 'COMMON_INFO',
  CommonInfoData: ''
})