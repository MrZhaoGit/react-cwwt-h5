import React from 'react'
import { connect } from 'react-redux'
import { WingBlank, Flex, InputItem, Button, ActionSheet } from 'antd-mobile'
import HeaderJS from '../../commonJS/C-HeaderJS/C-HeaderJS'

import carBanner from '../../assets/car_rental_icon/taix-banner.png'
import imgBook from '../../assets/home_icon/userAgreement.png'
import imgTru from '../../assets/home_icon/gonggao.png'
import positioningIcon from '../../assets/hotel_icon/user_positioning_icon.png'
import noPositioningIcon from '../../assets/hotel_icon/nouser_positioning_icon.png'
import addPaIcon from '../../assets/car_rental_icon/add-ico.png'

import './CarCss/Car.scss'

class Car extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      activeType: 0,
      TravelModel: false,
      CarCity: {"CarCityName": "", "CarCityCode": ""},
      CarDesCity: {"CarDesCityName": "", "CarDesCityCode": ""},
      CarPassengers: {},
      SearchKeyVal: "",
      CarCostCenter: "",
      CarFlightOrTrain: "",
      CarStartDate: "",
      CarContacts: "张三",
      CarServiceFee: "1000.00 ¥",
      CarContactNumber: "15810254188"
    }
  }
  LeftClickFn(){
    this.props.history.push({pathname:'/'})
  }
  changeTabSliderFn(e){
    this.setState({activeType: e})
  }
  getCurrentCityFn(){

  }
  selectCityFn(){

  }
  CarSearchKeyFn(){

  }
  render(){
    let TravelModelDom = ""
    if(this.state.TravelModel){
      TravelModelDom = <li>
      <InputItem
        className="CarSearchOrder"
        editable = {false}
        defaultValue={this.state.TravelOrderNo}
        value={this.state.TravelOrderNo}
        placeholder="请选择出差申请单"
      ><div>出差申请单</div></InputItem>
    </li>
    }
    return (
      <div className="CarDom">
        <HeaderJS 
          CHeaderConfig={{
            title: "租车",
            style: {
              backgroundColor: "transparent"
            },
            LeftClickFn: this.LeftClickFn.bind(this)
          }}
        />
        <div className="Car_Banner">
          <img src={carBanner} alt="" />
        </div>
        <div className="Car_Content">
          <Flex 
            className="CC_tab"
            justify="between"
          >
            <div onClick={this.changeTabSliderFn.bind(this, 0)} className={this.state.activeType === 0?"CC_tab_slider active":"CC_tab_slider"}><span>自选</span><i className="rightBorder"></i></div>
            <div onClick={this.changeTabSliderFn.bind(this, 1)} className={this.state.activeType === 1?"CC_tab_slider active":"CC_tab_slider"}><span>接机</span><i className="rightBorder"></i></div>
            <div onClick={this.changeTabSliderFn.bind(this, 2)} className={this.state.activeType === 2?"CC_tab_slider active":"CC_tab_slider"}><span>送机</span><i className="rightBorder"></i></div>
          </Flex>
          <ul className="CC_SearchMsg">
            {TravelModelDom}
            <li>
              <Flex
                justify="between"
              >
                <InputItem
                  className="CarCity"
                  name="CarCity"
                  defaultValue={this.state.CarCity.CarCityName}
                  value={this.state.CarCity.CarCityName}
                  placeholder="请选择用车地点"
                  onClick={this.selectCityFn.bind(this, "CarCity")}
                  editable = {false}
                />
                <div 
                  className={ this.state.CarCity.CarCityName === "" ? "currentCity" : "currentCity hasCurrentCity"}
                  onClick={this.getCurrentCityFn.bind(this)}
                >
                  <img src={this.state.CarCity.CarCityName === ""? noPositioningIcon: positioningIcon} alt="" />
                  我的位置
                </div>
              </Flex>
            </li>
            <li>
              <InputItem
                className="CarDestination"
                name="CarDestination"
                editable = {false}
                defaultValue={this.state.CarDesCity.CarDesCityName}
                value={this.state.CarDesCity.CarDesCityName}
                placeholder="请选择目的地"
              ><div>目的地</div></InputItem>
            </li>
            <li>
              <Flex justify="between">
                <InputItem
                  className="CarPassengers"
                  name="CarPassengers"
                  editable = {false}
                  defaultValue={this.state.CarPassengers.userName}
                  value={this.state.CarPassengers.userName}
                  placeholder="请选择乘车人"
                ><div>乘车人</div></InputItem>
                <img className="addPassengers" src={addPaIcon} alt="" />
              </Flex>
            </li>
            <li>
              <InputItem
                className="CarCostCenter"
                name="CarCostCenter"
                editable = {false}
                defaultValue={this.state.CarCostCenter}
                value={this.state.CarCostCenter}
                placeholder="请选择成本中心"
              ><div>成本中心</div></InputItem>
            </li>
            <li>
              <InputItem
                className="CarFlightOrTrain"
                name="CarFlightOrTrain"
                editable = {false}
                defaultValue={this.state.CarFlightOrTrain}
                value={this.state.CarFlightOrTrain}
                placeholder="请填写航班号/车次(必填)"
              ><div>航班号/车次</div></InputItem>
            </li>
            <li>
              <InputItem
                className="CarStartDate"
                name="CarStartDate"
                editable = {false}
                defaultValue={this.state.CarStartDate}
                value={this.state.CarStartDate}
                placeholder="请选择出发日期"
              ><div>出发日期</div></InputItem>
            </li>
            <li>
              <InputItem
                className="CarServiceFee"
                name="CarServiceFee"
                editable = {false}
                defaultValue={this.state.CarServiceFee}
                value={this.state.CarServiceFee}
              ><div>服务费</div></InputItem>
            </li>
            <li>
              <InputItem
                className="CarContacts"
                name="CarContacts"
                editable = {false}
                defaultValue={this.state.CarContacts}
                value={this.state.CarContacts}
              ><div>联系人</div></InputItem>
            </li>
            <li>
              <InputItem
                className="CarContactNumber"
                name="CarContactNumber"
                editable = {false}
                defaultValue={this.state.CarContactNumber}
                value={this.state.CarContactNumber}
              ><div>联系电话</div></InputItem>
            </li>
          </ul>
          <WingBlank>
            <Button 
              className="searchBtn"
              type="primary"
            >提交订单</Button>
            <div className="NearestLine">
              <div className="NL_title">
                <span className="NL_text">最近常用路线</span>
                <div className="NL_Line"></div>
              </div>
            </div>
          </WingBlank>
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

export default connect(mapStateToProps)(Car)