import React, { useState, useEffect,useRef } from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import {  api_get,api_post,  AlertSuccess,ErrorAlert } from '@utils';
import {useModal,SelectBox,ButtonAsync,BoxLoading,DataTable} from '@basesShared';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { number } from 'prop-types';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
export default function Issue() {
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'issue_name',
          headerName: 'Issue Name',
          type: number,
          width: 250,
        },
        {
          field:'description',
          headerName: 'Description',
          width: 200,
        },
        // {
        //   field:'use_string',
        //   headerName: 'Active',
        //   width: 150,
        // },
      
        {
          field:'type_name',
          headerName: 'Type Name',
          width: 200,
        },
        {
          field:'created_at_format',
          headerName: 'Created At',
          width: 250,
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
      const {isShowing,toggle} = useModal();
      const [mode, setMode] = useState("add")
      const [rowdata, setRowData] = useState({})
      const gridRef = useRef();
      const [searchName, setSearchName] = useState('');
      const [showLoading, setshowLoading] = useState(true);
     
      const addnew = () => {
        setMode("add")
        setRowData({use: true})
        toggle();
      }

    const  editrow =(params)=>{
         
        var row_data=params.row;
        setMode("edit")
       console.log(row_data)
        setRowData(row_data)
        toggle();

     }
     const deleterow = (params) => {
         if (window.confirm("You may want to delete??")) {

           var row_data = params.row;
          
           //reload table
           api_post("IssueApi/Issue_delete", row_data).then((data) => {
             //reload grid
          gridRef.current.refreshGrid().then(data=>  {
              AlertSuccess("Delete success")
             }) 
           })
         }

  }
   const search =()=>{
      //reload table
     return gridRef.current.search({ search_name: searchName }); 
  }


  const  refreshTable =()=>{
    //reload table
    gridRef.current.refreshGrid().then(data=>  {
      AlertSuccess("Save success")
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
        <DataTable 
          ref={gridRef}
          url="IssueApi/Issue_search"
          columns={columns} />
      
   
    <Modal_Issue
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowdata}
        refreshTable={refreshTable}
      />
        </Box>
      );

}
const Input = styled('input')({
  display: 'none',
});
const Modal_Issue= ({ isShowing, hide, mode,data ,refreshTable}) => {

    const [info, setInfo] = useState([]);
    useEffect(() => {
        let title=""
      if(data.use===false)  title="Dont use"
      else  title="Use"
      
      const newdata={...data,status_selected : {title: title, value:data.use}  }

      console.log(data)
      setInfo(newdata); 
  }, [data]);
    const handleSave=()=>{   
    
        //post data len server xu ly save      
      return  api_post("IssueApi/add-update-Issue",info).then(res=>{
              //reload table   
              console.log(info)
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
             //đầu
               autoFocus
               required
               margin="dense"
               label="Issue Name"
               onChange={e => setInfo({...info,issue_name:e.target.value})} 
               fullWidth
               defaultValue={data.issue_name}
             />
              <TextField
               
               required
               margin="dense"
               label="Description"
               onChange={e => setInfo({...info,description:e.target.value})} 
               fullWidth
               defaultValue={info.description}
             />
             
             <FormControl margin="dense" fullWidth>
                <SelectBox 
                    placeholder="Status"
                    id="use"
                    url="IssueApi/get-select-data-active"
                    onChange={item_elected=> {
                      setInfo({...info,use:item_elected.value})
                    }} 
                    fullWidth
                    defaultValue={info.status_selected}
                >
                </SelectBox>
            </FormControl>
            <FormControl margin="dense" fullWidth>
                <SelectBox 
                    placeholder="Type"
                    url="IssueApi/get-all-types"
                    onChange={item_elected=> {              
                      setInfo({...info,type_id:item_elected.value})
                    }} 
                    defaultValue={{title:data.type_name,value:data.type_id}}                
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