// 主路由
import Login from '../pages/login/login'              // 登录
import Home from '../pages/home/home'                 // 主页
import Trip from '../pages/trip/trip'                 // 我的行程
import CWTService from '../pages/service/service'     // cwt客服

// 机票路由
import DFlightSearch from '../pages/flight/DFlight'   // 国内机票
import IFlightSearch from '../pages/flight/IFlight'   // 国际机票

// 酒店路由
import DHotelSearch from '../pages/hotel/DHotel'      // 国内酒店
import IHotelSearch from '../pages/hotel/IHotel'      // 国际酒店

// 火车路由
import TrainSearch from '../pages/train/Train'        // 火车首页

// 租车路由
import CarRentalSearch from '../pages/car/Car'        //租车首页

// 签证
import VisaSearch from '../pages/visa/Visa'           // 签证首页

// 贵宾厅
import VipSearch from '../pages/vip/Vip'              // 贵宾厅首页

// 审批相关路由 
import WaitForApproval from '../pages/approve/WaitForApproval'  //待审批
import MyApprovalForm from '../pages/approve/Approve'           // 审批订单

// 用户账户路由
import UserCenter from '../pages/userConter/Conter'   // 我的账户首页
import OrderList from '../pages/userConter/OrderList' // 订单列表

export const routerConfig = [
  {
    path: '/',
    component: Home,
    auth: true
  },{
    path: '/login',
    component: Login
  },{
    path: '/trip',
    component: Trip,
    auth: true
  },{
    path: '/service',
    component: CWTService,
    auth: true
  },{
    path: '/Flight/Search',
    component: DFlightSearch,
    auth: true
  },{
    path: '/Flight/InterSearch',
    component: IFlightSearch,
    auth: true
  },{
    path: '/Hotel/Search',
    component: DHotelSearch,
    auth: true
  },{
    path: '/Hotel/InterSearch',
    component: IHotelSearch,
    auth: true
  },{
    path: '/Train/Search',
    component: TrainSearch,
    auth: true
  },{
    path: '/CarRental/Search',
    component: CarRentalSearch,
    auth: true
  },{
    path: '/Visa/Search',
    component: VisaSearch,
    auth: true
  },{
    path: '/Vip/Search',
    component: VipSearch,
    auth: true
  },{
    path: '/Approve/WaitForApproval',
    component: WaitForApproval,
    auth: true
  },{
    path: '/Approve/MyApprovalForm',
    component: MyApprovalForm,
    auth: true
  },{
    path: '/User/Center',
    component: UserCenter,
    auth: true
  },{
    path: '/User/OrderList',
    component: OrderList,
    auth: true
  }
]