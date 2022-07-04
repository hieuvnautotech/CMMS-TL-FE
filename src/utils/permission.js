import React from "react";
import { BrowserRouter as Router, Route, Switch,Link } from "react-router-dom";
import * as ConfigConstants from '@constants/ConfigConstants';
import * as AllComponents from '@components';
import {ContentBox} from '@components';

const listToTree = (list, tree, parentId) => {
    list.forEach(item => {
      // Determine if it is the parent menu
      if (item.pid == parentId) {
        const child = {
          ...item,
          key: item.key || item.name,
          children: []
        }
        //Iterate the list to find all submenus that match the current menu
        listToTree(list, child.children, item.id)
        // Delete properties with no children value
        if (child.children.length <= 0) {
          delete child.children
        }
        // join the tree
        tree.push(child)
      }
    })
  }


  function ComponentWrapper(name, InputComponent, breadcrumb_array) {

    return class extends React.Component {
      // componentDidUpdate(prevProps) {
      //   console.log('Current props: ', this.props);
      //   console.log('Previous props: ', prevProps);
      // }
      render() {
       
        return <ContentBox title={String(name).toUpperCase()}  breadcrumb={breadcrumb_array}>
        <InputComponent  />
          </ContentBox>;
      }
    }
  }


  const buildTreeMenu = (list, tree, parentId, breadcrumb_array, data,routers,Component_Show_Default) => {
   
   var html_child=''
    list.forEach(item => {

      if (item.pid == parentId) {
        const child = {
          ...item,
          key: item.Code || item.Id,
          
          children: []
        }
    
      
        if (!parentId ) {
          if (item.visiable===true)   {
            breadcrumb_array =[item.name];
          }
          else   {
           
            breadcrumb_array =[];
          }
        } else  if (parentId ) {

              if (item.visiable===true) {
                html_child += `<li class="nav-item">
                <a href="#" router="${item.router??''}"  class="nav-link">
                <i class=" ${item.icon} nav-icon"></i>
                <p>${item.name}</p>
                </a> </li> `;
              }
              breadcrumb_array.push(item.name);
        }
       

        //Iterate the list to find all submenus that match the current menu
      var res_html=  buildTreeMenu(list, child.children, item.id,breadcrumb_array, data,routers,Component_Show_Default)
        // Delete properties with no children value
        var hasSub=false;
        if (child.children.length <= 0) {
          delete child.children;
          
          if (item.component && item.router ) {
              routers.push(
                <Route key={item.id} path={item.router} component={ComponentWrapper(item.title, AllComponents[item.component], [...breadcrumb_array]) } />
            );
           
            if (item.isShowDefault===true && !Component_Show_Default.cmp ) {
              Component_Show_Default.cmp=ComponentWrapper(item.name, AllComponents[item.component],[...breadcrumb_array]);
            }
            breadcrumb_array.pop();
           
          }
        } else {
             hasSub=true;
            res_html = '<ul class="nav nav-treeview sub-lever1">' +   res_html + '</ul>'
        }
        // join the tree fa-tachometer-alt
        tree.push(child)
        if (!parentId && item.visiable===true) {
            data.html += ` <li class="nav-item">
            <a href="#" router="${hasSub?'':item.router}" class="nav-link" >
            <i class="nav-icon  ${item.icon}"></i>
            <p>
                ${item.name}
            ` + 
             (hasSub ?'<i class="right fas fa-angle-left"></i>':'') +
            `</p>
            </a> ` +    res_html  + '</li>';
        }
      }
    });
    return html_child;
  }

  const GetMenus_LoginUser=()=>{
   let user = JSON.parse(localStorage.getItem(ConfigConstants.CURRENT_USER));

    const menuNav = []
    const routers=[];
    const data={html:''}
    const Component_Show_Default={cmp: null}

    if (user){
        const menus= user.user_info.menus;
      
        // Backend data
        buildTreeMenu(menus, menuNav, null,[], data,routers,Component_Show_Default);
    
       
    }
  //  console.log(html)
        return [menuNav,data.html, routers, user.Name, Component_Show_Default.cmp];
    
  }
  export  {
    GetMenus_LoginUser,

  }