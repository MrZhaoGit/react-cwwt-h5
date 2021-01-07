import React from 'react'
import {withRouter} from "react-router-dom"
import {TabBar} from 'antd-mobile'
import imgHome from '../../assets/home_icon/home-ico.png'
import imgHomeActive from '../../assets/home_icon/homeed-ico.png'
import imgTrip from '../../assets/home_icon/routeed-ico.png'
import imgTripActive from '../../assets/home_icon/routed-ico.png'
import imgSer from '../../assets/home_icon/phone-ico.png'
import imgSerActive from '../../assets/home_icon/phoneed-ico.png'
import imgMyPage from '../../assets/home_icon/mine-ico.png'
import imgMyPageActive from '../../assets/home_icon/mineed-ico.png'
import './tabBar.scss'

class TabBars extends React.Component {
  constructor(props){
    super(props)
    const selectTabBarIndex = this.props.TabBarsCofig.selectTabBarIndex
    this.state = {
      selectIndex: selectTabBarIndex,
      defTabBarRouter: [
        {routerIdenx: 0, routerLink: "/"},
        {routerIdenx: 1, routerLink: "/trip"},
        {routerIdenx: 2, routerLink: "/service"},
        {routerIdenx: 3, routerLink: "/User/Center"},
      ]
    }
    console.log(this)
  }
  onPressFn(e){
    const routerLink = this.state.defTabBarRouter[e].routerLink
    if(e !== this.state.selectTabBarIndex){
      this.props.history.push({pathname: routerLink})
    }
  }
  render(){
    return(
      <TabBar
        tabBarPosition="bottom"
        tintColor="#FF694B"
        unselectedTintColor="#5a616a"
      >
        <TabBar.Item
          selected={this.state.selectIndex === 0 ? true : false}
          title="首页"
          icon={
            <img src={imgHome} alt=""/>
          }
          selectedIcon={
            <img src={imgHomeActive} alt=""/>
          }
          onPress={this.onPressFn.bind(this, 0)}
        />
        <TabBar.Item 
          selected={this.state.selectIndex === 1 ? true : false}
          title="行程"
          icon={
            <img src={imgTrip} alt=""/>
          }
          selectedIcon={
            <img src={imgTripActive} alt=""/>
          }
          onPress={this.onPressFn.bind(this, 1)}
        />
        <TabBar.Item 
          selected={this.state.selectIndex === 2 ? true : false}
          title="客服"
          icon={
            <img src={imgSer} alt=""/>
          }
          selectedIcon={
            <img src={imgSerActive} alt=""/>
          }
          onPress={this.onPressFn.bind(this, 2)}
        />
        <TabBar.Item 
          selected={this.state.selectIndex === 3 ? true : false}
          title="我的"
          icon={
            <img src={imgMyPage} alt=""/>
          }
          selectedIcon={
            <img src={imgMyPageActive} alt=""/>
          }
          onPress={this.onPressFn.bind(this, 3)}
        />
      </TabBar>
    )
  }
}

export default withRouter(TabBars)