import React from 'react'
import { Toast, Flex, List, Popover } from 'antd-mobile'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import qs from 'qs'
import HeaderJS from '../../commonJS/C-HeaderJS/C-HeaderJS'
import TabBars from '../tabBar/tabBar'

import userIcon from '../../assets/user_center_icon/user.png'
import ApplicationIcon from '../../assets/user_center_icon/ic_application@2x.png'
import ExamineIcon from '../../assets/user_center_icon/ic_examine@2x.png'

import OrderIcon from '../../assets/user_center_icon/order_icon.png'
import INOrderIcon from '../../assets/user_center_icon/inquiry_order_icon.png'
import NoIcon from '../../assets/user_center_icon/no_icon.png'
import ApprovalIcon from '../../assets/user_center_icon/approval_icon.png'
import EmployeesIcon from '../../assets/user_center_icon/employees_icon.png'
import PassengerIcon from '../../assets/user_center_icon/passenger_icon.png'
import PWDIcon from '../../assets/user_center_icon/setPWD_icon.png'
import LanguageENIcon from '../../assets/user_center_icon/languageEN_icon.png'
import LanguageZHIcon from '../../assets/user_center_icon/languageZH_icon.png'
import DWAPPIcon from '../../assets/user_center_icon/download_icon.png'
import AboutIcon from '../../assets/user_center_icon/about_icon.png'
import OutIcon from '../../assets/user_center_icon/loginOut_icon.png'

import './userConterCSS/Conter.scss'

const Item = List.Item
const PopoverItem = Popover.Item

class Service extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      userIcon: userIcon,
      showLanguageModal: false,
      LanguageType: "ZH"
    }
  }
  async componentDidMount() {
    //Toast.loading("正在获取客服信息...", 0)
    //await this.getDefServiceDataFn()
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
  LeftClickFn(){
    this.props.history.push({pathname:'/'})
  }
  RightClickFn(e){
    if(e === "0"){
      this.setState({
        showLanguageModal: true
      })
    }
  }
  goApprovalOrderPageFn(e){
    if(e === 0){
      this.props.history.push({pathname:'/Approve/WaitForApproval', state:{SourcePageID: 3}})
    }else {
      this.props.history.push({pathname:'/Approve/MyApprovalForm', state:{SourcePageID: 3}})
    }
  }
  selectLanguageTypeFn(e){
    this.setState({
      LanguageType: e,
      showLanguageModal: false
    })
    Toast.loading("正在为您切换语言，请稍后...", 0)
    setTimeout(() => {
      Toast.hide()
    }, 3000);
  }
  render(){
    let LanguageModal = ""
    if(this.state.showLanguageModal){
      LanguageModal = <div className="LanguageModal" onClick={(event)=> { event.stopPropagation(); event.preventDefault() }}>
        <div className="LM_Content">
          <p>请选择语言版本</p>
          <div onClick={this.selectLanguageTypeFn.bind(this, "ZH")}><img src={LanguageZHIcon} alt="" />简体中文-Simplified Chinese</div>
          <div onClick={this.selectLanguageTypeFn.bind(this, "EN")}><img src={LanguageENIcon} alt="" />英文-US</div>
        </div>
      </div>
    }
    let RightSelectDom = [
      (<PopoverItem key="0" className="PopoverItem" value="0">{ 
        this.state.LanguageType === "ZH" ? <span><img src={LanguageZHIcon} alt="" />语言(中文)</span> : <span><img src={LanguageENIcon} alt="" />语言(英文)</span>
      }</PopoverItem>),
      (<PopoverItem key="1" className="PopoverItem PopoverItem_out" value="1"><img src={OutIcon} alt="" />退出</PopoverItem>),
    ]
    console.log(this)
    return(
      <div className="UserConterDom">
        <HeaderJS 
          key={this.state.LanguageType}
          CHeaderConfig={{
            title: "",
            ClassName: "Center",
            userRightContent: true,
            LeftClickFn: this.LeftClickFn.bind(this),
            RightClickFn: this.RightClickFn.bind(this),
            RightSelectDom: RightSelectDom
          }}
        />
        <div className="UserConter_Content">
          <div className="UCC_banner">
            <div className="UCC_UserIcon">
              <img src={this.state.userIcon} alt="" />  
            </div>
          </div>
          <Flex
            className="UCC_UserTab"
            justify="around"
          >
            <div>
              <img src={ExamineIcon} onClick={this.goApprovalOrderPageFn.bind(this, 0)} alt="" />
              <p onClick={this.goApprovalOrderPageFn.bind(this, 0)}>待我审批</p>
            </div>
            <div>
              <img src={ApplicationIcon} onClick={this.goApprovalOrderPageFn.bind(this, 1)} alt="" />
              <p onClick={this.goApprovalOrderPageFn.bind(this, 1)}>我的审批</p>
            </div>
          </Flex>
          <List className="UCC_UserList">
            <Link to="/User/OrderList">
              <Item arrow="horizontal">
                <img src={OrderIcon} alt="" />
                我的订单
              </Item>
            </Link>
            <Item arrow="horizontal">
              <img src={INOrderIcon} alt="" />
              我的询价单
            </Item>
            <Item arrow="horizontal">
              <img className="NoIcon" src={NoIcon} alt="" />
              企业编号
            </Item>
            <Item arrow="horizontal">
              <img src={ApprovalIcon} alt="" />
              超标待我审批
            </Item>
            <Item arrow="horizontal">
              <img src={EmployeesIcon} alt="" />
              常用旅客
            </Item>
            <Item arrow="horizontal">
              <img src={PassengerIcon} alt="" />
              企业员工
            </Item>
            <Item arrow="horizontal">
              <img src={PWDIcon} alt="" />
              修改密码
            </Item>
            <Item arrow="horizontal">
              <img src={DWAPPIcon} alt="" />
              下载APP
            </Item>
            <Item arrow="horizontal">
              <img src={AboutIcon} alt="" />
              关于 myCWT-嘉信差旅
            </Item>
          </List>
          <div className="loginOut">退出登录</div>
        </div>
        <div className="indexTabBars">
          <TabBars TabBarsCofig={{selectTabBarIndex: 3}} />
        </div>
        {LanguageModal}
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