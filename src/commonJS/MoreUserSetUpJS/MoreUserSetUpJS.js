import React from 'react'
import { List, Flex, Button, ActionSheet } from 'antd-mobile';
import qs from 'qs'
import CHeaderJS from '../C-HeaderJS/C-HeaderJS'
import "./MoreUserSetUpJS.scss"

const Item = List.Item

export default class MoreUserSetUpJS extends React.Component{
  constructor(props){
    super(props)
    const cityListIndex = this.props.moreMsg.state.showMoreUserSetUpConfig.useIndex
    const defMoreUserSetUpObj = this.props.moreMsg.state.XJCityFlightData[cityListIndex].moreUserSetUpObj
    console.log(defMoreUserSetUpObj)
    this.state = {
      defStartCityCode: "",
      defEndCityCode: "",
      ExpectedDepartureAirport: {airportCode: "", airportName: ""},
      ExpectedDepartureTime: "",
      ExpectedLandingAirport: {airportCode: "", airportName: ""},
      ExpectedLandingTime: "",
      ExpectedSpace: { spaceCode: "", spaceName: "" },
      CityFlightArr: [],
      ...defMoreUserSetUpObj
    }
    this.initUserSetUpFn()
  }
  // 初始使用
  initUserSetUpFn(e){
    // 初始获取是否设置data
    if(this.state.CityFlightArr.length <= 0){
      const cityListArr = this.props.moreMsg.state.XJCityFlightData
      const cityListIndex = this.props.moreMsg.state.showMoreUserSetUpConfig.useIndex
      const defcityArr = [cityListArr[cityListIndex].XJStartCity.cityCode, cityListArr[cityListIndex].XJEndCity.cityCode]
      for(let i = 0; i < defcityArr.length; i ++){
        this.getCityFlightFn(defcityArr[i], i)
      }
    }
  }
  LeftClickFn(e){
    console.log("out-click left-icon")
    this.props.moreMsg.getMoreUserSetUpFn("")
  }
  onConfirmFn(e){
    console.log(this)
    const IDindex = this.props.moreMsg.state.showMoreUserSetUpConfig.useIndex
    const moreUserSetUpObj = {
      "ExpectedDepartureAirport": this.state.ExpectedDepartureAirport,
      "ExpectedLandingAirport": this.state.ExpectedLandingAirport,
      "ExpectedDepartureTime": this.state.ExpectedDepartureTime,
      "ExpectedLandingTime": this.state.ExpectedLandingTime,
      "ExpectedSpace": this.state.ExpectedSpace,
    }
    this.props.moreMsg.getMoreUserSetUpFn(moreUserSetUpObj, IDindex)
  }
  onCancelFn(e){
    console.log(222)
    this.props.moreMsg.getMoreUserSetUpFn("")
  }
  // 期望出发/到达机场
  selectUserMsgFn(e){
    const that = this
    let buttonArr = []
    let CityInfo = []
    const CityFlightArr = that.state.CityFlightArr
    for(let i = 0; i<CityFlightArr.length; i ++){
      if(e === "startAirport" && CityFlightArr[i].keyIndex === 0){
        CityInfo = CityFlightArr[i].CityInfo
        buttonArr = CityFlightArr[i].CityInfo.map((item)=> item.AirPortName)
      } else if(e === "endAirport" && CityFlightArr[i].keyIndex === 1){
        CityInfo = CityFlightArr[i].CityInfo
        buttonArr = CityFlightArr[i].CityInfo.map((item)=> item.AirPortName)
      }
    }
    buttonArr.push("取消")
    ActionSheet.showActionSheetWithOptions({
      options: buttonArr,
      cancelButtonIndex: buttonArr.length - 1,
      title: e === "startAirport" ? "请选择出发机场" : "请选择到达机场",
      maskClosable: true
    },
    (buttonIndex) => {
      let getData = CityInfo[buttonIndex]
      console.log(getData)
      if(buttonIndex < buttonArr.length-1){
        if(e === "startAirport"){
          that.setState({
            ExpectedDepartureAirport: {airportCode: getData.CityCode, airportName: getData.AirPortName}
          })
        }else{
          that.setState({
            ExpectedLandingAirport: {airportCode: getData.CityCode, airportName: getData.AirPortName}
          })
        }
      }
    });
  }
  // 期望出发/到达时间
  selectUserTimeFn(e){
    const that = this
    const defuserTimeList = that.props.moreMsg.state.defTimePreferenceListArr
    const buttonArr = defuserTimeList.map((item)=> item.TimeString)
    buttonArr.push("取消")
    ActionSheet.showActionSheetWithOptions({
      options: buttonArr,
      cancelButtonIndex: buttonArr.length - 1,
      title: e === "startAirport" ? "请选择出发时段" : "请选择到达时段",
      maskClosable: true
    },
    (buttonIndex) => {
      let getData = defuserTimeList[buttonIndex]
      console.log(buttonIndex)
      if(buttonIndex < buttonArr.length-1){
        if(e === "startAirport"){
          that.setState({
            ExpectedDepartureTime: getData.TimeString
          })
        }else{
          that.setState({
            ExpectedLandingTime: getData.TimeString
          })
        }
      }
    });
  }
  // 期望乘坐舱位
  selectUserSpaceFn(){
    const that = this
    const defClassLevelPreferenceList = that.props.moreMsg.state.ClassLevelPreferenceList
    const buttonArr = defClassLevelPreferenceList.map((item)=> item.ClassLevelName)
    ActionSheet.showActionSheetWithOptions({
      options: buttonArr,
      cancelButtonIndex: buttonArr.length - 1,
      title: "请选择舱位",
      maskClosable: true
    },
    (buttonIndex) => {
      let getData = defClassLevelPreferenceList[buttonIndex]
      console.log(getData)
      if(buttonIndex < buttonArr.length-1){
        that.setState({
          ExpectedSpace: { spaceCode: getData.ClassLevelCode, spaceName: getData.ClassLevelName }
        })
      }
    });
  }
  getCityFlightFn(cityCode, keyIndex){
    const that = this
    const LoginSessionKey = that.props.moreMsg.props.UserKeyData
    that.$axios({
      method: 'post',
      url: '/Interface/DomesticFlightHandler.ashx',
      data: qs.stringify({ 
        MethodType: 'M_GetAirportsByCityCode_1_0', 
        CityCode: cityCode,
        LoginSessionKey: LoginSessionKey
      })
    }).then((res)=>{
      if (res.IsLogin === 1) {
        const airportObj = JSON.parse(res.ApiData)
        airportObj.keyIndex = keyIndex
        const CityFlightArr = this.state.CityFlightArr
        this.setState({
          CityFlightArr: [ ...CityFlightArr, airportObj]
        })
      }
    })
  }
  render (){
    return (
      <div className="MoreUserSetUpDom">
        <CHeaderJS 
          CHeaderConfig={{
            title: "更多偏好",
            LeftClickFn: this.LeftClickFn.bind(this)
          }}
        />
        <div className="MUSU_Content">
          <List>
            <Item
              className={this.state.ExpectedDepartureAirport.airportName !== ""?"hasSelectVal":""}
              arrow="horizontal"
              extra={this.state.ExpectedDepartureAirport.airportName === ""?"请选择出发机场":this.state.ExpectedDepartureAirport.airportName}
              onClick={this.selectUserMsgFn.bind(this, "startAirport")}
            >期望出发机场</Item>
            <Item
              className={this.state.ExpectedDepartureTime !== ""?"hasSelectVal":""}
              arrow="horizontal"
              extra={this.state.ExpectedDepartureTime === ""?"请选择出发时间":this.state.ExpectedDepartureTime}
              onClick={this.selectUserTimeFn.bind(this, "startAirport")}
            >期望出发时段</Item>
            <Item
              className={this.state.ExpectedLandingAirport.airportName !== ""?"hasSelectVal":""}
              arrow="horizontal"
              extra={this.state.ExpectedLandingAirport.airportName === ""?"请选择到达机场":this.state.ExpectedLandingAirport.airportName}
              onClick={this.selectUserMsgFn.bind(this, "endAirport")}
            >期望到达机场</Item>
            <Item
              className={this.state.ExpectedLandingTime !== ""?"hasSelectVal":""}
              arrow="horizontal"
              extra={this.state.ExpectedLandingTime === ""?"请选择到达时间":this.state.ExpectedLandingTime}
              onClick={this.selectUserTimeFn.bind(this, "endAirport")}
            >期望到达时段</Item>
            <Item
              className={this.state.ExpectedSpace.spaceName !== ""?"hasSelectVal":""}
              arrow="horizontal"
              extra={this.state.ExpectedSpace.spaceName === ""?"请选择舱位":this.state.ExpectedSpace.spaceName}
              onClick={this.selectUserSpaceFn.bind(this)}
            >期望乘坐舱位</Item>
          </List>
          <Flex
            className="MUSU_Btns"
            justify="around"
          >
            <Button
              className="MUSU_Btn"
              size="small"
              type="primary"
              onClick={this.onConfirmFn.bind(this)}
            >确定</Button>
            <Button
              className="MUSU_Btn"
              size="small"
              type="primary"
              onClick={this.onCancelFn.bind(this)}
            >取消</Button>
          </Flex>
        </div>
      </div>
    )
  }
}