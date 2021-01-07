import React from 'react'
import { Flex, InputItem, ActionSheet, Button, WingBlank } from 'antd-mobile'
import { connect } from 'react-redux'
import HeaderJS from '../../commonJS/C-HeaderJS/C-HeaderJS'

import VipBanner from '../../assets/vip_icon/vip-banner.png'
import imgBook from '../../assets/home_icon/userAgreement.png'
import imgTru from '../../assets/home_icon/gonggao.png'
import positioningIcon from '../../assets/hotel_icon/user_positioning_icon.png'
import noPositioningIcon from '../../assets/hotel_icon/nouser_positioning_icon.png'

import './VipCSS/Vip.scss'

class Vip extends React.Component {
  constructor(props){
    super(props)
    this.state={
      VipCity: {"cityName": "", "cityCode": ""},
      HallType: [
        {
          HallTypeCode: 1,
          HallTypeName: "机场",
          isSelected: true
        },{
          HallTypeCode: 2,
          HallTypeName: "高铁",
          isSelected: false
        }
      ],
      VipHallMsg: { "VipHallCode": "", "VipHallName": "" },
      selVipInsType:[
        {
          InsCode: "1",
          InsName: "因公",
          isSelected: true
        },{
          InsCode: "2",
          InsName: "因私",
          isSelected: false
        }
      ]
    }
  }
  LeftClickFn(){
    this.props.history.push({pathname:'/'})
  }
  getVipCurrentCityFn(){

  }
  selectVipCityFn(){

  }
  selVipHallTypeFn(){
    const that = this
    const buttonArr = that.state.HallType.map((item)=> item.HallTypeName)
    buttonArr.push("取消")
    ActionSheet.showActionSheetWithOptions({
      options: buttonArr,
      cancelButtonIndex: buttonArr.length - 1,
      title: '请选择',
      maskClosable: true
    },
    (buttonIndex) => {
      const getData = [...that.state.HallType]
      if(buttonIndex<buttonArr.length-1){
        that.setState({
          HallType: getData.map((item, idx) => idx === buttonIndex ?{...item,isSelected: true}: {...item, isSelected: false})
        })
      }
    });
  }
  // 费用类型选择
  selVipInsTypeFn(){
    const that = this
    const buttonArr = that.state.selVipInsType.map((item)=> item.InsName)
    buttonArr.push("取消")
    ActionSheet.showActionSheetWithOptions({
      options: buttonArr,
      cancelButtonIndex: buttonArr.length - 1,
      title: '请选择费用类型',
      maskClosable: true
    },
    (buttonIndex) => {
      const getData = [...that.state.selVipInsType]
      if(buttonIndex<buttonArr.length-1){
        that.setState({
          selVipInsType: getData.map((item, idx) => idx === buttonIndex ?{...item,isSelected: true}: {...item, isSelected: false})
        })
      }
    });
  }
  render(){
    let HallTypeName = ""
    let VipHallType = ""
    let VipInsTypeName = ""
    for(let i = 0; i < this.state.HallType.length; i ++){
      if(this.state.HallType[i].isSelected){
        HallTypeName = this.state.HallType[i].HallTypeName
        if(this.state.HallType[i].HallTypeCode === 1){
          VipHallType = "请选择机场"
        }else{
          VipHallType = "请选择车站"
        }
      }
    }
    for(let i = 0; i < this.state.selVipInsType.length; i ++){
      if(this.state.selVipInsType[i].isSelected){
        VipInsTypeName = this.state.selVipInsType[i].InsName
      }
    }
    return (
      <div className="VipDom">
        <HeaderJS 
          CHeaderConfig={{
            title: "贵宾厅",
            style: {
              backgroundColor: "transparent"
            },
            LeftClickFn: this.LeftClickFn.bind(this)
          }}
        />
        <div className="Vip_Banner">
          <img src={VipBanner} alt=""/>
        </div>
        <div className="Vip_Content">
          <ul className="VIPC_Search">
            <li>
              <Flex
                justify="between"
              >
                <InputItem
                  className="VipCity"
                  name="VipCity"
                  defaultValue={this.state.VipCity.cityName}
                  value={this.state.VipCity.cityName}
                  placeholder="请选择城市"
                  onClick={this.selectVipCityFn.bind(this, "VipCity")}
                  editable = {false}
                />
                <div 
                  className={ this.state.VipCity.cityName === "" ? "currentCity" : "currentCity hasCurrentCity"}
                  onClick={this.getVipCurrentCityFn.bind(this)}
                >
                  <img src={this.state.VipCity.cityName === ""? noPositioningIcon: positioningIcon} alt="" />
                  我的位置
                </div>
              </Flex>
            </li>
            <li>
              <InputItem
                className="VipSearchMsg VipHallType"
                name="VipHallType"
                editable = {false}
                defaultValue={HallTypeName === ""?"请选择贵宾厅类型":HallTypeName}
                value={HallTypeName}
                placeholder="请选择贵宾厅类型"
                onClick={this.selVipHallTypeFn.bind(this)}
              ><div>贵宾厅类型</div></InputItem>
            </li>
            <li>
              <InputItem
                className="VipSearchMsg VipAirportType"
                name="VipAirportType"
                editable = {false}
                defaultValue={this.state.VipHallMsg.VipHallName === ""?"":this.state.VipHallMsg.VipHallName}
                value={this.state.VipHallMsg.VipHallName}
                placeholder={"请选择" + HallTypeName + "位置"}
                onClick={this.selVipHallTypeFn.bind(this)}
              ><div>{VipHallType}</div></InputItem>
            </li>
            <li>
              <InputItem
                className="VipSearchMsg VipInsType"
                name="VipInsType"
                editable = {false}
                defaultValue={VipInsTypeName === ""?"":VipInsTypeName}
                value={VipInsTypeName}
                placeholder="请选择费用类型"
                onClick={this.selVipInsTypeFn.bind(this)}
              ><div>费用</div></InputItem>
            </li>
          </ul>
          <Button 
            className="searchBtn"
            type="primary"
          >开始搜索</Button>
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

export default connect(mapStateToProps)(Vip)