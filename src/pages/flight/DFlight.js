import React from 'react'
import { WingBlank, Flex, Icon, InputItem, Button, ActionSheet, SwipeAction, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import CalendarJS from '../../commonJS/CalendarJS'
import { HelperJS } from '../../commonJS/C-Helper'
import { connect } from 'react-redux'
import qs from 'qs'
import $ from 'jquery'
import FlightTabBar from '../tabBar/flightTabBar'
import CityJS from '../../commonJS/CityJS/CityJS'
import MoreUserSetUpJS from '../../commonJS/MoreUserSetUpJS/MoreUserSetUpJS'
import FlightBanner from '../../assets/flight_icon/air-banner.png'
import ExchangeImg from '../../assets/flight_icon/ic_airC01@2x.png'
import imgBook from '../../assets/home_icon/userAgreement.png'
import imgTru from '../../assets/home_icon/gonggao.png'
import addIcon from '../../assets/flight_icon/add_icon.png'
import deletIcon from '../../assets/flight_icon/delet_icon.png'
import './FlightCSS/DFlight.scss'

class DFlight extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isRTType: false, // 是否往返
      isShowFlightTime: false, // 是否向下使用时分时间
      TravelModel: false, // 机票是否使用出差单
      activeType: "OW",
      calendarConfig: {},
      startCityObj: { cityCode: "PEK", cityName: "北京" },
      endCityObj: { cityCode: "SHA", cityName: "上海" },
      startDate: "",
      endDate: "",
      CityPlug: {
        isShow: false
      },
      defTimePreferenceListArr: [
        {
          "TimeString": "全部"
        },
        {
          "TimeString": "00:00-12:00"
        }, {
          "TimeString": "12:00-14:00"
        }, {
          "TimeString": "14:00-18:00"
        }, {
          "TimeString": "18:00-24:00"
        }
      ],
      ClassLevelPreferenceList: [],
      orderType: "D",
      selInsType:[
        {
          InsCode: "1",
          InsName: "因公",
          isSelected: true
        },{
          InsCode: "2",
          InsName: "因私",
          isSelected: false
        }
      ],
      XJCityFlightData:[
        {
          "XJStartCity": { "cityCode": "", "cityName": "" },
          "XJEndCity": { "cityCode": "", "cityName": "" },
          "XJStartDate": "",
          "moreUserSetUpObj": {
            "ExpectedDepartureAirport": {"airportCode": "", "airportName": ""},
            "ExpectedLandingAirport": {"airportCode": "", "airportName": ""},
            "ExpectedDepartureTime": "",
            "ExpectedLandingTime": "",
            "ExpectedSpace": { "spaceCode": "", "spaceName": "" },
          }
        }
      ], // 询价单数据储存
      showMoreUserSetUpConfig: { show: false }
    }
    this.flightInitDataFn()
    // this.XJCityFlightData = [
    //   {
    //     "XJStartCity": { "cityCode": "PEK", "cityName": "北京" },
    //     "XJEndCity": { "cityCode": "HAS", "cityName": "上海" },
    //     "moreUserSetUpObj": {
    //       "ExpectedDepartureAirport": {"airportCode": "", "airportName": ""},
    //       "ExpectedLandingAirport": {"CityCode": "", "CityName": ""},
    //       "ExpectedDepartureTime": "",
    //       "ExpectedLandingTime": "",
    //       "ExpectedSpace": { "spaceCode": "", "spaceName": "" },
    //     }
    //   }
    // ]
  }
  flightInitDataFn(){
    // 初始加载获取舱位以及时间设置
    this.getFlightTime("D")
  }
  changeTabSliderFn(e){
    this.setState({activeType: e})
    if(e === "OW"){
      this.setState({
        isRTType: false
      })
    }else if(e === "RT"){
      this.setState({
        isRTType: true
      })
    }else if(e === "XJ"){

    }
  }
  selectCalendarFn(e,eindex){
    let title = (e === "startDate" || e === "startCityXJ")?"请选择出发日期":"请选择返程日期"
    const minDate = HelperJS.getDateFn(new Date())
    this.setState({calendarConfig: {
      type: (this.state.activeType === "OW" || this.state.activeType === "XJ")?"one":(this.state.activeType === "RT"?"range":""),
      show: true,
      eindex: typeof eindex === "number"? eindex : "", // 动态数据所表示的下标值
      title: title,
      begin: "去程",
      over: "返程",
      begin_over: "去/返",
      minDate: minDate,
      startDate: this.state.startDate,
      endDate: this.state.endDate
    }})
  }
  getCalendarMsgFn(res,msg, eIndex){
    if(msg === ""){
      this.setState({calendarConfig:{}})
    } else {
      var startDate = "", endDate = ""
      if(typeof msg.startTime !== "undefined"){
        startDate = HelperJS.getDateFn(msg.startTime) 
      }
      if(typeof msg.endTime !== "undefined" && this.state.activeType === "RT"){
        endDate = HelperJS.getDateFn(msg.endTime) 
      }
      
      if(this.state.activeType === "XJ"){
        let items = this.state.XJCityFlightData
        items[eIndex].XJStartDate = startDate
        this.setState({
          moreUserSetUpObj: {
            XJCityFlightData: items
          },
          calendarConfig:{}
        })
      }else {
        this.setState({
          startDate: startDate,
          endDate: endDate,
          calendarConfig:{}
        })
      }
    }
  }
  // 获取舱位以及触发事件设置
  getFlightTime(domcType){
    //flight_CW_TIME
    const that = this
    const LoginSessionKey = that.props.UserKeyData
    that.$axios({
      method: 'post',
      url: '/Interface/FlightInquiryHandler.ashx',
      data: qs.stringify({ 
        MethodType: 'M_GetCustomerPreference_1_0', 
        LoginSessionKey: LoginSessionKey,
        IsDomc: domcType 
      })
    }).then((res)=>{
      if (res.IsLogin === 1) {
        const data = JSON.parse(res.ApiData)
        console.log(data)
        const setClassLevelPreferenceList = [{ClassLevelCode: "ALL", ClassLevelName: "不限舱位", isSelected: true}]
        const fliterDClassLevel = that.props.CusInfoData.FliterDClassLevel
        const ClassLevelArr = fliterDClassLevel.replace(/\|/g, ",").split(",") // 屏蔽舱位
        const FltTimeValue = Number(that.props.CusInfoData.FltTimeValue)// 获取是否使用后台时间管理
        if(FltTimeValue === 1){
          that.setState({defTimePreferenceListArr: [{"TimeString": "全部"},...data.TimePreferenceList]})
        }
        for(let i =0; i<data.ClassLevelPreferenceList.length; i++){
          var setType = true
          if(ClassLevelArr.length>0){
            for(let j =0; j<ClassLevelArr.length; j++){
              if (data.ClassLevelPreferenceList[i].ClassLevelCode === ClassLevelArr[j]) {
                setType = false
              }
            }
            if(setType){
              data.ClassLevelPreferenceList[i].isSelected = false;
              setClassLevelPreferenceList.push(data.ClassLevelPreferenceList[i])
            }
          }
        }
        if(setClassLevelPreferenceList.length>0){
          setClassLevelPreferenceList.push({ClassLevelCode: "CLS", ClassLevelName: "取消", isSelected: false})
          that.setState({ClassLevelPreferenceList: setClassLevelPreferenceList})
        }
      }
    })
  }
  // 舱位选择
  selectLevelMsgFn(e){
    const that = this
    const buttonArr = that.state.ClassLevelPreferenceList.map((item)=>{
      return item.ClassLevelName
    })
    ActionSheet.showActionSheetWithOptions({
      options: buttonArr,
      cancelButtonIndex: buttonArr.length - 1,
      title: '请选择舱位',
      maskClosable: true
    },
    (buttonIndex) => {
      if(buttonIndex < buttonArr.length-1){
        const getData = [...that.state.ClassLevelPreferenceList]
        that.setState({
          ClassLevelPreferenceList: getData.map((item, idx) => idx === buttonIndex ?{...item,isSelected: true}: {...item, isSelected: false})
        })
      }
    });
  }
  // 费用类型选择
  selInsTypeFn(){
    const that = this
    const buttonArr = that.state.selInsType.map((item)=> item.InsName)
    buttonArr.push("取消")
    ActionSheet.showActionSheetWithOptions({
      options: buttonArr,
      cancelButtonIndex: buttonArr.length - 1,
      title: '请选择费用类型',
      maskClosable: true
    },
    (buttonIndex) => {
      const getData = [...that.state.selInsType]
      that.setState({
        selInsType: getData.map((item, idx) => idx === buttonIndex ?{...item,isSelected: true}: {...item, isSelected: false})
      })
    });
  }
  // 选择出发/到达城市
  selectCityFn(e,j){
    this.setState({CityPlug: {
      isShow: true,
      CtiyType: "D",
      id: e,
      idIndex: typeof j === "number"? j : "" // 多数据动态调用时使用
    }})
  }
  // 调用城市组件返回信息
  setThisCityFn(e,useId, useIdIndex){
    if(e !== ""){
      if(typeof useIdIndex === "number" && this.state.activeType === "XJ"){
        let items = this.state.XJCityFlightData
        if(useId === "startCity"){
          items[useIdIndex].XJStartCity = {cityCode: e.CityCode, cityName: e.CityName}
        }else{
          items[useIdIndex].XJEndCity = {cityCode: e.CityCode, cityName: e.CityName}
        }
        this.setState({
          XJCityFlightData: items
        })
      }
      if(useId === "startCity"){
        this.setState({
          startCityObj: {
            cityCode: e.CityCode, 
            cityName: e.CityName
          }
        })
      }else {
        this.setState({
          endCityObj: {
            cityCode: e.CityCode, 
            cityName: e.CityName
          }
        })
      }
    }
    this.setState({CityPlug: {isShow: false}})
  }
  // 城市交换
  exchangeCityFn(){
    $(".exchangeCity").css("animation","rotate .5s linear 1")
    const startCityObj = this.state.startCityObj
    const endCityObj = this.state.endCityObj
    this.setState({
      startCityObj: {
        cityCode: endCityObj.cityCode, 
        cityName: endCityObj.cityName
      },
      endCityObj: {
        cityCode: startCityObj.cityCode, 
        cityName: startCityObj.cityName
      }
    })
    setTimeout(() => {
      $(".exchangeCity").css("animation","")
    }, 600);
  }
  // 询价设置更多偏好
  moreUserSetUpFn(e){
    this.setState({
      showMoreUserSetUpConfig: {
        show: true,
        useIndex: typeof e === "number"? e : ""
      }
    })
  }
  // 获取询价设置更多偏好
  getMoreUserSetUpFn(userData,IDindex){
    if(userData!==""){
      let items = this.state.XJCityFlightData
      items[IDindex].moreUserSetUpObj = userData
      this.setState({
        XJCityFlightData: items,
        showMoreUserSetUpConfig: {
          show: false,
          useIndex: ""
        }
      })
      return
    }
    this.setState({
      showMoreUserSetUpConfig: {
        show: false,
        useIndex: ""
      }
    })
  }
  // 询价单新增一程
  addEmptyLegFn(){
    const emptyLegObj = {
      "XJStartCity": { "cityCode": "", "cityName": "" },
      "XJEndCity": { "cityCode": "", "cityName": "" },
      "XJStartDate": "",
      "moreUserSetUpObj": {
        "ExpectedDepartureAirport": {"airportCode": "", "airportName": ""},
        "ExpectedLandingAirport": {"airportCode": "", "airportName": ""},
        "ExpectedDepartureTime": "",
        "ExpectedLandingTime": "",
        "ExpectedSpace": { "spaceCode": "", "spaceName": "" },
      }
    }
    const XJCityFlightData = this.state.XJCityFlightData
    //XJCityFlightData.push(emptyLegObj)
    this.setState({
      XJCityFlightData: [...XJCityFlightData,emptyLegObj]
    })
  }
  // 询价单删除一程
  delLegFn(e){
    const { XJCityFlightData } = this.state
    const newData = [...XJCityFlightData]
    newData.map((item, index) =>{
      if (index === e) {
        newData.splice(index, 1);
        this.setState({
          XJCityFlightData: newData
        });
      }
      return null
    })
  }
  // 搜索航班
  searchFlightMsgFn(){
    const startCity = this.state.startCityObj
    const endCity = this.state.endCityObj
    const startDate = this.state.startDate
    if(startCity.cityName === ""){
      Toast.info("请选择出发城市", 1)
    }
    if(endCity.cityName === ""){
      Toast.info("请选择到达城市", 1)
    }
    if(startDate === ""){
      Toast.info("请选择出发日期", 1)
    }
  }
  render (){
    let TravelModelDom = ""
    let FlightDateDom = ""
    let FlightTimeDom = {}
    let ClassLevelName = ""
    let InsTypeName = ""
    let cityPlugDom = ""
    let moreUserSetUpDom = ""
    let showStyle = true
    if(this.state.activeType === "XJ"){
      showStyle = false
    }
    if(this.state.TravelModel){
      TravelModelDom = <li>
        <InputItem
          className="searchMsg tripOrder"
          editable = {false}
          placeholder="请选择出差申请单"
        ><div>出差申请单</div></InputItem>
      </li>
    }
    if(this.state.isRTType){
      FlightDateDom = <li>
        <InputItem
          className="searchMsg endDate"
          editable = {false}
          placeholder="请选择返程日期"
          defaultValue={this.state.endDate}
          value = {this.state.endDate}
          onClick = {this.selectCalendarFn.bind(this,"endDate")}
        ><div>返程日期</div></InputItem>
      </li>
    }
    if(this.state.isShowFlightTime){
      FlightTimeDom.startFlightTime = <li>
        <InputItem
          className="searchMsg startTime"
          editable = {false}
          placeholder="请选择出发时间"
        ><div>出发时间</div></InputItem>
      </li>
      if(this.state.isRTType){
        FlightTimeDom.endFlightTime = <li>
          <InputItem
            className="searchMsg endTime"
            editable = {false}
            placeholder="请选择返程时间"
          ><div>返程时间</div></InputItem>
        </li>
      }
    }
    for(let i = 0; i<this.state.ClassLevelPreferenceList.length; i++){
      if(this.state.ClassLevelPreferenceList[i].isSelected){
        ClassLevelName = this.state.ClassLevelPreferenceList[i].ClassLevelName
      }
    }
    for(let i = 0; i<this.state.selInsType.length; i++){
      if(this.state.selInsType[i].isSelected){
        InsTypeName = this.state.selInsType[i].InsName
      }
    }
    if(this.state.CityPlug.isShow){
      cityPlugDom = <CityJS cityMsg={this} />
    }
    // 询价单更多选择展示
    if(this.state.showMoreUserSetUpConfig.show){
      moreUserSetUpDom = <MoreUserSetUpJS moreMsg={this}/>
    }
    return (
      <div className="DFlightPage">
        <div className="DFlightTitle">
          <Link to="/" className="backRouter">
            <Icon type="left" />
          </Link>
          国内机票
        </div>
        <div className="FlightBanner"><img src={ FlightBanner } alt="" /></div>
        <div className="FlightSearch">
          <Flex 
            className="FS_tab"
            justify="between"
          >
            <div onClick={this.changeTabSliderFn.bind(this, "OW")} className={this.state.activeType === "OW"?"FS_tab_slider active":"FS_tab_slider"}><span>单程</span><i className="rightBorder"></i></div>
            <div onClick={this.changeTabSliderFn.bind(this, "RT")} className={this.state.activeType === "RT"?"FS_tab_slider active":"FS_tab_slider"}><span>往返</span><i className="rightBorder"></i></div>
            <div onClick={this.changeTabSliderFn.bind(this, "XJ")} className={this.state.activeType === "XJ"?"FS_tab_slider active":"FS_tab_slider"}><span>询价</span><i className="rightBorder"></i></div>
          </Flex>
          <ul className="FS_content FS_content_FL" style={!showStyle?{"display": "none"}:{}}>
            {TravelModelDom}
            <li>
              <Flex 
                className="FS_cityLi"
                justify="between"
              >
                <InputItem
                  className="startCity"
                  name="startCity"
                  defaultValue={this.state.startCityObj.cityName}
                  value={this.state.startCityObj.cityName}
                  placeholder="出发城市"
                  onClick={this.selectCityFn.bind(this, "startCity")}
                  editable = {false}
                />
                <div className="exchangeCity" onClick={this.exchangeCityFn.bind(this)}>
                  <img src={ExchangeImg} alt="" />
                </div>
                <InputItem
                  className="endCity"
                  name="endCity"
                  defaultValue={this.state.endCityObj.cityName}
                  value={this.state.endCityObj.cityName}
                  onClick={this.selectCityFn.bind(this, "endCity")}
                  editable = {false}
                  placeholder="到达城市"
                />
              </Flex>
            </li>
            <li>
              <InputItem
                className="searchMsg startDate"
                placeholder="请选择出发日期"
                defaultValue={this.state.startDate}
                value = {this.state.startDate}
                editable = {false}
                onClick = {this.selectCalendarFn.bind(this,"startDate")}
              ><div>出发日期</div></InputItem>
            </li>
            {FlightTimeDom.startFlightTime}
            {FlightDateDom}
            {FlightTimeDom.endFlightTime}
            <li>
              <InputItem
                className="searchMsg shippingSpace"
                editable = {false}
                defaultValue={ClassLevelName === ""?"请选择舱位":ClassLevelName}
                value={ClassLevelName}
                levelcode="All"
                onClick={this.selectLevelMsgFn.bind(this)}
              ><div>舱位</div></InputItem>
            </li>
            <li>
              <InputItem
                className="searchMsg FeeType"
                editable = {false}
                defaultValue={InsTypeName === ""?"请选择费用类型":InsTypeName}
                value={InsTypeName}
                onClick={this.selInsTypeFn.bind(this)}
              ><div>费用</div></InputItem>
            </li>
          </ul>
          <div className="FS_content_box" style={showStyle?{"display": "none"}:{}}>
            <ul className="FS_content FS_content_XJ">
              {TravelModelDom}
              {
                this.state.XJCityFlightData.map((item,idx)=>{
                  return <SwipeAction key={idx}
                    right={[
                      {
                        text: '删除',
                        onPress: () => console.log('cancel'),
                        style: { backgroundColor: '#ddd', color: '#FF694B' },
                      }
                    ]}
                  >
                    <li key={idx}>
                      <Flex className="FS_cityLi" justify="between">
                        <InputItem
                          className="startCity"
                          name="startCity"
                          defaultValue={item.XJStartCity.cityName}
                          value={item.XJStartCity.cityName}
                          placeholder="出发地"
                          onClick={this.selectCityFn.bind(this, "startCity", idx)}
                          editable = {false}
                        />
                        <div className="exchangeCity" onClick={this.exchangeCityFn.bind(this)}>
                          <img src={ExchangeImg} alt="" />
                        </div>
                        <InputItem
                          className="endCity"
                          name="endCity"
                          defaultValue={item.XJEndCity.cityName}
                          value={item.XJEndCity.cityName}
                          onClick={this.selectCityFn.bind(this, "endCity", idx)}
                          editable = {false}
                          placeholder="目的地"
                        />
                      </Flex>
                      <Flex className="FS_cityLi" justify="between">
                        <InputItem
                          className="moreUserSetUp"
                          name="moreUserSetUp"
                          defaultValue={item.XJStartDate}
                          value={item.XJStartDate}
                          placeholder="出发时间"
                          onClick={this.selectCalendarFn.bind(this, "startCityXJ", idx)}
                          editable = {false}
                        />
                        <div className="setUpBtn" onClick={this.moreUserSetUpFn.bind(this, idx)}>更多偏好</div>
                      </Flex>
                      <div className="deletLeg">
                        <img src={deletIcon} alt="" onClick={this.delLegFn.bind(this, idx)}/>
                      </div>
                    </li>
                  </SwipeAction>
                })
              }
            </ul>
            <div className="FS_addEmptLeg">
              <img src={addIcon} alt="" onClick={this.addEmptyLegFn.bind(this)} />
              <span onClick={this.addEmptyLegFn.bind(this)} >再加一程</span>
            </div>
            <ul className="FS_content FS_content_fee">
              <li>
                <InputItem
                  className="searchMsg FeeType"
                  editable = {false}
                  defaultValue={this.state.orderType  === "D"?"国内":"国际"}
                  value={this.state.orderType  === "D"?"国内":"国际"}
                ><div>订单类型</div></InputItem>
              </li>
              <li>
                <InputItem
                  className="searchMsg FeeType"
                  editable = {false}
                  defaultValue={InsTypeName === ""?"请选择费用类型":InsTypeName}
                  value={InsTypeName}
                  onClick={this.selInsTypeFn.bind(this)}
                ><div>费用</div></InputItem>
              </li>
            </ul>
          </div>
          <Button 
            className="searchBtn"
            onClick={this.searchFlightMsgFn.bind(this)}
          >开始搜索</Button>
          <div className="NearestLine">
            <div className="NL_title">
              <span className="NL_text">最近常用路线</span>
              <div className="NL_Line"></div>
            </div>
          </div>
          <WingBlank className="homeTips">
            <img className="imgTru" src={imgTru} alt="" />
            <img className="imgBook" src={imgBook} alt="" />
            <span>全球隐私政策和公告</span>
          </WingBlank>
        </div>
        <div className="flightTabBar">
          <FlightTabBar/>
        </div>
        <CalendarJS 
          parent = { this }
          calendarConfig={this.state.calendarConfig}
        />
        {cityPlugDom}
        {moreUserSetUpDom}
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

export default connect(mapStateToProps)(DFlight)