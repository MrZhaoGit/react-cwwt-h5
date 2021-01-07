import React from 'react'
import { SearchBar, Icon, Grid, Tabs } from 'antd-mobile';
import $ from 'jquery'
import qs from 'qs'
import { HelperJS } from '../../commonJS/C-Helper'
import './CityJS.scss'


export default class CityJS extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      CtiyType: this.props.cityMsg.state.CityPlug.CtiyType,
      inputValue: '',
      isLoading: true,
      defHotCityData: {},
      defCityData: [],
      defICityData: [],
      searchResult: [],
      searchResultID: []
    };
  }
  componentDidMount = () =>{
    const defDataObj = HelperJS.setSessionStorageFn("G", "defCityDataObj")
    const defIDataObj = HelperJS.setSessionStorageFn("G", "defICityDataObj")
    if(defDataObj){
      this.setState({
        defCityData: JSON.parse(defDataObj),
        defICityData: JSON.parse(defIDataObj)
      })
      if(this.state.CtiyType === "D"){
        this.getSearchResultFn(JSON.parse(defDataObj),"")
      }else if(this.state.CtiyType === "I"){
        this.getSearchResultFn(JSON.parse(defIDataObj),"")
      }
    }else {
      this.getCityDataFn(this.props.cityMsg.state.CityPlug.CtiyType)
    }
  }
  // 获取城市列表
  getCityDataFn(domcType){
    const that = this
    const LoginSessionKey = that.props.cityMsg.props.UserKeyData
    const domcTypeArr = ["D", "I"]
    if(domcType === "I"){
      for(let i = 0; i <domcTypeArr.length; i ++){
        that.$axios({
          method: 'post',
          url: '/Interface/DomesticFlightHandler.ashx',
          data: qs.stringify({ 
            MethodType: 'M_GetCityList', 
            CityText: '',
            LoginSessionKey: LoginSessionKey,
            IsDomc: domcTypeArr[i]
          })
        }).then((res)=>{
          if (res.IsLogin === 1) {
            const dataArray = res.ApiData.split('|');
            const hotData = JSON.parse(dataArray[0]);
            const data = JSON.parse(dataArray[1]);
            that.getDefCityDataFn(hotData.HotCityInfo, data.CityInfo, domcTypeArr[i])
          }
        })
      }
    }else {
      that.$axios({
        method: 'post',
        url: '/Interface/DomesticFlightHandler.ashx',
        data: qs.stringify({ 
          MethodType: 'M_GetCityList', 
          CityText: '',
          LoginSessionKey: LoginSessionKey,
          IsDomc: "D" 
        })
      }).then((res)=>{
        if (res.IsLogin === 1) {
          const dataArray = res.ApiData.split('|');
          const hotData = JSON.parse(dataArray[0]);
          const data = JSON.parse(dataArray[1]);
          that.getDefCityDataFn(hotData.HotCityInfo, data.CityInfo, "D")
        }
      })
    }
  }
  // 获取快捷导航
  getDefCityDataFn = (hotdata, defdata, domcType) =>{
    const defDataObj = {}
    defDataObj.hot = []
    if(hotdata.length>0){
      for(let i = 0;i<hotdata.length;i++){
        if(hotdata[i].IsDomc === domcType){
          defDataObj.hot.push(hotdata[i])
        }
      }
    }
    if(defdata.length>0){
      defdata.sort((a, b) => {
        return a.FirstLetter.localeCompare(b.FirstLetter);
      });
      defdata.forEach(item => {
        const qf = item.FirstLetter.toUpperCase();
        defDataObj[qf] = defDataObj[qf] || [];
        defDataObj[qf].push(item);
      });
    }
    if(domcType === "D"){
      this.setState({
        defCityData: defDataObj,
      })
      this.getSearchResultFn(defDataObj,"")
      HelperJS.setSessionStorageFn("S", "defCityDataObj", JSON.stringify(defDataObj))
    }else if(domcType === "I"){
      this.setState({
        defICityData: defDataObj,
      })
      this.getSearchResultFn(defDataObj,"")
      HelperJS.setSessionStorageFn("S", "defICityDataObj", JSON.stringify(defDataObj))
    }
    
  }
  getSearchResultFn=(data,keyVal)=>{
    const dataDom = []
    const dataDomID = []
    Object.keys(data).forEach((item, index) => {
      if(item === "hot" && data[item].length>0 && keyVal === ""){
        dataDom.push(<div id={item} key={item+index} className="SC_Slider_title">{item==="hot"?"热门城市" : item}</div>)
        dataDomID.push(<li key={item} onClick={this.jumpToDomFn.bind(this,item)}>{item}</li>)
        dataDom.push(
          <Grid 
            key="hotCityGrid"
            activeStyle={false}
            className="hotCityGrid"
            hasLine={false}
            data = {data[item]}
            columnNum={3}
            renderItem = {dataItem=>(
              <div className="hotCityItem" onClick={this.setSelectCityFn.bind(this,dataItem)} data-id={dataItem.CityCode} key={item+dataItem.CityCode}>{dataItem.CityName}</div>
            )}
          />
        )
      }
      if(item !== "hot") {
        let dataItem = data[item]
        if(keyVal !== ""){
          let newItem = []
          for(let i=0;i<dataItem.length;i++){
            const cityCode = dataItem[i].CityCode
            const CityECode = dataItem[i].CityECode
            const CityName = dataItem[i].CityName
            const CityEName = dataItem[i].CityEName.toUpperCase()
            if(cityCode.indexOf(keyVal.toUpperCase()) >= 0 
              || CityECode.indexOf(keyVal.toUpperCase()) >= 0
              || CityName.indexOf(keyVal) >= 0
              || CityEName.indexOf(keyVal.toUpperCase()) >= 0)
            {
              newItem.push(dataItem[i])
            }
          }
          dataItem = newItem
        }
        if(dataItem.length>0){
          dataDom.push(<div id={item} key={item+index} className="SC_Slider_title">{item}</div>)
          dataItem.forEach((jj) => {
            dataDom.push(
              <div className="SC_Slider_text" key={jj.CityCode+item} onClick={this.setSelectCityFn.bind(this, jj)}>
                <p>{jj.CityName +"("+ jj.AirPortName + ")，"+ jj.CityCode}</p>
                <p>{jj.CityEName}</p>
              </div>
            )
          })
          dataDomID.push(<li key={item} onClick={this.jumpToDomFn.bind(this,item)}>{item}</li>)
        }
      }
    })
    this.setState({
      searchResult: dataDom,
      searchResultID: dataDomID
    })
  }
  setSelectCityFn = (e,j) =>{
    // 定义一个父级的方法 在此调用 返回选中的城市值
    let useId = this.props.cityMsg.state.CityPlug.id
    let userIdIndex = this.props.cityMsg.state.CityPlug.idIndex
    if(typeof userIdIndex !== "number"){
      userIdIndex = ""
    }
    this.props.cityMsg.setThisCityFn(e,useId, userIdIndex)
  }
  backParentPageFn = ()=>{
    this.props.cityMsg.setThisCityFn("")
  }
  jumpToDomFn = (e,j) => {
    const changeVal = this.state.CtiyType === "D"? 88 : 161
    let parentScrollVal = $(".cityPlugDom").scrollTop()
    let scrollVal = ($("#"+e).offset().top) - changeVal
    $(".cityPlugDom").scrollTop(scrollVal + parentScrollVal)
  }
  onChangeFn =(e)=>{
    this.setState({
      inputValue: e
    })
    this.getSearchResultFn(this.state.defCityData,e)
  }
  onCancelFn=(e)=>{
    this.setState({
      inputValue: ""
    })
    $(".cityPlugDom").scrollTop(0)
    this.getSearchResultFn(this.state.defCityData,"")
  }
  // tab 切换热门城市以及城市信息
  onTabClickFn =(tab, index) => {
    console.log(tab, index)
    const defCityData = this.state.defCityData
    const defICityData = this.state.defICityData
    if(index === 0){
      this.getSearchResultFn(defCityData,"")
    } else if(index === 1){
      this.getSearchResultFn(defICityData,"")
    }
  }
  render() {
    let searchResultDom = this.state.searchResult
    let TabsDom = ""
    
    if(this.state.defCityData.length<=0){
      searchResultDom = <div className="noSearchResult" key="LoadingCityMsg">正在为您查询数据，请稍后...</div>
    }else {
      if(this.state.searchResult.length<=0){
        searchResultDom = <div className="noSearchResult" key="noCityMsg">未查询到符合条件的数据</div>
      }
    }
    const tabs = [
      { title: "国内" },
      { title: "国际/港澳台" }
    ];
    const CtiyType = this.state.CtiyType
    if(CtiyType === "I"){
      TabsDom = <Tabs
        tabs = {tabs}
        initialPage={1}
        prefixCls="SearchTabHotCity"
        onTabClick={(tab, index) => { this.onTabClickFn(tab, index) }}
      />
    }
    return (
      <div className="cityPlugDom">
        <div className="citySearch">
          <Icon type="left" size="lg" className="citySearchLeft" onClick={this.backParentPageFn} />
          <SearchBar
            key="SearchBarCity"
            value={this.state.inputValue}
            placeholder="选择城市"
            className="citySearchBox"
            onChange={this.onChangeFn}
            onCancel={(e) => this.onCancelFn(e)}
          />
          {TabsDom}
        </div>
        <div className={CtiyType === "I"?"searchContainer searchContainer_I" : "searchContainer"} id="searchContainer" key="searchContainer">
          {searchResultDom}
          <ul className="searchResultID" key="searchResultID">{this.state.searchResultID}</ul>
        </div>
      </div>
    );
  }
}