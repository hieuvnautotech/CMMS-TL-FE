import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import { DataGrid } from '@mui/x-data-grid';
import {  api_get,api_post,  AlertSuccess,ErrorAlert } from '@utils';
import {useModal,SelectBox,ButtonAsync,BoxLoading} from '@basesShared';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MapFormToModelDataOnlyFile } from '@windsn/helperjs/common/data';
import Grid from '@mui/material/Grid';
import { number } from 'prop-types';
export default function Type() {
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'type_name',
          headerName: 'Type name',
          type: number,
          width: 150,
        },
        {
          field:'use_string',
          headerName: 'Active',
          width: 150,
        },
      
        {
          field: 'edit',
          headerName: 'Edit',
          width: 150,
          disableClickEventBubbling: true,
          renderCell: (params) => {
              return (
                      <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={()=>editrow(params)}
                      >
                         Edit
                      </Button>
              )
          },
          
          },
      
          {
              field: 'delete',
              headerName: 'Delete',
             
              width: 150,
              disableClickEventBubbling: true,
              renderCell: (params) => {
                  return (
                   
                          <Button
                              variant="contained"
                              color="error"
                              size="small"
                             // style={{ marginLeft: 16 }}
                              onClick={() => deleterow(params)}
                          >
                             Delete
                          </Button>
                     
                  )
              },
          }
      ];
      const [tableData, setTableData] = useState([])
      const {isShowing, toggle} = useModal();
      const [mode, setMode] = useState("add")
      const [rowdata, setRowData] = useState({})
      const [searchName, setSearchName] = useState('');

      const [showLoading, setshowLoading] = useState(true);
      useEffect(() => {
        api_get("TypeApi/type_search").then((data) => {
          console.log(data)
            setTableData(data);
            setshowLoading(false);
        }) 
      }, [])

    const  addnew =()=>{
      setMode("add")
        setRowData({})
        toggle();
    }

    const  editrow =(params)=>{
         
        var row_data=params.row;
        setMode("edit")
        setRowData(row_data)
        toggle();

     }
     const  deleterow =(params)=>{
       if (window.confirm("You may want to delete??")) {
        
        var row_data=params.row;
        console.log(row_data)    
        
        //reload table
        api_post("TypeApi/delete-type",row_data).then((data) => {
            //reload grid
            api_get("TypeApi").then((data) => setTableData(data))
        })
       }

  }
   const search =()=>{
      //reload table
     return api_get("TypeApi/type_search",{search_name:searchName }).then((data) =>  setTableData(data))
  }


  const  refreshTable =()=>{
    //reload table
    api_get("TypeApi/type_search").then((data) => {

      setTableData(data);
      AlertSuccess('save success')
    })
}
    return (
        <Box sx={{ pb:5, height: 350, width: '100%' }}>
              <Grid 
                 container
                 direction="row"
                 justifyContent="space-between"
                 alignItems="center"
                 
              >
                <Grid item >
                <Button variant="contained" color="success" sx={{ boxShadow: 1, borderRadius: 2,mb: 1, }}  onClick={addnew} >Add new</Button>
                </Grid>
                <Grid item >  
                <TextField  label="Search name" variant="standard" onChange={e=>  setSearchName(e.target.value)}  sx={{ borderRadius: 2,mb: 1, }}/>
                <ButtonAsync variant="contained" color="primary" sx={{ mx:3, boxShadow: 1,mb: -4,  }}  onClick={search}  icon="search"  text="Search" />
                </Grid>
         </Grid>
     
        <BoxLoading number={3} show={showLoading} >
        <DataGrid
                rows={tableData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                
                
              />
        </BoxLoading>
   
    <Modal_Type
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowdata}
        refreshTable={refreshTable}
      />


        </Box>
      );

}
const Modal_Type = ({ isShowing, hide, mode,data ,refreshTable}) => {

    const [info, setInfo] = useState({h:0});
    useEffect(() => {

        let title=""
      if(data.use===false)  title="Dont use"
      else  title="Use"
      const newdata={...data,status_selected : {title: title, value:data.use}  }
      setInfo(newdata); 
  }, [data]);
    const handleSave=()=>{     
        //post data len server xu ly save      
      return  api_post("TypeApi/add-update-type",info).then(res=>{
         
              //reload table   
              refreshTable();
              //close modal
              hide();
        });
      
      
    }
      return isShowing ? ReactDOM.createPortal(
        <React.Fragment>
           <div>
         <Dialog open={true}  maxWidth={'sm'}  fullWidth={true} >
           <DialogTitle>{mode=="add"?"ADD NEW":"EDIT"}</DialogTitle>
           <DialogContent>
             <TextField
               autoFocus
               required
               margin="dense"
               label="Type name"
               onChange={e => setInfo({...info,type_name:e.target.value})} 
               fullWidth
               defaultValue={info.type_name}
             />
             <FormControl fullWidth>
                <SelectBox 
                    placeholder="status"
                    url="TypeApi/get-select-data-active"
                    onChange={item_elected=> {
                      console.log(item_elected)
                      setInfo({...info,use:item_elected.value})
                    }} 
                    defaultValue={info.status_selected}
                >

                </SelectBox>
            </FormControl>
           </DialogContent>
           <DialogActions>
             <Button onClick={hide} >Cancel</Button>
             <ButtonAsync onClick={handleSave}  icon="save"  text="Save" />
            
           </DialogActions>
         </Dialog>
       </div>
        </React.Fragment>, document.body
      ) : null; 
} 