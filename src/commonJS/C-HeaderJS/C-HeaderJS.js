import React from 'react'
import { NavBar, Icon, Popover } from 'antd-mobile';
import './C-HeaderJS.scss'

const Item = Popover.Item;

export default class CHeaderJS extends React.Component{
  constructor(props){
    super(props)
    let defRightSelectDom = [
      (<Item key="0" value="scan">Scan</Item>),
      (<Item key="1" value="special">My Qrcode</Item>),
      (<Item key="2" value="button"><span>Help</span></Item>),
    ]
    const setHeaderConfig = this.props.CHeaderConfig
    this.state = {
      title: "标题未传入",
      userRightContent: false,
      RightSelectDom: defRightSelectDom,
      ClassName: "",
      upStataKey: "",
      visible: false,
      ...setHeaderConfig
    }
  }
  onLeftClickFn = (e) =>{
    const LeftClickFn = this.props.CHeaderConfig.LeftClickFn
    if(typeof LeftClickFn === "function"){
      LeftClickFn()
    }else {
      console.log("inner-click left-icon")
    }
  }
  onRightClickFn = (e) =>{
    console.log(e)
    const eVal = e.props.value
    const RightClickFn = this.props.CHeaderConfig.RightClickFn
    if(typeof RightClickFn === "function"){
      this.setState({
        visible: false
      })
      RightClickFn(eVal)
    }else {
      console.log("inner-click right-icon")
      
    }
  }
  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    })
  }
  render (){
    console.log(this)
    const rightContentDom = []
    if(this.state.userRightContent){
      rightContentDom.push(<Popover mask
        key="HeaderPopover"
        overlayClassName={"HeaderPopover HeaderPopover-" + this.state.ClassName}
        overlayStyle={{ color: 'currentColor' }}
        visible={this.state.visible}
        overlay={this.state.RightSelectDom}
        align={{
          overflow: { adjustY: 0, adjustX: 0 },
          offset: [-15, -10],
        }}
        onVisibleChange={this.handleVisibleChange}
        onSelect={this.onRightClickFn}
      >
        <div style={{
          height: '100%',
          padding: '0 15px',
          marginRight: '-15px',
          display: 'flex',
          alignItems: 'center',
        }}
        >
          <Icon type="ellipsis" />
        </div>
      </Popover>)
    }
    return (
      <div className="HeaderDom">
        <NavBar
          icon={[
            <Icon key="0" type="left" />
          ]}
          style={{...this.state.style}}
          rightContent={rightContentDom}
          onLeftClick={this.onLeftClickFn.bind(this)}
        >{this.state.title}</NavBar>
      </div>
    )
  }
}