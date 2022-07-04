import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { api_get, api_post, AlertSuccess, ErrorAlert } from "@utils";
import { useModal, SelectBox, ButtonAsync, DataTable } from "@basesShared";
import { Grid, TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Checkbox } from "@mui/material"
import { sendMessage } from "@microsoft/signalr/dist/esm/Utils";

export default function Role() {
  const [mode, setMode] = useState("add");
  const [rowData, setRowData] = useState({});
  const { isShowing, toggle } = useModal();
  const [searchName, setSearchName] = useState("");
  const gridRef = useRef();

  //Functions
  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "lastTime", headerName: "Last Time", width: 250, },
    { field: "account", headerName: "Account", width: 250,},
    { field: "name", headerName: "Name", width: 250 },
    { field: "lastLoginIp", headerName: "LastLoginIp", width: 250 },
    {
      field: "sendmessage",
      headerName: "",
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => sendMessage(params)}
          >
            Send Message
          </Button>
        );
      },
    },
    {
      field: "ForceLogout",
      headerName: "",
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="warning"
            size="small"
          //  onClick={() => deleterow(params)}
          >
            Force Logout
          </Button>
        );
      },
    },
    {
      field: "Lock1",
      headerName: "",
      width: 220,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="error"
            size="small"
          //  onClick={() => deleterow(params)}
          >
            Lock account this Ip
          </Button>
        );
      },
    },
    {
      field: "Lock2",
      headerName: "",
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="error"
            size="small"
          //  onClick={() => deleterow(params)}
          >
            Lock account
          </Button>
        );
      },
    },


  ];

//   const addNewRole = () => {
//     setMode("add");
//     toggle();
//     setRowData({});
//   };

//   const searchRoles = () => {
//     gridRef.current.search({ search_name: searchName });
//   };

//   const editrow = (params) => {
//     var row_data = params.row;
//     setMode("edit");
//     setRowData(row_data);
//     toggle();
//   };

//   const deleterow = (params) => {
//     if (window.confirm("Delete the item?")) {
//       api_post("sysRoleaApi/delete", params.row).then(() => {
//         refreshTable();
//       });
//     }
//   };

//   const refreshTable = () => {
//     gridRef.current.refreshGrid().then(() => AlertSuccess("save success"));
//   };

const sendMessage= (params) => {
    var row_data = params.row;
    console.log(row_data)
          api_post("sysOnlineUserApi/send-message-user", {UserId:row_data.userId,
            Ip:row_data.lastLoginIp,
            Message:{title:'mr Toan', content:'hello'}})
 .then(() => {
       
      });
}


  return (
    <>
      <Box sx={{ pb: 5, height: "500px", width: "100%" }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* <Grid item>
            <Button
              variant="contained"
              color="success"
              sx={{ boxShadow: 1, borderRadius: 2, mb: 1 }}
              onClick={addNewRole}
            >
              Add new
            </Button>
          </Grid> */}
          {/* <Grid item>
            <TextField
              label="Search name"
              variant="standard"
              onChange={(e) => setSearchName(e.target.value)}
              sx={{ borderRadius: 2, mb: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mx: 3, boxShadow: 1, mb: -4 }}
              onClick={searchRoles}
            >
              Search
            </Button>
          </Grid> */}
        </Grid> 

        <DataTable
          ref={gridRef}
          url="sysOnlineUserApi/get-list-online-user"
          columns={columns}
         
        />

       


        {/* <Modal_Role
          isShowing={isShowing}
          hide={toggle}
          mode={mode}
          data={rowData}
          refreshTable={refreshTable}
        /> */}
      </Box>
    </>   
  )
}

// const Modal_Role = ({ isShowing, hide, mode, data, refreshTable }) => {
//   const [info, setInfo] = useState({});

//   useEffect(() => {
//     setInfo(data);
//   }, [data]);

//   const handleSave = () => {
//     return api_post("sysRoleaApi/add-update", info).then((res) => {
//       refreshTable();
//       hide();
//     });
//   };

//   return isShowing
//     ? ReactDOM.createPortal(
//       <React.Fragment>
//         <div>
//           <Dialog open={true} maxWidth={"sm"} fullWidth={true}>
//             <DialogTitle>{mode == "add" ? "ADD NEW" : "EDIT"}</DialogTitle>
//             <DialogContent>
//               <TextField
//                 autoFocus
//                 required={true}
//                 margin="dense"
//                 id="name"
//                 label="Role Name"
//                 onChange={(e) =>
//                   setInfo({ ...info, name: e.target.value })
//                 }
//                 fullWidth
//                 defaultValue={data.name}
//               />

//               <TextField
//                 margin="dense"
//                 id="remark"
//                 label="Remark"
//                 onChange={(e) =>
//                   setInfo({ ...info, remark: e.target.value })
//                 }
//                 fullWidth
//                 defaultValue={data.remark}
//               />

//             </DialogContent>
//             <DialogActions sx={{ display: "block" }}>
//               <FormControlLabel sx={{ margin: "0 0 0 4px" }}
//                 label="Use"
//                 control={
//                   <Checkbox
//                     defaultChecked={mode == "add" ? true : data.active}
//                     onChange={(e) => {
//                       setInfo({ ...info, active: e.target.checked });
//                     }} />} />
//               <div style={{ float: "right" }}>
//                 <Button onClick={hide}>Cancel</Button>
//                 <ButtonAsync sx={{ marginLeft: "8px", marginRight: "15px" }} onClick={handleSave} icon="save" text="Save" />
//               </div>
//             </DialogActions>
//           </Dialog>
//         </div>
//       </React.Fragment>,
//       document.body
//     )
//     : null;
//};
