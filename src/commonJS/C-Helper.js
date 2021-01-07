export const HelperJS = {
  // type 去除空格 0：前后空格，1：全部空格，2：前空格，3：后空格
  delStrSpaceFn(e){
    let newStr = ''
    if(e.type === 0){
      newStr = e.str.replace(/^\s+|\s+$/g,"")
    } else if(e.type === 1){
      newStr = e.str.replace(/\s+/g,"")
    } else if(e.type === 2){
      newStr = e.str.replace( /^\s*/, '')
    } else if(e.type === 3){
      newStr = e.str.replace(/(\s*$)/g, "")
    }
    return newStr
  },
  // 随机32位字符串
  newGuidFn(){
    let guid = "";
    for (let i = 1; i <= 32; i++) {
      let n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i === 8) || (i === 12) || (i === 16) || (i === 20))
            guid += "-";
    }
    return guid;
  },
  // 接口err信息处理
  GetErrStrFn(err){
    let errMsg = ''
    const errObj = JSON.parse(err)
    const errContent = errObj.M_ErrorInfo_1_0.Content
    const reg = /\d{6}-/
    if (reg.test(errContent)) {
      errMsg = errContent.replace(reg, '');
      if (errMsg.substr(0, 1) === "(") {
        errMsg = errMsg.substr(1, errMsg.length - 2);
      }
    }
    return errMsg
  },
  // LocalStorage setType: "S"/"D"/"G"
  setLocalStorageFn(setType, setStrName, setStrVal){
    if(setType === "S"){
      window.localStorage.setItem(setStrName, setStrVal)
    }else if(setType === "G"){
      const thisItemVal = window.localStorage.getItem(setStrName)
      return thisItemVal
    }else if(setType === "D"){
      window.localStorage.removeItem(setStrName)
    } else {
      console.log("nothing in there")
    }
  },
  // SessionStorage setType: "S"/"D"/"G"
  setSessionStorageFn(setType, setStrName, setStrVal){
    if(setType === "S"){
      window.sessionStorage.setItem(setStrName, setStrVal)
    }else if(setType === "G"){
      const thisItemVal = window.sessionStorage.getItem(setStrName)
      return thisItemVal
    }else if(setType === "D"){
      window.sessionStorage.removeItem(setStrName)
    } else {
      console.log("nothing in there")
    }
  },
  // 处理日历返回date日期
  getDateFn(dateStr){
    let datestr = new Date(dateStr)
    let year = datestr.getFullYear()
    let month = (datestr.getMonth()*1 + 1) < 10 ? "0" + (datestr.getMonth()*1 + 1) : datestr.getMonth()*1+ 1 
    let day = datestr.getDate() < 10 ? "0" + datestr.getDate() : datestr.getDate()

    return year + "-" + month + "-" + day
  }
}