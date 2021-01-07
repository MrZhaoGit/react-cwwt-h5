import React from 'react'
import { InputItem, Icon, ActionSheet, Flex, Popover, Steps, Grid } from 'antd-mobile'
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { connect } from 'react-redux'
import HeaderJS from '../../commonJS/C-HeaderJS/C-HeaderJS'

import visaBanner from '../../assets/visa_icon/visa-banner.png'

import DE from '../../assets/visa_icon/DE.png'
import FI from '../../assets/visa_icon/FI.png'
import NZ from '../../assets/visa_icon/NZ.png'
import SG from '../../assets/visa_icon/SG.png'
import KR from '../../assets/visa_icon/KR.png'

import FliesIcon from '../../assets/visa_icon/ic_files@2x.png'
import ExamIcon from '../../assets/visa_icon/ic_examine@2x.png'
import HandleIcon from '../../assets/visa_icon/ic_handle@2x.png'
import VisaIcon from '../../assets/visa_icon/ic_visa@2x.png'

import 'swiper/swiper.scss';
import './VisaCss/Visa.scss'

const Item = Popover.Item
const Step = Steps.Step;

SwiperCore.use([Autoplay]);

class Visa extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showPopover: false,
      InsType: [
        {
          InsTypeCode: "1",
          InsTypeName: "因公",
          isSelected: true
        },{
          InsTypeCode: "2",
          InsTypeName: "因私",
          isSelected: false
        }
      ],
      VisaListStr: "马尔代夫,济州岛,毛里求斯,巴厘岛,塞舌尔,塞班岛,斐济,泰国"
    }
  }
  LeftClickFn(e){
    this.props.history.push({pathname:'/'})
  }
  // 切换公私类型
  selVisaInsTypeFn(){
    console.log(111)
    this.setState({
      showPopover: true
    })
  }
  onSelectFn(e){
    console.log(e)
    const getData = this.state.InsType
    const selIndex = (e.key)*1-1
    this.setState({
      InsType: getData.map((item, idx) => idx === selIndex ?{...item,isSelected: true}: {...item, isSelected: false}),
      showPopover: false
    })
  }
  render(){
    let InsTypeName = ""
    for(let i = 0; i < this.state.InsType.length; i ++){
      if(this.state.InsType[i].isSelected){
        InsTypeName = this.state.InsType[i].InsTypeName
      }
    }
    return(
      <div className="VisaDom">
        <HeaderJS 
          CHeaderConfig={{
            title: "签证",
            style: {
              backgroundColor: "transparent"
            },
            LeftClickFn: this.LeftClickFn.bind(this)
          }}
        />
        <div className="Visa_Banner">
          <img src={visaBanner} alt="" />
          <Flex
            className="VB_SearchBox"
            justify="between"
          >
            <Popover
              overlayClassName="VB_SelInsType"
              visible={this.state.showPopover}
              overlay={[
                (<Item key="1" value="1"  >因公</Item>),
                (<Item key="2" value="2">因私</Item>),
              ]}
              placement="bottomLeft"
              align={{
                offset: [0, 15],
              }}
              onSelect={this.onSelectFn.bind(this)}
            >
              <div className="VB_InsType"
                onClick={this.selVisaInsTypeFn.bind(this)}
              >
                {InsTypeName}
                <Icon type="down" size="xxs" />
              </div>
            </Popover>
            <InputItem 
              prefixListCls="VB_Search"
              placeholder="国家/地区"
              editable={false}
            >
              <Icon type="search" color="#ADB2B9" size="xs" />
            </InputItem>
          </Flex>
        </div>
        <div className="VC_title_box">
          <Flex className="VC_title" justify="between">
            <p>热门城市</p>
            <p>更多&gt;&gt;</p>
          </Flex>
        </div>
        <div className="Visa_Content">
          <Swiper
            className="VC_Swiper"
            spaceBetween={20}
            slidesPerView={4}
            autoplay={true}
            loop={true}
          >
            <SwiperSlide><img src={DE} alt=""/><p>DE</p></SwiperSlide>
            <SwiperSlide><img src={FI} alt=""/><p>FI</p></SwiperSlide>
            <SwiperSlide><img src={NZ} alt=""/><p>NZ</p></SwiperSlide>
            <SwiperSlide><img src={SG} alt=""/><p>SG</p></SwiperSlide>
            <SwiperSlide><img src={KR} alt=""/><p>KR</p></SwiperSlide>
          </Swiper>
        </div>
        <div className="VC_title_box">
          <Flex className="VC_title" justify="between">
            <p>办理流程</p>
            <p></p>
          </Flex>
        </div>
        <div className="VC_Steps">
          <Steps direction="horizontal">
            <Step status="finish" title="1.预定并提交材料" icon={<img src={FliesIcon} alt=""/>} />
            <Step status="finish" title="2.材料初审" icon={<img src={ExamIcon} alt=""/>}/>
            <Step status="finish" title="3.使馆办理" icon={<img src={HandleIcon} alt=""/>}/>
            <Step status="finish" title="4.出签领签" icon={<img src={VisaIcon} alt=""/>}/>
          </Steps>
        </div>
        <div className="VC_title_box">
          <Flex className="VC_title" justify="between">
            <p>免签/落地签/过境签证</p>
            <p>更多&gt;&gt;</p>
          </Flex>
        </div>
        <Grid 
          className="VC_VisaCity"
          data={this.state.VisaListStr.split(",")}
          columnNum={5}
          hasLine={false}
          activeStyle={false}
          renderItem={dataItem => (
            <div>{dataItem}</div>
          )}
        />
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

export default connect(mapStateToProps)(Visa)