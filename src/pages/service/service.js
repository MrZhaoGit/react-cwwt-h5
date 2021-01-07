import React from 'react'
import { Toast } from 'antd-mobile'
import { connect } from 'react-redux'
import qs from 'qs'
import HeaderJS from '../../commonJS/C-HeaderJS/C-HeaderJS'
import TabBars from '../tabBar/tabBar'

import PhoneIcon from '../../assets/common_icon/servicePhone_icon.png'
import EmailIcon from '../../assets/common_icon/serviceEmail_icon.png'

import './ServiceCSS/Service.scss'

class Service extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      ProductLinkBaseList: []
    }
  }
  async componentDidMount() {
    Toast.loading("正在获取客服信息...", 0)
    await this.getDefServiceDataFn()
  }
  async getDefServiceDataFn(){
    const that = this
    const LoginSessionKey = that.props.UserKeyData
    await that.$axios({
      method: 'post',
      url: '/Interface/BasicInfoHandler.ashx',
      data: qs.stringify({ 
        MethodType: 'M_GetProductLinkBaseList_1_0', 
        LoginSessionKey: LoginSessionKey
      })
    }).then((res)=>{
      if (res.IsLogin === 1) {
        const data = JSON.parse(res.ApiData)
        Toast.hide()
        console.log(data)
        that.setState({
          ProductLinkBaseList: data.ProductLinkBaseList
        })
      }
    })
  }
  getServiceIconFn(LinkType){
    if(LinkType === "1"){
      return PhoneIcon
    }else if(LinkType === "2"){
      return EmailIcon
    }
  }
  LeftClickFn(){
    this.props.history.push({pathname:'/'})
  }
  render(){
    return(
      <div className="ServiceDom">
        <HeaderJS 
          CHeaderConfig={{
            title: "客服",
            LeftClickFn: this.LeftClickFn.bind(this)
          }}
        />
        <div className="ServiceContent">
          {
            this.state.ProductLinkBaseList.map((item,index) => (
              <div className="SC_slider" key={index}>
                <img src={item.IconUrl !== "" ? item.IconUrl : this.getServiceIconFn(item.LinkType)} alt="" />
                {item.KeyName}
                {
                  item.LinkType === "1" ? <a href={"tel:" + item.KeyValue}>{item.KeyValue}</a>
                  : 
                  <span>{item.KeyValue}</span>
                }
              </div>
            ))
          }
          
        </div>
        <div className="indexTabBars">
          <TabBars TabBarsCofig={{selectTabBarIndex: 2}} />
        </div>
      </div>
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

export default connect(mapStateToProps)(Service)