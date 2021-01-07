/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { connect } from 'react-redux'
import { Flex, Button, WingBlank, WhiteSpace, List, InputItem, Icon, Toast  } from 'antd-mobile';
import { HelperJS } from '../../commonJS/C-Helper'
import CryptoJS from 'crypto-js'
import qs from 'qs'
import { onLogin, loginOut } from '../../cookies/index'
import Logo from '../../assets/home_icon/mycwt_logo-165x54.png'
import userNameIcon from '../../assets/common_icon/ic_name2@2x.png'
import userPwdIcon from '../../assets/common_icon/ic_password@2x.png.png'
import './login.scss'

class Login extends React.Component {
  constructor (props){
    super(props)
    this.state = {
      isLogin: false,
      userName: '',
      userPassword: '',
      isSaveUser: false,
      LoginSessionKey: ''
    }
  }
  componentDidUpdate(){
    if(this.state.isLogin){
      localStorage.setItem("__config_center_token", true)
      this.props.history.push('/')
    }
  }
  inputFocusFn(a){
    a.target.focus()
  }

  saveUserMsgFn(e,i){
    if(e === "userName"){
      let setVal = HelperJS.delStrSpaceFn({str:i,type:0})
      this.setState({userName: setVal})
    } else if (e === "userPWD"){
      this.setState({userPassword: i})
    }
  }

  saveUserFn = (e)=>{
    if(this.state.isSaveUser){
      this.setState({isSaveUser: false})
    } else {
      this.setState({isSaveUser: true})
    }
  }
  
  loadFn = (e) =>{
    e.preventDefault();
    const that = this
    if(that.state.userName === "" || that.state.userPassword === ""){
      return Toast.info("用户名或密码输入错误")
    }
    let username = that.state.userName
    let password = that.state.userPassword
    let pwdmd5 = CryptoJS.MD5(password).toString()

    let sCacheKey = HelperJS.newGuidFn()
    if (!sCacheKey || sCacheKey === '') {
      return Toast.info("GUID生成失败,请重新登录！")
    }
    Toast.loading("登录中，请稍候", 0)

    that.$axios({
      method: 'post',
      url: '/Interface/LoginHandler.ashx',
      data: qs.stringify({ 
        MethodType: 'M_GetEncryptKey_1_0', 
        CacheKey: sCacheKey 
      })
    }).then((res) => {
      const EncryptKey = res.EncryptKey
      const userName = CryptoJS.MD5(username.toLowerCase()).toString();
      const EncryptUserName = this.GetEncryptStrFn(userName, EncryptKey).replace(/%/g, '%25').replace(/\+/g, '%2B')
      const EncryptUserPwd = this.GetEncryptStrFn(pwdmd5, EncryptKey).replace(/%/g, '%25').replace(/\+/g, '%2B')
      that.$axios({
        method: 'post',
        url: '/Interface/LoginHandler.ashx',
        data: qs.stringify({
          MethodType: 'M_Login_1_0', 
          username: EncryptUserName,
          password: EncryptUserPwd,
          CacheKey: sCacheKey
        })
      }).then((res)=>{
        if(res.status === 1){
          if(that.state.isSaveUser){
            onLogin("username", username, { path: "/", expires: 7, HttpOnly: true })
            onLogin("userPwd", pwdmd5, { path: "/", expires: 7, HttpOnly: true })
            onLogin("isPwd", 1, { path: "/", expires: 7, HttpOnly: true })
          } else {
            loginOut("userMsg", false)
          }
          if(res.LoginSessionKey){
            that.props.createLoginKeyFn(res.LoginSessionKey)
            HelperJS.setLocalStorageFn("S", "H5_Lang_Switch", res.Lang)
            that.GetUserInfoFn(res.LoginSessionKey)
          }
        } else {
          const errMsg = HelperJS.GetErrStrFn(res.msg)
          Toast.hide()
          Toast.info(errMsg)
        }
      })
    })
  }
  // 获取用户基础信息
  GetUserInfoFn = (keyVal) => {
    const that = this
    that.$axios({
      method: 'post',
      url: '/Interface/UserCenterHandler.ashx',
      data: qs.stringify({
        MethodType: 'M_GetUserInfo_1_0', 
        LoginSessionKey: keyVal
      })
    }).then((res)=>{
      if(res.IsLogin === 1){
        const data = JSON.parse(res.ApiData)
        if(data.M_ErrorInfo_1_0){
          const errMsg = HelperJS.GetErrStrFn(data.msg)
          Toast.hide()
          Toast.info(errMsg)
        }else{
          that.props.createUserInfoFn(data.UserInfo)
          that.GetCusInfoFn(keyVal)
        }
      }
    })
  }
  // 获取用户企业配置
  GetCusInfoFn = (keyVal) =>{
    const that = this
    that.$axios({
      method: 'post',
      url: '/Interface/UserCenterHandler.ashx',
      data: qs.stringify({
        MethodType: 'M_GetCusInit_1_0', 
        LoginSessionKey: keyVal
      })
    }).then((res)=>{
      const defData = JSON.parse(res.ApiData)
      if(defData.M_ErrorInfo_1_0){
        const errMsg = HelperJS.GetErrStrFn(defData.msg)
        Toast.hide()
        Toast.info(errMsg)
      }else{
        that.props.createCusInfoFn(defData)
        Toast.hide()
        that.setState({isLogin: true})
      }
    })
  }
  // 登录信息加密使用
  GetEncryptStrFn = (useStr, keyStr) => {
    var base64 = CryptoJS.enc.Utf8.parse(keyStr)
    var encrypt = CryptoJS.TripleDES.encrypt(useStr, base64, {
        //iv: CryptoJS.enc.Utf8.parse('01234567'),//iv偏移量  
        //mode: CryptoJS.mode.CBC,  //CBC模式  
        mode: CryptoJS.mode.ECB,  //ECB模式  
        padding: CryptoJS.pad.Pkcs7//padding处理  
    }
            );
    var encryptData = encrypt.toString(); //加密完成后，转换成字符串  
    return encryptData;
  }
  render (){
    return (
      <WingBlank>
        <img src={Logo} className="cwtLogo" />
        <div className="loadDom">
          <WhiteSpace size="sm"/>
          <List className="userNameBox">
            <InputItem
              defaultValue={this.state.userName}
              placeholder="请输入您的账号"
              className="userIpt userName"
              name="userName"
              onClick={this.inputFocusFn}
              onChange={this.saveUserMsgFn.bind(this,'userName')}
            ></InputItem>
            <img src={userNameIcon} className="userIcon userNameIcon" />
          </List>
          <WhiteSpace size="lg"/>
          <List className="userPWDBox">
            <InputItem
              type="password"
              placeholder="请输入登录密码"
              className="userIpt userPWD"
              name="userPWD"
              onClick={this.inputFocusFn}
              onChange={this.saveUserMsgFn.bind(this,'userPWD')}
            ></InputItem>
            <img src={userPwdIcon} className="userIcon userPwdIcon" />
          </List>
          <WhiteSpace size="sm"/>
          <Flex
            justify="between"
          >
            <div onClick={this.saveUserFn}><Icon type="check-circle" className="saveUser" color={this.state.isSaveUser?"#FF694B":"#fff"} size="xxs" />记住密码</div>
            <div>忘记密码</div>
          </Flex>
          <WhiteSpace size="xl"/>
          <Button 
            type="primary"
            onClick={this.loadFn}
          >登录</Button>
          <WhiteSpace size="sm"/>
          <div>用户激活</div>
        </div>
      </WingBlank>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    UserKeyData: state.UserKeyData,
    UserInfoData: state.UserInfoData,
    CusInfoData: state.CusInfoData
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createLoginKeyFn:(data)=>{
      dispatch({
        type: "LOGIN_KEY",
        UserKeyData: data
      })
    },
    createUserInfoFn: (data)=>{
      dispatch({
        type: "USER_INFO",
        UserInfoData: data
      })
    },
    createCusInfoFn: (data)=>{
      dispatch({
        type: "CUS_INFO",
        CusInfoData: data
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);