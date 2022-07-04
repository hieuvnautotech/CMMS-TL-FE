import React, { Component } from "react";

import { withRouter } from "react-router";
class NavBar extends Component {

  signOut=(e)=>{

    this.props.history.push("/logout")
  }

  render() {
    return (
     
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
           {/* <a class="navbar-brand" href="javascript:void(0)">Navbar</a> */}
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a
                className="nav-link"
                data-widget="fullscreen"
                href="#"
                role="button"
              >
                <i className="fas fa-expand-arrows-alt"></i>
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                role="button"
                onClick={this.signOut}
              >
              <i className="fas fa-sign-out-alt"></i>
              </a>
            </li>

           
          </ul>
        </nav>
    );
  }
}
export default withRouter(NavBar);