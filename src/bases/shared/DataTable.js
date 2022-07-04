import React,{forwardRef, useRef, useImperativeHandle, useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { DataGrid } from "@mui/x-data-grid";
import BoxLoading from './BoxLoading'
import { api_get, api_post, AlertSuccess, ErrorAlert } from "@utils";
import * as ConfigConstants from '@constants/ConfigConstants';

//by mrhieu84 23-6-2022
 class DataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isGettingData:false,
          isFirstloading:true,
          rows:[],
            pageSize:5,
            rowCount:0,
            currentPage:0,
            isPaging:false
          };
    }

  componentWillUnmount() {
   
  }

  UNSAFE_componentWillMount(){
  
    this.loadData();
  }
 
  componentDidUpdate(prevProps, prevState) {
    this.props.setTrigger({
      refreshGrid:this.refreshGrid, 
      search:this.search, 
      addNewRow:this.addNewRow,
      updateRow:this.updateRow
    }) 

    const{url}=this.props;

    if ( prevState.pageSize != this.state.pageSize ||  url !== prevProps.url  )  {
      this.loadData();
    }
  }

    refreshGrid =()=>{
    
        return this.loadData();
    }
    search =(datasearch)=>{
    
    return this.loadData(datasearch);
    }

    addNewRow =(dataRow)=>{
        const newRows = [dataRow].concat(this.state.rows);
        this.setState({rows:newRows})
    }

    updateRow =(dataRow)=>{
      var listrows= this.state.rows.map((row, index) =>
      row.id === dataRow.id ? { ...row, ...dataRow } : row,
    );
      this.setState({rows:listrows})
  }

  loadData(datasearch){
    const{url, rows, IsPagingServer}=this.props;
  //  if (rows!==undefined ) return;
    if (url ===undefined) {
        this.setState({rows:this.props.rows})
        return;
    }
    let filterObj=datasearch||{};
    const pageSize=this.props.pageSize || this.state.pageSize
    if (IsPagingServer!==undefined) {
     
      filterObj= {...datasearch,page:this.state.currentPage,pagesize:pageSize}

    }
   
    var objstate={isGettingData:true,pageSize:pageSize}
    if (datasearch) objstate.isFirstloading=true;
    this.setState({...objstate})


return new Promise((resolve, reject)=>{
  api_get(url,filterObj).then((data) => {
    let rows=[]
    if (data.hasOwnProperty("items"))
       rows= data.items;
    else rows=data;

    this.setState({isGettingData:false,isFirstloading:false,rowCount:data.totalCount, rows:rows})
    resolve(rows);
  });
});
    
  }
  renderSkeletons() {
    let arrSkeleton=[]
    for (var i=0 ;i<this.props.number;i++) {
        arrSkeleton.push(<Skeleton key={"ske_" + i} />)
    }
    return arrSkeleton;
  }
  
  pageChange(newpage){
    console.log(newpage)
    this.setState({currentPage:newpage, isPaging:true})
    //get data from server
    const pageSize=this.props.pageSize || this.state.pageSize
    api_get(this.props.url,{page:newpage, pagesize:pageSize}).then((data) => {

      let rows=[]
    if (data.hasOwnProperty("items"))
       rows= data.items;
    else rows=data;
 
        this.setState({isPaging:false,rowCount:data.totalCount, rows:rows})
    });
  }


  render() {
    const {
      numberLoading,
      showLoading,
      IsPagingServer,
      

    } = this.props;
    const {isGettingData, isFirstloading,rows,currentPage,rowCount, isPaging}=this.state;
    const isShowLoading=   showLoading===undefined  ? isGettingData:showLoading;
      const pageSize=this.props.pageSize || this.state.pageSize
  
    return (
            <> {
              IsPagingServer
              ?   <BoxLoading number={numberLoading || 3} show={isFirstloading}>
                        <DataGrid
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => {
                            this.setState({pageSize:newPageSize});
                           
                        }}
                        rowsPerPageOptions={[5,10, 20]}

                        loading={isPaging}
                        rowCount={rowCount}
                        page={currentPage}
                        paginationMode="server"
                        onPageChange={(newPage) => {this.pageChange(newPage)} }
                        pagination

                        {...this.props}
                        rows={rows} //important below ...this.props
                        />
                    </BoxLoading>
              :   <BoxLoading number={numberLoading || 3} show={isFirstloading}>
                      <DataGrid
                     
                      pageSize={pageSize}
                      onPageSizeChange={(newPageSize) => this.setState({pageSize:newPageSize})}
                      rowsPerPageOptions={[10,20, 50]}
                      pagination
                      {...this.props}
                      rows={rows} //important below ...this.props
                      />
                  </BoxLoading>

            }
              
          </>
    );
  }
}

export default React.forwardRef((props, ref) => {

  var  refreshGrid_2=()=>{}
  var  search_2=()=>{}
  var  addNewRow_2=()=>{}
  var  updateRow_2=()=>{}

  useImperativeHandle(ref, () => ({

    refreshGrid() {
      return refreshGrid_2();
    },

    search(data){
      search_2(data)
    },
    addNewRow(dataRow) {
        addNewRow_2(dataRow);
    },
    updateRow(dataRow) {
      updateRow_2(dataRow);
  }

  }));

return <DataTable 
  setTrigger={ funcObj=> {
    refreshGrid_2=funcObj.refreshGrid;
  search_2=funcObj.search;
  addNewRow_2=funcObj.addNewRow;
  updateRow_2=funcObj.updateRow;
  }} rows={[]}   {...props}
/>});
