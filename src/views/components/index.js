
import DashBoard from './dashBoard';
import NavBar1 from './dashBoard/navbar';
import Login from './login';
import ContentBox from './dashBoard/ContentBox';
import SuperAdminDashboard from "./dashBoard/SuperAdminDashboard";

//standard_db
import Unit from './standard_db/Unit'
import Area from './standard_db/Area'
import Location from './standard_db/Location'
import Type from './standard_db/Type'
import Supplier from './standard_db/Supplier'
import Equipment from './standard_db/Equipment'
import Manufacturer from './standard_db/Manufacturer'
import Issue from './standard_db/Issue'
import Tool from './standard_db/Tool'
import Staff from './standard_db/Staff'
import Bom from './standard_db/Bom'
import Machine from './standard_db/Machine'
//wms_asset
import Receiving from './wms_asset/Receiving'
import Shipping from './wms_asset/Shipping'
import Stock from './wms_asset/Stock'
import Part from './standard_db/Part'
import Role from './system/Role'


import ShippingOrder from './wms_asset/ShippingOrder'
import UserList from './standard_db/UserList'
import Report from './Sensor_Area/Report'
import Dashboard_Inspector from './Sensor_Area/Dashboard_Inspector'

import OnlineUser from './system/OnlineUser'
//BM
import WorkingOrder from './breakdown_maintenance/WorkingOrder'

import EquipmentManager from './equipment_Manager'


export {
    Machine,
    Bom,
    WorkingOrder,
    Equipment,
    ShippingOrder,
    Unit,
    Stock,
    Staff,
    Shipping,
    Receiving,
    DashBoard,
    Dashboard_Inspector,
    ContentBox,
    NavBar1
    , Login,
    Location,
    Type,
    Supplier,
    Manufacturer,
    Issue,
    UserList,
    Area,
    Tool,
    Part,
    Role,
    OnlineUser,
    Report, SuperAdminDashboard,
    EquipmentManager
    
};
