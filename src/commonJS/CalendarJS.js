import React from 'react'
import { Calendar } from 'antd-mobile'
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import 'antd-mobile/lib/calendar/style/css'
import './CalendarJS.scss'

export default class CalendarJS extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      show: false,
      config: {},
      type: "one",
      startDate: "",
      endDate: ""
    }
  }
  onCancelFn(e){
    var defMsg = ""
    if(e === "C"){
      this.props.parent.getCalendarMsgFn(this, defMsg)
    }
  }
  onConfirm(startTime, endTime){
    console.log(this)
    console.log(startTime, endTime)
    let defMsg = {}
    let eIndex = this.props.calendarConfig.eindex
    if(typeof eIndex !== "number"){
      eIndex = ""
    }
    defMsg.startTime = startTime
    defMsg.endTime = endTime
    this.props.parent.getCalendarMsgFn(this, defMsg, eIndex)
  }
  render(){
    const calendarConfig = this.props.calendarConfig
    const config = {}
    const setLocale  = {
      title: calendarConfig.title,
      begin: calendarConfig.begin,
      over: calendarConfig.over,
      begin_over: calendarConfig.begin_over
    }
    config.locale = {...zhCN, ...setLocale}
    config.minDate = new Date(calendarConfig.minDate + " 00:00:00")
    const startDateArr = (calendarConfig.startDate !== ""&&typeof calendarConfig.startDate !== "undefined")?calendarConfig.startDate.split("-"):[]
    if(startDateArr.length>0){
      config.defaultDate = new Date(startDateArr[0] + "-" + startDateArr[1] + "-14 00:00:00")
    }
    if(calendarConfig.startDate !== ""){
      if(calendarConfig.endDate !== ""){
        config.defaultValue = [new Date(calendarConfig.endDate + " 00:00:00"), new Date(calendarConfig.startDate + " 00:00:00")]
      }else{
        config.defaultValue = [new Date(calendarConfig.startDate + " 00:00:00")]
      }
    }
    return(
      <Calendar
        {...config}
        visible = {calendarConfig.show}
        type = {calendarConfig.type}
        onConfirm = {this.onConfirm.bind(this)}
        onCancel = {this.onCancelFn.bind(this, "C")}
      />
    )
  }
}