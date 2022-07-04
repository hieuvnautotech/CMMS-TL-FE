import React, { useState, useEffect,useRef } from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import { api_post,  AlertSuccess } from '@utils';
import {useModal,SelectBox,ButtonAsync,DataTable} from '@basesShared';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { number } from 'prop-types';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Input } from '@mui/material';
import ImageList from '@mui/material/ImageList'


export default function Part() {
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'part_code',
          headerName: 'Part Code',
          width: 150,
        },
        {
          field:'part_name',
          headerName: 'Part Name',
          width: 150,
        },
        {
          field:'spec',
          headerName: 'Spec',
          type: number,
          width: 150,
        },
      
        {
          field:'type_name',
          headerName: 'Part Name',
          width: 150,
        },
        {
          field:'location_name',
          headerName: 'Part Location',
          width: 250,
        },
        {
          field:'price',
          headerName: 'Part Price',
          type: number,
          width: 250,
        },
        // {
        //   show: false,
        //   field:'price',
        //   headerName: 'Price',
        //   type: number,
        //   hidden: true,
        //   width: 250,
        // },
        {
          field:'unit',
          headerName: 'Part Unit',
          width: 250,
        },
        {
          field:'manufacturer_name',
          headerName: 'Manufacturer Name',
          width: 250,
        },
        {
          field:'remark',
          headerName: 'Remark',
          width: 250,
        },
        {
          field:'create_at_fomat',
          headerName: 'Created At',
          width: 250,
        },
        {
          field:'image_url',
          headerName: 'Image Url',
          width: 250,
        },
        {
          field:'',
          headerName: 'Level',
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
      const Input = styled('input')({
        display: 'none',
      });
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

        setRowData(row_data)
        toggle();

     }
     const deleterow = (params) => {
      if (window.confirm("Delete the item??")) {
        var row_data = params.row;    
        console.log(row_data)  
        //reload table
        api_post("PartApi/Part_delete", row_data).then((data) => {
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
        <Box sx={{ pb:10, height: 750, width: '100%' }}>
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
          url="PartApi/Part_search"
          columns={columns} />
    <Modal_Part
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowdata}
        refreshTable={refreshTable}
      />
        </Box>
      );

}
const Modal_Part= ({ isShowing, hide, mode,data ,refreshTable}) => {
    const [info, setInfo] = useState([]);
    useEffect(() => {
        let title=""
      if(data.use===false)  title="Dont use"
      else  title="Use"    

      const newdata={...data,status_selected : {title: title, value:data.use}  }
      setInfo(newdata); 
  }, [data]);

    const handleSave=()=>{ 
        //post data len server xu ly save      
      return  api_post("PartApi/add-update-Part",info).then(res=>{
        console.log(info)
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
             //đầu
               margin="dense"
               label="Part Code"
               onChange={e => setInfo({...info,part_code:e.target.value})} 
               fullWidth
               disabled
               defaultValue={info.part_code}
               InputProps={{
                readOnly: true,
              }}
              variant="filled"
             />
             <TextField
             //đầu
               autoFocus
               required
               margin="dense"
               label="Part Name"
               onChange={e => setInfo({...info,part_name:e.target.value})} 
               fullWidth
               defaultValue={info.part_name}
             />
             
               <TextField
               required
               margin="dense"
               id="spec"
               type="number"
               label="Spec"
              
               onChange={e => setInfo({...info,spec:e.target.value})} 
               sx={ { m: 1, width:250 }} 
               defaultValue={info.spec}
             />
              <TextField
               required
               margin="dense"
               id="price"
               label="Price"
              type="number"
               onChange={e => setInfo({...info,price:e.target.value})} 
               sx={ { m: 1, width:250 }} 
               defaultValue={info.price}
             />
              <FormControl margin="dense" sx={ { m: 1, width:250 }} >
                <SelectBox 
                    placeholder="Location"
                    id="location_name"
                    url="PartApi/get-all-location"
                    onChange={item_elected=> {
                      setInfo({...info,location_id:item_elected.value})
                    }}                    
                    defaultValue={{title:info.location_name, value:info.location_id}}
                >
                </SelectBox>
            </FormControl>
            <FormControl margin="dense" sx={ { m: 1, width:250 }} >
                <SelectBox 
                    placeholder="Manufacturer Name"
                    id="manufacturer_id"
                    url="PartApi/get-all-Manufacturer"
                    onChange={item_elected=> {
                      setInfo({...info,manufacturer_id:item_elected.value})
                    }} 
                   
                    defaultValue={{title:info.manufacturer_name, value: info.manufacturer_id}}
                >
                </SelectBox>  
            </FormControl>
            <FormControl margin="dense" sx={ { m: 1, width:250 }} >
                <SelectBox 
             
                    placeholder="Type"
                    id="type_id"
                    url="PartApi/get-all-type"
                    onChange={item_elected=> {              
                      setInfo({...info,type_id:item_elected.value})
                    }} 
                    fullWidth
                    defaultValue={{title:info.type_name,value:info.type_id}}                
                >
                </SelectBox>
            </FormControl>

            <TextField
             sx={ { m: 1, width:250 }}
               margin="dense"
               id="unit"
               label="Unit"
               onChange={e => setInfo({...info,unit:e.target.value})} 
              fullWidth
               defaultValue={info.unit}
             />
              <Stack direction="row" alignItems="center" spacing={2}>
                <label htmlFor="icon-button-file">
                  <Input accept="image/*" id="icon-button-file" type="file"   onChange={e => setInfo({...info,image:e.target.files[0]})}    />
               
                </label>
              </Stack>

              <ImageList sx={{ width: 200, height:200 }} cols={3} rowHeight={30}>
              <img width="210" height="210"  src={"https://images.unsplash.com/photo-1533827432537-70133748f5c8"} />
              </ImageList>
         
             <TextField
               margin="dense"
               id="remark"
               label="Remark"
               onChange={e => setInfo({...info,remark:e.target.value})} 
               fullWidth
               defaultValue={info.remark}
             />
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
