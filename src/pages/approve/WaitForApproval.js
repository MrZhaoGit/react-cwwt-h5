import React from 'react'
import ReactDOM from 'react-dom'
import { WhiteSpace, Toast, PullToRefresh, ListView, Card } from 'antd-mobile'
import HeaderJS from '../../commonJS/C-HeaderJS/C-HeaderJS'
import { connect } from 'react-redux'
import qs from 'qs'

import FlightIcon from '../../assets/common_icon/ic_flight1@2x.png'
import CarIcon from '../../assets/common_icon/ic_car1@2x.png'
import TrainIcon from '../../assets/common_icon/ic_train1@2x.png'
import VipIcon from '../../assets/common_icon/ic_vip1@2x.png'
import VisaIcon from '../../assets/common_icon/ic_visa1@2x.png'
import HotelIcon from '../../assets/common_icon/ic_hotel1@2x.png'

import './ApprovCSS/WaitForApprove.scss'

class WaitForApprove extends React.Component {
  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({  //这个dataSource有cloneWithRows方法
      rowHasChanged: (row1, row2) => row1 !== row2,
    }); 
    console.log(this)
    this.pageNo = 0
    this.state = {
      selIcon:{
        "HC":TrainIcon,
        "QC": CarIcon,
        "JP": FlightIcon,
        "JD": HotelIcon,
        "ZC": CarIcon,
        "QZ": VisaIcon,
        "GB": VipIcon
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
    Toast.loading("正在获取待审批订单...", 0)
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
      Toast.loading("正在更多数据...", 0)
    }
    await that.$axios({
      method: 'post',
      url: '/Interface/ApprovalHandler.ashx',
      data: qs.stringify({ 
        MethodType: 'M_GetOrderApprovalByBPMList', 
        LoginSessionKey: LoginSessionKey,
        Type: 1,
        PagerNum: 6,
        PagerIndex: that.pageNo
      })
    }).then((res)=>{
      if (res.IsLogin === 1) {
        const data = JSON.parse(res.ApiData)
        console.log(data)
        const OrderList = data.OrderList
        Toast.hide()
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
      console.log(rowData)
      const IsAllowCheck = rowData.IsAllowCheck
      return (
        <Card className="WFA_Content_Card">
          <Card.Header
            title={<span style={{color: "#FF694B"}}>审批单号：</span>}
            thumb={selIcon}
            extra={<span>{rowData.ApprovalNo}</span>}
          />
          <Card.Body>
            <ul>
              <li>提交时间：{rowData.Createtime}</li>
              <li>提交人员：{rowData.CreateByName}</li>
              <li>申请金额：{rowData.SettlePrice}</li>
              <li>审批时间：{rowData.Checktime}</li>
              <li>审批备注：{rowData.ApprovalFileName}</li>
            </ul>
          </Card.Body>
          {IsAllowCheck === 1 ? <Card.Footer extra={<div className="toApprovalPage">去审批</div>} /> : ""}
        </Card>
      );
    };
    return(
      <div className="WaitForApproveDom">
        <HeaderJS 
          CHeaderConfig={{
            title: "待审批订单",
            LeftClickFn: this.LeftClickFn.bind(this)
          }}
        />
        <WhiteSpace className="pageMarginTop" />
        <div className="WFA_Content">
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

export default connect(mapStateToProps)(WaitForApprove)