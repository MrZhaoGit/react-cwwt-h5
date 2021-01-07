import React from 'react'
import { connect } from 'react-redux'
import {WingBlank, Carousel, Grid } from 'antd-mobile'
import { Link } from 'react-router-dom'
import TabBars from '../tabBar/tabBar'
import './home.scss'
import imgCard from '../../assets/home_icon/index-banner.png'
import imgBus from '../../assets/home_icon/ic_business@2x.png'
import imgAp from '../../assets/home_icon/ic_home_application@2x.png'
import imgMOrder from '../../assets/home_icon/ic_home_order@2x.png'
import imgExam from '../../assets/home_icon/ic_home_examine@2x.png'
import imgMBook from '../../assets/home_icon/ic_mybooking@2x.png'
import imgBook from '../../assets/home_icon/userAgreement.png'
import imgTru from '../../assets/home_icon/gonggao.png'
import imgZliao from '../../assets/home_icon/ic_wodeziliao@2x.png'
import imgAir from '../../assets/home_icon/ic_home_airplane@2x.png'
import imgIAir from '../../assets/home_icon/ic_home_airplaned.png'
import imgHotel from '../../assets/home_icon/ic_home_hoteld.png'
import imgIHotel from '../../assets/home_icon/ic_home_hotel@2x.png'
import imgTrain from '../../assets/home_icon/ic_home_train@2x.png'
import imgCar from '../../assets/home_icon/ic_home_car@2x.png'
import imgVisa from '../../assets/home_icon/ic_home_visa@2x.png'
import imgVip from '../../assets/home_icon/ic_home_vip@2x.png'

class Home extends React.Component {
  constructor (props){
    super(props)
    const flexData = [
      {
        "icon": imgExam,
        "text": "待我审批",
        "RouterLink": "/Approve/WaitForApproval",
        "RouterState": {SourcePageID: 0},
        "isShowType": false
      },{
        "icon": imgExam,
        "text": "我的审批",
        "RouterLink": "/Approve/MyApprovalForm",
        "RouterState": {SourcePageID: 0},
        "isShowType": false
      },{
        "icon": imgMBook,
        "text": "我的行程",
        "RouterLink": "/trip",
        "isShowType": false
      },{
        "icon": imgZliao,
        "text": "我的资料",
        "RouterLink": "/User/Center",
        "isShowType": false
      },{
        "icon": imgExam,
        "text": "审批单",
        "RouterLink": "/",
        "isShowType": false
      },{
        "icon": imgAp,
        "text": "出差申请",
        "RouterLink": "/",
        "isShowType": false
      },{
        "icon": imgBus,
        "text": "我的出差",
        "RouterLink": "/",
        "isShowType": false
      },{
        "icon": imgMOrder,
        "text": "我的订单",
        "RouterLink": "/",
        "isShowType": false
      }
    ]
    const gridData = [
      {
        "icon": imgAir,
        "text": "国内机票",
        "isShowType": "FD",
        "RouterLink": "/Flight/Search"
      },{
        "icon": imgIAir,
        "text": "国际机票",
        "isShowType": "FI",
        "RouterLink": "/Flight/InterSearch"
      },{
        "icon": imgHotel,
        "text": "国内酒店<br/>(含港澳台)",
        "isShowType": "JD",
        "RouterLink": "/Hotel/Search"
      },{
        "icon": imgIHotel,
        "text": "国际酒店",
        "isShowType": "JI",
        "RouterLink": "/Hotel/InterSearch"
      },{
        "icon": imgTrain,
        "text": "火车票",
        "isShowType": "HC",
        "RouterLink": "/Train/Search"
      },{
        "icon": imgCar,
        "text": "租车",
        "isShowType": "ZC",
        "RouterLink": "/CarRental/Search"
      },{
        "icon": imgVisa,
        "text": "签证",
        "isShowType": "QZ",
        "RouterLink": "/Visa/Search"
      },{
        "icon": imgVip,
        "text": "贵宾厅",
        "isShowType": "GB",
        "RouterLink": "/Vip/Search"
      }
    ]
    const newflexData = this.setUserBusConfig(this.props.CusInfoData, flexData)
    const newGridData = this.setUserTravelConfig(this.props.CusInfoData, gridData)
    this.state = {
      imgHeight: 125,
      flexData: newflexData,
      gridData: newGridData
    }
  }
  setUserBusConfig(CusInfoData,flexData){
    const ApprovalType = CusInfoData.ApprovalType
    const HideTripApplyAddBtn = Number(CusInfoData.HideTripApplyAddBtn)
    const flexDataArr = []
    for(let a = 0; a<flexData.length;a++){
      if(ApprovalType === 0){
        if(a === 0 || a === 1 || a === 2 || a === 3 ){
          flexDataArr.push(flexData[a])
        }
      }else if(ApprovalType === 1){
        if(HideTripApplyAddBtn === 1){
          if(a === 6 || a === 7){
            flexDataArr.push(flexData[a])
          }
        }else if(HideTripApplyAddBtn === 0){
          if(a === 4 || a === 5 || a === 6 || a === 7 ){
            flexDataArr.push(flexData[a])
          }
        }
      }
    }
    return flexDataArr
  }
  setUserTravelConfig(CusInfoData, gridData){
    const CusProductStr = CusInfoData.CusProduct
    const gridDataArr = []
    for(let a = 0;a<gridData.length;a++){
      const aType = gridData[a].isShowType
      if(CusProductStr.indexOf(aType)>=0){
        gridDataArr.push(gridData[a])
      }
    }
    return gridDataArr
  }
  render(){
    return (
      <div className="homePage">
        <div className="homeTitle">myCWT-嘉信差旅</div>
        <Carousel>
          <a style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }} href="/" >
            <img
              src={imgCard}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
                this.setState({ imgHeight: 'auto' });
              }}
            />
          </a>
        </Carousel>
        <Grid
          className="homeUserCard"
          data={this.state.flexData}
          columnNum={4}
          square={false}
          hasLine={false}
          renderItem={dataItem => {
            return <Link to={{pathname: dataItem.RouterLink, state: dataItem.RouterState}}><div className="GridCard">
              <img className="imgGrid" src={dataItem.icon} alt="" />
              <p dangerouslySetInnerHTML={{__html: dataItem.text}} />
            </div></Link>
          }}
        />
        <WingBlank className="homeTips">
          <img className="imgTru" src={imgTru} alt="" />
          <img className="imgBook" src={imgBook} alt="" />
          <span>全球隐私政策和公告</span>
        </WingBlank>
        <Grid
          data={this.state.gridData}
          className="homeGrid"
          columnNum={4}
          square={false}
          hasLine={false}
          renderItem={dataItem => (
            <div className="GridCard">
              <Link to={dataItem.RouterLink}><img className="imgGrid" src={dataItem.icon} alt="" /></Link>
              <Link to={dataItem.RouterLink}><p dangerouslySetInnerHTML={{__html: dataItem.text}} /></Link>
            </div>
          )}
        />
        <div className="indexTabBars">
          <TabBars TabBarsCofig={{selectTabBarIndex: 0}} />
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

export default connect(mapStateToProps)(Home);