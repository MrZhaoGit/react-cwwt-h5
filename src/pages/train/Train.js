import React from 'react'
import { connect } from 'react-redux'
import { WingBlank, Flex, InputItem, Button, ActionSheet } from 'antd-mobile'
import $ from 'jquery'
import HeaderJS from '../../commonJS/C-HeaderJS/C-HeaderJS'

import trainBanner from '../../assets/train_icon/train-banner.png'
import ExchangeImg from '../../assets/flight_icon/ic_airC01@2x.png'
import imgBook from '../../assets/home_icon/userAgreement.png'
import imgTru from '../../assets/home_icon/gonggao.png'

import './TrainCss/Train.scss'

class Train extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      TravelModel: false,
      startCityObj: { cityCode: "PEK", cityName: "北京" },
      endCityObj: { cityCode: "SHA", cityName: "上海" },
      startDate: "",
      TrainType:[
        {
          TrainTypeName: "不限车型",
          TrainTypeCode: "ALL",
          isSelected: true
        }
      ],
      TrainSeat:[
        {
          TrainSeatName: "不限",
          TrainSeatCode: "ALL",
          isSelected: true
        }
      ],
      TrainInsType:[
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
    }
  }
  LeftClickFn(e){
    this.props.history.push({pathname:'/'})
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
  render(){
    let TravelModelDom = ""
    let TrainTypeName = ""
    let TrainSeatName = ""
    let TrainInsTypeName = ""
    if(this.state.TravelModel){
      TravelModelDom = <li>
        <InputItem
          className="TrainSearchMsg"
          editable = {false}
          defaultValue={this.state.TravelOrderNo}
          value={this.state.TravelOrderNo}
          placeholder="请选择出差申请单"
        ><div>出差申请单</div></InputItem>
      </li>
    }
    for(let i = 0; i<this.state.TrainType.length; i ++){
      if(this.state.TrainType[i].isSelected){
        TrainTypeName = this.state.TrainType[i].TrainTypeName
      }
    }
    for(let i = 0; i<this.state.TrainSeat.length; i ++){
      if(this.state.TrainSeat[i].isSelected){
        TrainSeatName = this.state.TrainSeat[i].TrainSeatName
      }
    }
    for(let i = 0; i<this.state.TrainInsType.length; i ++){
      if(this.state.TrainInsType[i].isSelected){
        TrainInsTypeName = this.state.TrainInsType[i].InsName
      }
    }
    return(
      <div className="TrainSearchDom">
        <HeaderJS 
          CHeaderConfig={{
            title: "火车票",
            style: {
              backgroundColor: "transparent"
            },
            LeftClickFn: this.LeftClickFn.bind(this)
          }}
        />
        <div className="Train_Banner">
          <img src={trainBanner} alt="" />
        </div>
        <div className="Train_Content">
          <ul className="Train_Content_List">
            {TravelModelDom}
            <li>
              <Flex 
                className="TCL_cityLi"
                justify="between"
              >
                <InputItem
                  className="startCity"
                  name="startCity"
                  defaultValue={this.state.startCityObj.cityName}
                  value={this.state.startCityObj.cityName}
                  placeholder="出发城市"
                  //onClick={this.selectCityFn.bind(this, "startCity")}
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
                  //onClick={this.selectCityFn.bind(this, "endCity")}
                  editable = {false}
                  placeholder="到达城市"
                />
              </Flex>
            </li>
            <li>
              <InputItem
                className="TCL_searchMsg startDate"
                placeholder="请选择出发日期"
                defaultValue={this.state.startDate}
                value = {this.state.startDate}
                editable = {false}
                //onClick = {this.selectCalendarFn.bind(this,"startDate")}
              ><div>出发日期</div></InputItem>
            </li>
            <li>
              <InputItem
                className="TCL_searchMsg TrainType"
                placeholder="请选择车次类型"
                defaultValue={TrainTypeName}
                value = {TrainTypeName}
                editable = {false}
                //onClick = {this.selectCalendarFn.bind(this,"startDate")}
              ><div>车次类型</div></InputItem>
            </li>
            <li>
              <InputItem
                className="TCL_searchMsg TrainSeat"
                placeholder="请选择坐席"
                defaultValue={TrainSeatName}
                value = {TrainSeatName}
                editable = {false}
                //onClick = {this.selectCalendarFn.bind(this,"startDate")}
              ><div>坐席</div></InputItem>
            </li>
            <li>
              <InputItem
                className="TCL_searchMsg TrainInsType"
                placeholder="请选择费用类型"
                defaultValue={TrainInsTypeName}
                value = {TrainInsTypeName}
                editable = {false}
                //onClick = {this.selectCalendarFn.bind(this,"startDate")}
              ><div>费用</div></InputItem>
            </li>
          </ul>
          <Button 
            className="searchBtn"
            type="primary"
          >查询</Button>
          <WingBlank className="homeTips">
            <img className="imgTru" src={imgTru} alt="" />
            <img className="imgBook" src={imgBook} alt="" />
            <span>全球隐私政策和公告</span>
          </WingBlank>
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

export default connect(mapStateToProps)(Train)