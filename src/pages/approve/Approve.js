import React from 'react'
import ReactDOM from 'react-dom'
import { Tabs, Badge, Toast, PullToRefresh, ListView, Card } from 'antd-mobile'
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

import './ApprovCSS/WaitForApprove.scss'

class Approve extends React.Component {
  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({  //这个dataSource有cloneWithRows方法
      rowHasChanged: (row1, row2) => row1 !== row2,
    }); 
    this.pageNo = 0
    this.state = {
      type: 0,
      tabsTitleData: [
        { title: <Badge text={0}>待提交</Badge> },
        { title: <Badge text={0}>待审批</Badge> },
        { title: <Badge text={0}>已审批</Badge> },
      ],
      selIcon:{
        "HC": {img:TrainIcon, text:"火车订单"},
        "QC": {img:CarIcon, text:"汽车订单"},
        "JP": {img:FlightIcon, text:"机票订单"},
        "JD": {img:HotelIcon, text:"酒店订单"},
        "ZC": {img:CarIcon, text:"租车订单"},
        "QZ": {img:VisaIcon, text:"签证订单"},
        "GB": {img:VipIcon, text:"贵宾厅订单"}
      },
      dataSource,
      refreshing: true,
      isLoading: true,
      height: document.documentElement.clientHeight,
      useBodyScroll: false,
      hasMore: true
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
    let ToastText = this.state.type === 0 ? "正在获取待提交订单..." : (this.state.type === 1 ? "正在获取待审批订单..." : "正在获取已审批订单...")
    Toast.loading(ToastText, 0)
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
    this.rData = []
    await this.getApproveDataFn()
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rData),
      height: hei,
      refreshing: false,
      isLoading: false,
    });
  }
  async getApproveDataFn(){
    const that = this
    that.pageNo++ 
    const LoginSessionKey = that.props.UserKeyData
    if(that.pageNo > 1){
      Toast.loading("正在获取更多数据...", 0)
    }
    await that.$axios({
      method: 'post',
      url: '/Interface/ApprovalHandler.ashx',
      data: qs.stringify({ 
        MethodType: 'M_GetOrderApprovalByBPMList', 
        LoginSessionKey: LoginSessionKey,
        Type: that.state.type,
        PagerNum: 6,
        PagerIndex: that.pageNo
      })
    }).then((res)=>{
      if (res.IsLogin === 1) {
        const data = JSON.parse(res.ApiData)
        let OrderList = []
        Toast.hide()
        if(data.M_ErrorInfo_1_0){
          that.setState({ hasMore: false })
          return false
        }
        if(that.state.type === 0){
          OrderList = that.CombiningNewDataFn(data)
        }else {
          OrderList = data.OrderList
        }
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
  onRefresh = async(e) => {
    this.pageNo = 0
    this.rData = []
    await this.getApproveDataFn()
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
    await this.getApproveDataFn()
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rData),
      isLoading: false,
    })
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
  setZeroCardBodyDom(rowData){
    let ZeroCardBodyDom = ""
    ZeroCardBodyDom = <ul>
      <li>提交时间：{rowData.Createtime}</li>
      <li>提交人员：{rowData.CreateByName}</li>
      <li>申请金额：{rowData.SettlePrice}</li>
      <li>审批时间：{rowData.Checktime}</li>
      <li>审批备注：{rowData.ApprovalFileName}</li>
    </ul>
    return ZeroCardBodyDom
  }
  async onTabClickFn(e,j){
    this.pageNo = 0
    const dataSource = new ListView.DataSource({  //这个dataSource有cloneWithRows方法
      rowHasChanged: (row1, row2) => row1 !== row2,
    }); 
    await this.setState({type: j,dataSource,height: document.documentElement.clientHeight,})
    this.componentDidMount()
  }
  LeftClickFn(){
    const SourcePageID = this.props.location.state.SourcePageID
    if(SourcePageID === 0){
      this.props.history.push({pathname:'/'})
    }else{
      this.props.history.push({pathname:'/User/Center'})
    }
  }
  render(){
    const row = (rowData, sectionID, rowID) => {
      const selIcon = this.state.selIcon[rowData.LargeOrderType]
      const CardBodyDom = this.state.type === 0 ? this.setCardBodyDom(rowData) : this.setZeroCardBodyDom(rowData)
      let CardFooterDom = "", title = "", extra = ""
      if(this.state.type === 0){
        title = <span>{selIcon.text} | <span style={{fontSize: "28px", color: "#ADB2B9"}}>待提交</span></span>
        extra = <span style={{color: "#FF694B"}}>{rowData.PaymentPrice}</span>
        CardFooterDom = <Card.Footer extra={<div className="toApprovalPage">去提交</div>} />
      } else {
        title = <span style={{color: "#FF694B"}}>审批单号：</span>
        extra = <span>{rowData.ApprovalNo}</span>
        if(this.state.type === 1){
          CardFooterDom = <Card.Footer extra={<div className="toApprovalPage">去审批</div>} />
        }
      }
      return (
        <Card className="WFA_Content_Card">
          <Card.Header
            title= {title}
            thumb={selIcon.img}
            extra={extra}
          />
          <Card.Body>{CardBodyDom}</Card.Body>
          {CardFooterDom}
        </Card>
      );
    }
    return(
      <div className="ApproveDom">
        <HeaderJS 
          CHeaderConfig={{
            title: "审批订单",
            LeftClickFn: this.LeftClickFn.bind(this)
          }}
        />
        <div className="ApproveTabs">
          <Tabs
            tabs={this.state.tabsTitleData}
            initialPage={this.state.type}
            onChange={this.onTabClickFn.bind(this)}
          >
            <div className="AT_Content AT_Content_fir">
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
            <div className="AT_Content AT_Content_Src">
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
            <div className="AT_Content AT_Content_Thi">
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
          </Tabs>
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

export default connect(mapStateToProps)(Approve)