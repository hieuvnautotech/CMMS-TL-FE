import React, { Component, Fragment } from "react";
import { GetMenus_LoginUser } from "@utils";
import { withRouter } from "react-router";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class SlideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  linkClickHandler = (e) => {
    const targetlink = e.target.closest("a");
    if (!targetlink) return;

    var router = targetlink.getAttribute("router");

    if (router && router != "") {
      e.preventDefault();
      this.props.history.push(router);
    }
  };

  render() {
    return (
      <>
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
          {/* <!-- Brand Logo --> */}
          <a href="#" className="brand-link">
            <img
                  src={require("@static/dist/img/cmms_logo_2.png")}
            
              alt="CCMS Logo"
              className="brand-image img-circle elevation-1"
            
            />
            <span className="brand-text font-weight mx-4"></span>
          </a>

          {/* <!-- Sidebar --> */}
          <div className="sidebar">
            {/* <!-- Sidebar user (optional) --> */}
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="info">
                <a href="#" className="d-block">
                  <img
                    src={require("@static/dist/img/avatar5.png")}
                    alt="CCMS Logo"
                    className="brand-image img-circle elevation-3 mx-1"
                  />
                  <span>{this.props.FullNameLogin}</span>
                </a>
              </div>
            </div>
            {/* <!-- Sidebar Menu --> */}
            <nav className="mt-2">
              <ul
                id="main-slidebar-menu"
                className="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {this.props.Menus && (
                  <div
                    onClick={this.linkClickHandler}
                    dangerouslySetInnerHTML={{ __html: this.props.Menus }}
                  ></div>
                )}
              </ul>
            </nav>
          </div>
        </aside>
      </>
    );
  }
}
export default withRouter(SlideBar);
