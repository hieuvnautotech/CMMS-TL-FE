import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NavBar from "./navbar";
import SliderBar from "./sidebar";
import Footer_DashBoard from "./footer";
import { ToastContainer, toast } from "react-toastify";
import ShortUniqueId from "short-unique-id";
import { GetMenus_LoginUser, eventBus } from "@utils";
import { Treeview } from "@static/js/adminlte.js";
import * as SignalR from '@microsoft/signalr'
import * as ConfigConstants from '@constants/ConfigConstants';
import { withRouter } from "react-router";
import Popup from 'react-popup';
import { HashRouter } from 'react-router-dom'

// import * as SignalR from '@microsoft/signalr'
class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {showAlert:false};
    var res = GetMenus_LoginUser();
    this.html = res[1];
    this.showRouters = res[2];

    this.Fullname = res[3];
    this.Component_Default = res[4];
    this.user = JSON.parse(localStorage.getItem(ConfigConstants.CURRENT_USER));
    //  const uid = new ShortUniqueId();
    // this.newRenderId= uid();
  }

  componentWillUnmount(){
    if (this.newConnection) {
      this.newConnection.stop().then(()=> console.log("websocket is disconnected"));
      this.newConnection=null;
     }
  }
  componentDidMount() {
    
    (async () => {
      var Treeview_slideMenu = new Treeview($("#main-slidebar-menu"), {
        accordion: false,
        animationSpeed: 300,
        expandSidebar: false,
        sidebarButtonSelector: '[data-widget="pushmenu"]',
        trigger: '[data-widget="treeview"] .nav-link',
        widget: "treeview",
      });
      Treeview_slideMenu.init();

      this.newConnection = new SignalR.HubConnectionBuilder()
              .configureLogging(SignalR.LogLevel.None)
             .withUrl(
                 ConfigConstants.BASE_URL + `hubs/userhub`, {
                 accessTokenFactory: () => this.user.access_token,
                 skipNegotiation: true,
                 transport: SignalR.HttpTransportType.WebSockets
                 }
             )
             .withAutomaticReconnect()
             .build();
     await this.newConnection.start();
     console.log("websocket is connected to userhub")

     this.newConnection.on('AppendNotice', (messObj) => {
        console.log(messObj)
        if (messObj.typestring=="notifyupload") {
          eventBus.dispatch("new_file_uploaded", messObj.data);
        }  else if (messObj.typestring=="lock_account") {
          Popup.create({
            title: "Thông báo",
            content: "Tài khoản của bạn đã bị lock. Bạn không thể đăng nhập vào ứng dụng. vui lòng liên hệ bộ phận quản trị.",
            className: 'alert',
            buttons: {
              right: [{
                text: 'Ok',
                className: 'error',
                action:  ()=> {
                    Popup.close();
                   
                }
            }]
            },
            onClose: (id, title) => {
              this.props.history.push("/logout")
          },
        }, true);
        }
      else  if (messObj.typestring=="force_exit") {
          Popup.create({
            title: "Sorry",
            content: "Tài khoản của bạn đã bị logout bởi admin.",
            className: 'alert',
            buttons: {
              right: [{
                text: 'Ok',
                className: 'error',
                action:  ()=> {
                    Popup.close();
                   
                }
            }]
            },
            onClose: (id, title) => {
              this.props.history.push("/logout")
          },
        }, true);
         
        }
         else if (messObj.typestring=="alert_message") {
          //Popup.alert('I am alert, nice to meet you');
          var message=messObj.data;
            Popup.create({
              title: message.title,
              content: message.content,
              className: 'alert',
              buttons: {
                  right: ['ok']
              }
          }, true);
        }
     });
      
     })(); 
  }

  render() {
    return (
      <>
      <Popup 
        escToClose={false}
      />
        <div className="container-fluid">
       
          <Router>
         
            <ToastContainer
              theme="colored"
              position="top-right"
              autoClose={5000}
              // hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              // draggable
              pauseOnHover
            />
            <NavBar />
           
            <SliderBar Menus={this.html} FullNameLogin={this.Fullname} />
            <Switch>
              {this.showRouters}

              <Route path="/" component={this.Component_Default} />
            </Switch>
            <Footer_DashBoard />
          </Router>
        </div>
      </>
    );
  }
}
export default withRouter(DashBoard);
