import React from 'react'
import { Toast, PullToRefresh, Card } from 'antd-mobile'
import HeaderJS from '../../commonJS/C-HeaderJS/C-HeaderJS'
import TabBars from '../tabBar/tabBar'
import $ from 'jquery'
import { connect } from 'react-redux'
import qs from 'qs'

import FlightIcon from '../../assets/common_icon/ic_flight1@2x.png'
import TrainIcon from '../../assets/common_icon/ic_train1@2x.png'
import CardIcon01 from '../../assets/common_icon/CardIcon01.png'
import CardIcon02 from '../../assets/common_icon/CardIcon02.png'
import CardIcon04 from '../../assets/common_icon/CardIcon04.png'
import CardIcon07 from '../../assets/common_icon/CardIcon07.png'
// import BackTopIcon from '../../assets/common_icon/backtop_icon.png'

import './TripCss/TripCss.scss'

class Trip extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      defTripData: [],
      height: document.documentElement.clientHeight,
    }
  }
  async componentDidMount() {
    Toast.loading("正在获取行程单...", 0)
    this.tripData = await this.getDefTripDataFn()
    this.setState({
      defTripData: this.tripData
    })
  }
  async getDefTripDataFn(){
    const that = this
    const LoginSessionKey = that.props.UserKeyData
    let newTripData = []
    await that.$axios({
      method: 'post',
      url: '/Interface/OrderOperateHandler.ashx',
      data: qs.stringify({ 
        MethodType: 'M_GetUserTripList_1_1', 
        LoginSessionKey: LoginSessionKey,
        PublicOrPriveate: "0",
        IsContainBus: "0",
        Language: "CH"
      })
    }).then((res)=>{
      if (res.IsLogin === 1) {
        const data = JSON.parse(res.ApiData)
        Toast.hide()
        console.log(data)
        newTripData = that.CombiningNewTripDataFn(data)
      }
    })
    console.log(newTripData)
    return newTripData
  }
  CombiningNewTripDataFn(data){
    const newTripArr = []
    const getTripData = [...data.TripFlightInfo, ...data.TripTrainInfo]
    const getTripKeyData = data.TripList
    for(let i = 0; i < getTripKeyData.length; i ++){
      let newTripObj = {}
      for(let j = 0; j < getTripData.length; j ++){
        if(getTripKeyData[i].TripOrderType === getTripData[j].TripOrderType && getTripKeyData[i].TripIndex === getTripData[j].TripIndex){
          newTripObj = getTripData[j]
        }
      }
      newTripArr.push(newTripObj)
    }
    return newTripArr
  }
  getTCSliderDomFn(){
    const TCSliderData = this.state.defTripData
    const TCSliderDom = TCSliderData.map((item,idx) => {
      const CardTitle = item.TripOrderType === "F" ? <span>机票</span> : <span>火车票</span>
      const CardIcon = item.TripOrderType === "F" ? FlightIcon : TrainIcon
      const CardExtra = item.TripOrderType === "F" ? item.FlightTimeSpan : item.TrainTimeSpan
      const CardBody = item.TripOrderType === "F" ? <ul className="TCS_BodyCard">
          <li><img src={CardIcon01} alt=""/>地点: {item.BoardPointName + "-" + item.OffPointName}</li>
          <li><img src={CardIcon02} alt=""/>机场: {item.BoardPointAirPortName + item.BoardPointAT + "-" + item.OffPointAirPortName + item.OffPointAT}</li>
          <li><img src={CardIcon04} alt=""/>航班: {item.CarrierName + item.FlightNO}</li>
        </ul> : <ul className="TCS_BodyCard">
          <li><img src={CardIcon01} alt=""/>地点: {item.FromStation + "-" + item.ToStation}</li>
          <li><img src={CardIcon07} alt=""/>车次: {item.SeatType + " " + item.TrainCode}</li>
        </ul>
      return(
        <div className="TC_Slider" key={idx}>
          <div className="TCS_title">
            <span className="TCS_title_point"><span className="TCS_title_point_line"></span></span>
            <span>2021-03-26 09:00 - 2021-03-26 11:50</span>
          </div>
          <Card className="TCS_title_Card">
            <Card.Header
              title= {CardTitle}
              thumb={CardIcon}
              extra={CardExtra}
            />
            <Card.Body>{CardBody}</Card.Body>
          </Card>
        </div>
      )
    })
    return TCSliderDom
  }
  LeftClickFn(){
    this.props.history.push({pathname:'/'})
  }
  async onRefreshFn(){
    this.tripData = []
    await this.setState({
      defTripData: [],
      height: document.documentElement.clientHeight,
    })
    this.componentDidMount()
  }
  BackTopFn(){
    const topVal = $(".am-pull-to-refresh-content-wrapper").offset().top
    console.log(topVal)
    if(topVal < -800){
      console.log(111)
      $(".am-pull-to-refresh-content-wrapper").scrollTop(0)
    }
  }
  render(){
    let TCSliderDom = this.getTCSliderDomFn()
    return(
      <div className="TripDom">
        <HeaderJS 
          CHeaderConfig={{
            title: "行程",
            LeftClickFn: this.LeftClickFn.bind(this)
          }}
        />
        <div className="TripContent" id="TripContent">
          <PullToRefresh
            ref={el => this.ptr = el}
            onRefresh={this.onRefreshFn.bind(this)}
            style={{
              height: this.state.height,
              overflow: 'auto',
            }}
          >
            {TCSliderDom}
          </PullToRefresh>
        </div>
        <div className="indexTabBars">
          <TabBars TabBarsCofig={{selectTabBarIndex: 1}} />
        </div>
        {/* <div 
          className="backTop"
          onClick={this.BackTopFn}
        >
          <img src={BackTopIcon} alt="" />
        </div> */}
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

export default connect(mapStateToProps)(Trip)