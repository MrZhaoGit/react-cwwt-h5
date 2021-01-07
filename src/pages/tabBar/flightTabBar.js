import React from 'react'
import {TabBar} from 'antd-mobile'
import imgFlightSearch from '../../assets/flight_icon/search-ico.png'
import imgFlightSearchActive from '../../assets/flight_icon/searched-ico.png'
import imgOrderList from '../../assets/flight_icon/list_icon.png'
import imgOrderListActive from '../../assets/flight_icon/list_icon_active.png'
import imgCheckIn from '../../assets/flight_icon/checkin_icon.png'
import imgCheckInActive from '../../assets/flight_icon/checkin_icon_active.png'
import './flightTabBar.scss'

class FlightTabBars extends React.Component {
  render(){
    return (
      <TabBar
        className="FlightTabBar"
        tabBarPosition="bottom"
        tintColor="#FF694B"
        unselectedTintColor="#adb2b9"
      >
        <TabBar.Item
          className="FT_slider"
          selected="true"
          title="机票查询"
          icon={
            <img src={imgFlightSearch} alt=""/>
          }
          selectedIcon={
            <img src={imgFlightSearchActive} alt=""/>
          }
        />
        <TabBar.Item
          title="订单列表"
          icon={
            <img src={imgOrderList} alt=""/>
          }
          selectedIcon={
            <img src={imgOrderListActive} alt=""/>
          }
        />
        <TabBar.Item
          title="值机"
          icon={
            <img src={imgCheckIn} alt=""/>
          }
          selectedIcon={
            <img src={imgCheckInActive} alt=""/>
          }
        />
      </TabBar>
    )
  }
}

export default FlightTabBars