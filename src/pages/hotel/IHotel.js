import React from 'react'
import { connect } from 'react-redux'
import { WingBlank, Flex, InputItem, Button, ActionSheet } from 'antd-mobile'
import HeaderJS from '../../commonJS/C-HeaderJS/C-HeaderJS'

import hotelBanner from '../../assets/hotel_icon/hotel-banner.png'
import imgBook from '../../assets/home_icon/userAgreement.png'
import imgTru from '../../assets/home_icon/gonggao.png'
import hotelHistory from '../../assets/hotel_icon/hotelHistory_icon.png'

import "./HotelCSS/HotelSearch.scss"

class DHotel extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      TravelModel: false,
      hotelCity: {"cityName": "", "cityCode": ""},
      CheckInDate: "",
      CheckOutDate: "",
      SearchKeyVal: "",
      HotelRooms: "1间",
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
      InvoiceType:[
        {
          InvoiceTypeCode: "All",
          InvoiceTypeName: "不限",
          isSelected: true
        },{
          InvoiceTypeCode: "Elong",
          InvoiceTypeName: "服务商开发票",
          isSelected: false
        },{
          InvoiceTypeCode: "Hotel",
          InvoiceTypeName: "酒店开发票",
          isSelected: false
        }
      ]
    }
  }
  selectCityFn(e){

  }
  LeftClickFn(e){
    this.props.history.push({pathname:'/'})
  }
  // 获取当前定位
  getCurrentCityFn(){
    this.setState({
      hotelCity: {"cityName": "北京", "cityCode": "BJS"}
    })
  }
  // 选择入住/离店日期
  selectHotelDateFn(){

  }
  // 酒店关键词搜索
  HotelSearchKeyFn(){

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
      if(buttonIndex<buttonArr.length-1){
        that.setState({
          selInsType: getData.map((item, idx) => idx === buttonIndex ?{...item,isSelected: true}: {...item, isSelected: false})
        })
      }
    });
  }
  // 发票类型选择
  selInvoiceTypeFn(){
    const that = this
    const buttonArr = that.state.InvoiceType.map((item)=> item.InvoiceTypeName)
    buttonArr.push("取消")
    ActionSheet.showActionSheetWithOptions({
      options: buttonArr,
      cancelButtonIndex: buttonArr.length - 1,
      title: '请选择发票类型',
      maskClosable: true
    },
    (buttonIndex) => {
      const getData = [...that.state.InvoiceType]
      if(buttonIndex<buttonArr.length-1){
        that.setState({
          InvoiceType: getData.map((item, idx) => idx === buttonIndex ?{...item,isSelected: true}: {...item, isSelected: false})
        })
      }
    });
  }
  render(){
    let TravelModelDom = ""
    let InsTypeName = ""
    let InvoiceTypeName = ""
    if(this.state.TravelModel){
      TravelModelDom = <li>
        <InputItem
          className="hotelSearchMsg hotel"
          editable = {false}
          defaultValue={this.state.TravelOrderNo}
          value={this.state.TravelOrderNo}
          placeholder="请选择出差申请单"
        ><div>出差申请单</div></InputItem>
      </li>
    }
    for(let i = 0; i<this.state.selInsType.length; i++){
      if(this.state.selInsType[i].isSelected){
        InsTypeName = this.state.selInsType[i].InsName
      }
    }
    for(let i = 0; i<this.state.InvoiceType.length; i++){
      if(this.state.InvoiceType[i].isSelected){
        InvoiceTypeName = this.state.InvoiceType[i].InvoiceTypeName
      }
    }
    return (
      <div className="DHotelDom">
        <HeaderJS 
          CHeaderConfig={{
            title: "国际酒店",
            style: {
              backgroundColor: "transparent"
            },
            LeftClickFn: this.LeftClickFn.bind(this)
          }}
        />
        <div className="DHotel_Banner">
          <img src={hotelBanner} alt="" />
        </div>
        <ul className="DHotel_Content">
          {TravelModelDom}
          <li>
            <InputItem
              className="hotelSearchMsg hotelSelectCity"
              name="hotelRooms"
              editable = {false}
              defaultValue={this.state.hotelCity.cityName}
              value={this.state.hotelCity.cityName}
              placeholder="请选择城市"
            ><div>城市</div></InputItem>
          </li>
          <li>
            <Flex
                justify="between"
                className="CheckDateFlex"
            >
              <div className="CheckDateBox">
                <span>入住日期</span>
                <InputItem
                  className="CheckDate CheckInDate"
                  name="CheckInDate"
                  defaultValue={this.state.CheckInDate}
                  value={this.state.CheckInDate}
                  placeholder="请选择入住日期"
                  onClick={this.selectHotelDateFn.bind(this, "CheckInDate")}
                  editable = {false}
                />
              </div>
              <div className="CheckDateLine">
                <span>10晚</span>
              </div>
              <div className="CheckDateBox">
                <span>离店日期</span>
                <InputItem
                  className="CheckDate CheckOutDate"
                  name="CheckOutDate"
                  defaultValue={this.state.CheckOutDate}
                  value={this.state.CheckOutDate}
                  placeholder="请选择离店日期"
                  onClick={this.selectHotelDateFn.bind(this, "CheckOutDate")}
                  editable = {false}
                />
              </div>
            </Flex>
          </li>
          <li>
            <InputItem
              className="hotelSearchKey"
              name="hotelSearchKey"
              defaultValue={this.state.SearchKeyVal}
              value={this.state.SearchKeyVal}
              placeholder="关键词/位置/酒店名称"
              onClick={this.HotelSearchKeyFn.bind(this)}
              editable = {false}
            />
          </li>
          <li>
            <InputItem
              className="hotelSearchMsg hotelRooms"
              name="hotelRooms"
              editable = {false}
              defaultValue={this.state.HotelRooms}
              value={this.state.HotelRooms}
            ><div>房间数</div></InputItem>
          </li>
          <li>
            <InputItem
              className="hotelSearchMsg HotelFeeType"
              name="HotelFeeType"
              editable = {false}
              defaultValue={InsTypeName === ""?"请选择费用类型":InsTypeName}
              value={InsTypeName}
              onClick={this.selInsTypeFn.bind(this)}
            ><div>费用</div></InputItem>
          </li>
          <li>
            <InputItem
              className="hotelSearchMsg HotelInvoiceType"
              name="HotelInvoiceType"
              editable = {false}
              defaultValue={InvoiceTypeName === ""?"请选择费用类型":InvoiceTypeName}
              value={InvoiceTypeName}
              onClick={this.selInvoiceTypeFn.bind(this)}
            ><div>发票类型</div></InputItem>
          </li>
        </ul>
        <Button 
          className="searchBtn"
          type="primary"
        >查询</Button>
        <WingBlank>
          <div className="hotelSearchHistory">
            <p><img src={hotelHistory} alt=""/>我的酒店(收藏/浏览历史)</p>
          </div>
        </WingBlank>
        <WingBlank className="homeTips">
          <img className="imgTru" src={imgTru} alt="" />
          <img className="imgBook" src={imgBook} alt="" />
          <span>全球隐私政策和公告</span>
        </WingBlank>
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

export default connect(mapStateToProps)(DHotel)