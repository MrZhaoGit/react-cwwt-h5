import React from 'react'
import ReactDOM from 'react-dom'
import { Tabs, Badge, Toast, PullToRefresh, ListView, Card, Popover } from 'antd-mobile'
import HeaderJS from '../../commonJS/C-HeaderJS/C-HeaderJS'
import { connect } from 'react-redux'
import qs from 'qs'

import FlightIcon from '../../assets/common_icon/ic_flight1@2x.png'
import CarIcon from '../../assets/common_icon/ic_car1@2x.png'
import TrainIcon from '../../assets/common_icon/ic_train1@2x.png'
import VipIcon from '../../assets/common_icon/ic_vip1@2x.png'
import VisaIcon from '../../assets/common_icon/ic_visa1@2x.png'
import HotelIcon from '../../assets/common_icon/ic_hotel1@2x.png'

import CardIcon01 from '../../assets/common_icon/CardIcon01.png'
import CardIcon02 from '../../assets/common_icon/CardIcon02.png'
import CardIcon03 from '../../assets/common_icon/CardIcon03.png'
import CardIcon04 from '../../assets/common_icon/CardIcon04.png'
import CardIcon05 from '../../assets/common_icon/CardIcon05.png'
import CardIcon06 from '../../assets/common_icon/CardIcon06.png'
import CardIcon07 from '../../assets/common_icon/CardIcon07.png'
import CardIcon08 from '../../assets/common_icon/CardIcon08.png'

import './userConterCSS/OrderList.scss'

const PopoverItem = Popover.Item

class OrderList extends React.Component {
  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({  //这个dataSource有cloneWithRows方法
      rowHasChanged: (row1, row2) => row1 !== row2,
    }); 
    this.pageNo = 0
    this.state = {
      type: 0,
      selIcon:{
        "HC": {img:TrainIcon, text:"火车票"},
        "QC": {img:CarIcon, text:"汽车"},
        "JP": {img:FlightIcon, text:"机票"},
        "JD": {img:HotelIcon, text:"酒店"},
        "ZC": {img:CarIcon, text:"租车"},
        "QZ": {img:VisaIcon, text:"签证"},
        "GB": {img:VipIcon, text:"贵宾厅"}
      },
      dataSource,
      refreshing: true,
      isLoading: true,
      height: document.documentElement.clientHeight,
      useBodyScroll: false,
      hasMore: true,
      RequestParams: {
        OrderType: "A",
        PublicOrPriveate: "0",
        IsDomc: "A",
        PsgName: "",
        OrderStatus: "",
        StartDate: "",
        EndDate: "",
        PagerNum: 6,
        PagerIndex: 1
      }
    }
  }
  componentDidUpdate() {
    if (this.state.useBodyScroll) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }
  async componentDidMount() {
    let ToastText = this.state.type === 0 ? "正在获取产品订单..." : "正在获取大订单..."
    Toast.loading(ToastText, 0)
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
    this.rData = []
    await this.getFlightOrderDataFn()
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rData),
      height: hei,
      refreshing: false,
      isLoading: false,
    });
  }
  async getFlightOrderDataFn(){
    const that = this
    const RequestParams = this.state.RequestParams
    that.pageNo++ 
    RequestParams.PagerIndex = that.pageNo
    const LoginSessionKey = that.props.UserKeyData
    if(that.pageNo > 1){
      Toast.loading("正在获取更多数据...", 0)
    }
    await that.$axios({
      method: 'post',
      url: '/Interface/OrderOperateHandler.ashx',
      data: qs.stringify({ 
        MethodType: 'M_GetOrderList_1_1', 
        LoginSessionKey: LoginSessionKey,
        RequestParams: JSON.stringify(RequestParams)
      })
    }).then((res)=>{
      console.log(res)
      if (res.IsLogin === 1) {
        const data = JSON.parse(res.ApiData)
        let OrderList = []
        Toast.hide()
        if(data.M_ErrorInfo_1_0){
          that.setState({ hasMore: false })
          return false
        }
        OrderList = that.CombiningNewDataFn(data)
        console.log(OrderList)
        if(OrderList !== null && OrderList.length > 0){
          that.rData = [...that.rData, ...OrderList]
        }else{
          that.setState({
            hasMore: false
          })
        }
      }
    })
  }
  CombiningNewDataFn(data){
    const newListData = [...data.OrderInfos, ...data.TOrderInfos, ...data.HOrderInfos, ...data.QOrderInfos, ...data.ZOrderInfos, ...data.VOrderInfos]
    const newListKeyData = data.OrderList
    const NewData = []
    for(let i = 0; i < newListKeyData.length; i ++){
      let NewDataObj = {}
      for(let j = 0; j < newListData.length; j ++){
        if(newListKeyData[i].OrderNO === newListData[j].OrderNo || newListKeyData[i].OrderNO === newListData[j].OrderNO){
          NewDataObj = newListData[j]
          if(newListKeyData[i].Type === "F"){
            NewDataObj.LargeOrderType = "JP"
          }else if(newListKeyData[i].Type === "H"){
            NewDataObj.LargeOrderType = "JD"
          }else if(newListKeyData[i].Type === "Q"){
            NewDataObj.LargeOrderType = "QZ"
          }else if(newListKeyData[i].Type === "Z"){
            NewDataObj.LargeOrderType = "ZC"
          }else if(newListKeyData[i].Type === "V"){
            NewDataObj.LargeOrderType = "GB"
          }else if(newListKeyData[i].Type === "T"){
            NewDataObj.LargeOrderType = "HC"
          }
          
        }
      }
      NewData.push(NewDataObj)
    }
    return NewData
  }
  setCardBodyDom(rowData){
    let CardBodyDom = ""
    if(rowData.LargeOrderType === "JP"){
      CardBodyDom = rowData.FlightInfo.map((itm, idx) =>(
        <ul key={idx}>
          <li><img src={CardIcon05} alt=""/>航程：{rowData.RelatedNo === ""? "单程" : "往返"}</li>
          <li><img src={CardIcon01} alt=""/>地点：{itm.BoardPointName} - {itm.OffPointName}</li>
          <li><img src={CardIcon02} alt=""/>机场：{itm.BoardPointAirPortName + itm.BoardPointAT} - {itm.OffPointAirPortName + itm.OffPointName}</li>
          <li><img src={CardIcon03} alt=""/>时间：{itm.DepartureDate +" "+ itm.DepartureTime}</li>
          <li><img src={CardIcon04} alt=""/>航班：{itm.FlightNO}</li>
        </ul>
      ))
    }else if(rowData.LargeOrderType === "JD"){
      CardBodyDom = <ul>
        <li><img src={CardIcon06} alt=""/>酒店名称：{rowData.HotelName}</li>
        <li><img src={CardIcon01} alt=""/>酒店地址：{rowData.HotelAddress}</li>
        <li><img src={CardIcon03} alt=""/>住宿时间：{rowData.ArrivalDate + "至" + rowData.DepartureDate}</li>
        <li><img src={CardIcon08} alt=""/>大订单号：{rowData.HotelName}</li>
      </ul>
    }else if(rowData.LargeOrderType === "HC"){
      CardBodyDom = <ul>
        <li><img src={CardIcon01} alt=""/>地点：{rowData.FromStation + "-" + rowData.ToStation}</li>
        <li><img src={CardIcon07} alt=""/>车型：{rowData.TrainCode + rowData.TrainCodeName}</li>
        <li><img src={CardIcon03} alt=""/>时间：{rowData.TrainDate + " " + rowData.FromTime}</li>
      </ul>
    }else if(rowData.LargeOrderType === "QZ"){
      CardBodyDom = "签证明细待处理"
    }else if(rowData.LargeOrderType === "ZC"){
      CardBodyDom = <ul>
        <li><img src={CardIcon01} alt=""/>租车出发地：{rowData.RtStartAddress}</li>
        <li><img src={CardIcon01} alt=""/>租车目的地：{rowData.RtEndAddress}</li>
        <li><img src={CardIcon03} alt=""/>时间：{rowData.RtDepartureTime}</li>
      </ul>
    }else if(rowData.LargeOrderType === "GB"){
      CardBodyDom = "贵宾厅明细待处理"
    }

    return CardBodyDom
  }
  onRefresh = async(e) => {
    this.pageNo = 0
    this.rData = []
    await this.getFlightOrderDataFn()
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rData),
      isLoading: false,
    });
  }
  onEndReached = async (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }   //如果this.state.hasMore为false，说明没数据了，直接返回
    this.setState({ isLoading: true });
    await this.getFlightOrderDataFn()
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rData),
      isLoading: false,
    })
  }
  LeftClickFn(){
    this.props.history.push({pathname:'/User/Center'})
  }
  RightClickFn(e){
    
  }
  render () {
    let RightSelectDom = [
      (<PopoverItem key="0" className="PopoverItem PopoverItem_out" value="1">产品订单</PopoverItem>),
      (<PopoverItem key="1" className="PopoverItem PopoverItem_out" value="2">大订单</PopoverItem>),
    ]
    const row = (rowData, sectionID, rowID) => {
      const selIcon = this.state.selIcon[rowData.LargeOrderType]
      const CardBodyDom = this.state.type === 0 ? this.setCardBodyDom(rowData) : this.setZeroCardBodyDom(rowData)
      let CardFooterDom = ""
      if(rowData.InPersonInfo.length > 0){
        for(let i =0; i < rowData.InPersonInfo.length; i ++){
          CardFooterDom = rowData.InPersonInfo[i].PersonName + rowData.InPersonInfo[i].CostCenter
        }
      }
      return (
        <Card className="FOL_Content_Card">
          <Card.Header
            title= {<p><span>{selIcon.text}&nbsp;|&nbsp;</span><span style={{fontSize: "28px",color: "#ADB2B9"}}>{rowData.OrderStatusName}</span></p>}
            thumb={selIcon.img}
            extra={<span style={{color: "#FF694B"}}>{rowData.PaymentPrice}</span>}
          />
          <Card.Body>{CardBodyDom}</Card.Body>
          <Card.Footer content={CardFooterDom} />
        </Card>
      );
    }
    return (
      <div className="FlightOrderDom">
        <HeaderJS
          CHeaderConfig={{
            title: "我的订单",
            ClassName: "FlightOrder",
            userRightContent: true,
            LeftClickFn: this.LeftClickFn.bind(this),
            RightClickFn: this.RightClickFn.bind(this),
            RightSelectDom: RightSelectDom
          }}
        />
        <div className="FO_List">
          <ListView
            key={this.state.useBodyScroll ? '0' : '1'}
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            renderFooter={    //renderFooter就是下拉时候的loading效果，这里的内容可以自己随需求更改
              () => (
                <div style={{ textAlign: 'center' }}>
                  {this.state.isLoading ? '数据加载中...' : (this.state.hasMore?"":"已加载全部数据")}
                </div>
              )
            }
            renderRow={row}   //渲染你上边写好的那个row
            useBodyScroll={this.state.useBodyScroll}
            style={this.state.useBodyScroll ? {} : {
              height: this.state.height
            }}
            pullToRefresh={<PullToRefresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />}
            onEndReached={this.onEndReached}
            pageSize={6}    //每次下拉之后显示的数据条数
          />
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

export default connect(mapStateToProps)(OrderList)