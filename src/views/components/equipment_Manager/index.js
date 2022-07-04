
import $ from 'jquery'
import React, { Component } from 'react'  
import {createTree} from 'jquery.fancytree';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { api_get, api_post,api_post_prevent_doubleclick, AlertSuccess, ErrorAlert } from "@utils";
import Box from "@mui/material/Box";
import 'jquery.fancytree/dist/modules/jquery.fancytree.dnd';
//import 'jquery.fancytree/dist/modules/jquery.fancytree.filter';
import 'jquery.fancytree/dist/modules/jquery.fancytree.edit';

class EquipmentManager extends Component {
    constructor(props) {
        super(props);
        this.state = { partinfo:{}  };  
    }
    
    
    componentDidMount(){
        createTree('#tree',{
            extensions: ["dnd", "edit"],
            dnd: {
                autoExpandMS: 400,
               // focusOnClick: true,
                preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
                dragStart:  (node, data)=> {

                    console.log(node.data)
                    if (node.data.extrainfo == 'part')
                        return true;
                    else
                        return false;
    
                },
                dragEnter:  (node, data)=> {
    
                    return true;
                },
                dragDrop:  (node, data)=> {
    
                    data.otherNode.moveTo(node, data.hitMode);
                  this.processMoveNode(data.otherNode)
                }


                
            },
            source: [
                { title: "BOM", folder: true, key: "bom", lazy: true },
                { title: "Machine", folder: true, key: "machine", lazy: true },
                { title: "Tools", folder: true, key: "tool", lazy: true },
                { title: "Parts", folder: true, key: "part", lazy: true },
    
            ],
            clickFolderMode: 2,
            icon:  (event, data)=> {
               
                if (data.node.key == "part") {
                    return "mdi mdi-18px mdi-file-powerpoint-box-outline ";
                }
                else if (data.node.data.extrainfo == 'part') {
    
                    return "mdi mdi-18px mdi-puzzle";
                }
                else if (data.node.key == 'bom') {
    
                    return "mdi mdi-18px mdi-alpha-b-circle";
                } else if (data.node.data.extrainfo == 'bomitem') {
    
                    return "mdi mdi-18px mdi-controller-classic-outline";
                }
                else if (data.node.key == "tool") {
                    return "mdi mdi-18px mdi-alpha-t-circle ";
                }
                else if (data.node.data.extrainfo == 'toolitem') {
    
                    return "mdi mdi-18px mdi-merge";
                }
    
    
            },
            click:  (e, data)=>
            {

                if (data.node.data.extrainfo == "part") {
                        
                    api_post_prevent_doubleclick("EquipmentManagerApi/get-single-part", { part_id: data.node.data.nodeid },
                         (res) => {
                           console.log(res)
                           this.setState({partinfo:res})
                            // for (const [key, value] of Object.entries(res)) {
                            //     $('#' + key + "_info").text(value)
                            // }
                        })
                }

            },
            activate:  (event, data) =>{
    
    
            },
            loadChildren:  (event, data)=> {
    
    
                if (data.node.data.pagenode ===true) {
                    data.node.addPagingNode({
                        title: "More...",
                        pagenode:true,
                        nextpage : data.node.data.nextpage
                    });
                }
    
          },
            clickPaging:  (event, data)=> {
                var np = data.node.data.nextpage;
                var dfd = new $.Deferred();
                data.node.replaceWith( dfd.promise());
                // $http.callServer("asset", "GetBoms", { page: np })
                //     .then(function (res) {
                //         if (res.success) {
    
                //             var lst = res.data;
                //             dfd.resolve(lst);
    
                //             if ( lst.length > 0) {
                //                 data.node.data.nextpage = np + 1;
                //             }
    
                //         }
    
    
                //         else {
                //             dfd.reject("Error load data")
                //           //  console.log(res.error)
                //         }
                // });
    
    
            },
            lazyLoad:  (event, data)=> {
                var dfd = new $.Deferred();
                data.result = dfd.promise();
    
                if (data.node.key === 'part') {
                    api_get('EquipmentManagerApi/get-parts').then(data=>{
                        dfd.resolve(data);

                    }).catch(error=>{                
                        dfd.reject("Error load data")
                    })
                    
                   
    
                }
                else if (data.node.key === 'tool') {
                    $http.callServer("asset", "GetTools", { page: 1 })
                        .then(function (res) {
                            if (res.success)
                                // $.ui.fancytree.getTree("#tree").reload(res.data);
                                dfd.resolve(res.data);
    
                            else {
                                dfd.reject("Error load data")
                                // console.log(res.error)
                            }
                        })
    
                }
                else if (data.node.key === 'bom') {
                    $http.callServer("asset", "GetBoms", { page: 1 })
                        .then(function (res) {
                            if (res.success) {
                                // $.ui.fancytree.getTree("#tree").reload(res.data);
                                var lst = res.data;
                                if (lst) {
    
                                    lst.push({ title: "More...", statusNodeType: "paging", icon: false, pagenode: true, nextpage:2 })
                                }
                                dfd.resolve(lst);
                            }
    
    
                            else {
                                dfd.reject("Error load data")
                              //  console.log(res.error)
                            }
                        })
                } else if (data.node.data.extrainfo === 'bomitem') {
                    $http.callServer("asset", "GetPartsOfBom", { bom_key: data.node.data.nodeid })
                        .then(function (res) {
                            if (res.success) {
                                dfd.resolve(res.data);
                            }
    
    
                            else {
                                dfd.reject("Error load data")
                                //console.log(res.error)
                            }
                        })
    
    
                }
                 
            }
        });
    }

     processMoveNode(node) {

        api_post('/EquipmentManagerApi/save_parent_part', { Id: node.data.nodeid, ParentId: node.parent.data ? node.parent.data.nodeid : null })
            alert(node)
    }

    render() { 
            const{partinfo} =this.state;

        return ( <Box sx={{ pb: 5, height: 350, width: "100%" }}>
                 <Grid container spacing={1} >
                     <Grid item xs={4}>
                     <div id="tree">
                      </div>
                    </Grid>
                    <Grid item xs={8}>
                    <div className="container " id="partinfo" >
                        <div className="row text-center">
                            <div className="col-sm-4 mx-3 " style={{ border: '1px solid rgba(0, 0, 0, 0.05)'}} >

                                <img src={require("@static/dist/img/NoDataFound.png")}   className="card-img-top" id="imgPart" alt="..." />
                            </div>
                            <div className="col-sm-2 "  >
                                <ul className="row list-unstyled text-right" style={{fontSize:'18px'}}>
                                    <li className="col-sm-12">
                                        Part Code:
                                    </li>
                                    <li className="col-sm-12">
                                        Part Name
                                    </li>
                                    <li className="col-sm-12">
                                        Spec:
                                    </li>
                                    <li className="col-sm-12">
                                        Type:
                                    </li>
                                    <li className="col-sm-12">
                                        Price:
                                    </li>
                                    <li className="col-sm-12">
                                        Unit:
                                    </li>
                                    <li className="col-sm-12">
                                        Location:
                                    </li>
                                    <li className="col-sm-12">
                                        Type:
                                    </li>
                                    <li className="col-sm-12">
                                        Remark:
                                    </li>
                                </ul>
                            </div>
                            <div className="col-sm-4">
                                <ul className="row list-unstyled text-left" style={{fontSize:'18px', marginLeft:'30px'}}>
                                    <li className="col-sm-12">
                                        <span className="badge bg-secondary" >{partinfo.part_code}</span>
                                    </li>
                                    <li className="col-sm-12">
                                        <span className="badge bg-secondary" >{partinfo.part_name}</span>
                                    </li>
                                    <li className="col-sm-12">
                                        <span className="badge bg-secondary" >{partinfo.spec}</span>
                                    </li>
                                    <li className="col-sm-12">
                                        <span className="badge bg-secondary" >{partinfo.type_name}</span>
                                    </li>
                                    <li className="col-sm-12">
                                        <span className="badge bg-secondary" >{partinfo.price}</span>
                                    </li>
                                    <li className="col-sm-12">
                                        <span className="badge bg-secondary" >{partinfo.unit}</span>
                                    </li>
                                    <li className="col-sm-12">
                                        <span className="badge bg-secondary" >{partinfo.location_name}</span>
                                    </li>
                                    <li className="col-sm-12">
                                        <span className="badge bg-secondary" ></span>
                                    </li>
                                    <li className="col-sm-12">
                                        <span className="badge bg-secondary" >{partinfo.remark}</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>

                    </Grid>

                 </Grid>
          
        </Box> );
    }
}
 
export default EquipmentManager ; 