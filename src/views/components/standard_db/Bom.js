import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import { api_post, AlertSuccess } from "@utils";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import ImageUploading from "react-images-uploading";
import {
  useModal,
  SelectBox,
  ButtonAsync,
  DataTable,
  useModal2,
} from "@basesShared";
import Grid from "@mui/material/Grid";
import { api_get } from "@utils";
export default function WorkingOrder() {
  const [mode, setMode] = useState("add");
  const [rowData, setRowData] = useState({});
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [searchBom, setSearchBom] = useState("");
  const gridRef = useRef();
  const columns = [
    { field: "bom_id", headerName: "ID", width: 90 },
    {
      field: "bom_code",
      headerName: "Bom Code",
      width: 150,
    },
    {
      field: "equipment_code",
      headerName: "Equipment Code",
      width: 150,
      editable: false,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={() => readRow(params)}
          >
            {params.row.equipment_code}
          </Button>
        );
      },
    },
    {
      field: "bom_created_at",
      headerName: "Bom Create At",
      width: 150,
      editable: false,
    },

    {
      field: "bom_created_by",
      headerName: "Bom Create By",
      width: 150,
      editable: false,
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => editRow(params)}
          >
            Edit
          </Button>
        );
      },
    },

    {
      field: "delete",
      headerName: "Delete",

      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => deleteRow(params)}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const addNew = () => {
    setMode("add");
    setRowData({});
    toggle();
  };

  const editRow = (params) => {
    var row_data = params.row;
    setMode("edit");
    setRowData(row_data);
    toggle();
  };
  const readRow = (params) => {
    var row_data = params.row;
    setRowData(row_data);
    toggle2();
  };
  const deleteRow = (params) => {
    if (window.confirm("Delete the item?")) {
      api_post("BomApi/delete", params.row).then(() => {
        refreshTable();
      });
    }
  };

  const search = () => {
    gridRef.current.search({
      bom_code: searchBom,
    });
  };

  const refreshTable = () => {
    gridRef.current.refreshGrid().then(() => AlertSuccess("save success"));
  };

  return (
    <Box sx={{ pb: 5, height: 350, width: "100%" }}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Button
            variant="contained"
            color="success"
            sx={{ boxShadow: 1, borderRadius: 2, mb: 1 }}
            onClick={addNew}
          >
            Add new
          </Button>
        </Grid>
        <Grid item>
          <TextField
            label="Search Bom #"
            variant="standard"
            onChange={(e) => setSearchBom(e.target.value)}
            sx={{ borderRadius: 2, mb: 1, mr: 3 }}
          />
          <ButtonAsync
            variant="contained"
            color="primary"
            sx={{ mx: 3, boxShadow: 1, mb: -4 }}
            onClick={search}
            icon="search"
            text="Search"
          />
        </Grid>
      </Grid>
      <DataTable
        ref={gridRef}
        url="BomApi"
        columns={columns}
        getRowId={(rows) => rows.bom_id}
      />
      <Modal_Bom
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowData}
        refreshTable={refreshTable}
      />
      <Modal_Equipment_Bom
        isShowing={isShowing2}
        hide={toggle2}
        data={rowData}
        refreshTable={refreshTable}
      />
    </Box>
  );
}
const Modal_Equipment_Bom = ({ isShowing, hide, data, refreshTable }) => {
  const [info, setInfo] = useState({ h: 0 });
  const [parts, setParts] = useState([]);
  const [partCollection, setPartCollection] = useState([]);
  useEffect(() => {
    api_get("EquipmentApi/get-part").then((data) => {
      setParts(data);
    });
    api_post("EquipmentApi/get-part-id", data).then((data) => {
      setPartCollection(data);
    });
    setInfo(data);
  }, [data]);
  const findParts = () => {
    let res = "";
    for (let i = 0; i < partCollection.length; i++) {
      res += partCollection[i].title + ", ";
    }
    return `${res.slice(0, res.length - 2)}`;
  };
  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div>
            <Dialog open={true} maxWidth={"sm"} fullWidth={true}>
              <DialogTitle>Equipment</DialogTitle>
              <DialogContent>
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  id="equipment_name"
                  label="Equipment Name"
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.equipment_name}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Status"
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.status}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Equipment Value"
                  defaultValue={info.equipment_value}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Serial Number"
                  defaultValue={info.serial_number}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Price"
                  defaultValue={info.price}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Made Date"
                  defaultValue={info.made_date}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Install Date"
                  defaultValue={info.install_date}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Created At"
                  defaultValue={info.created_at}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Remark"
                  defaultValue={info.remark}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Created By"
                  defaultValue={info.created_by}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Level"
                  defaultValue={info.level}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Use"
                  defaultValue={info.use ? "Use" : "Not Use"}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Location"
                  defaultValue={info.location}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Manufacturer"
                  defaultValue={info.manufacturer}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Supplier"
                  defaultValue={info.supplier}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Type"
                  defaultValue={info.type}
                  style={{ width: 260, marginLeft: 5 }}
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="dense"
                  label="Parts"
                  value={findParts()}
                  style={{ width: 525, marginLeft: 5 }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={hide}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};
const Modal_Bom = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({ h: 0 });
  const [imageList, setImages] = useState([]);
  useEffect(() => {
    setInfo(data);
  }, [data]);
  const handleSave = () => {
    return api_post("BomApi/add-update", info).then((res) => {
      refreshTable();
      hide();
    });
  };
  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div>
            <Dialog open={true} maxWidth={"sm"} fullWidth={true}>
              <DialogTitle>{mode == "add" ? "ADD NEW" : "EDIT"}</DialogTitle>
              <DialogContent>
                <FormControl margin="dense" fullWidth>
                  <SelectBox
                    placeholder="Equipment Code"
                    url="ShippingOrder/get-equipment"
                    defaultValue={{
                      title: data.equipment_code,
                      value: data.equipment_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, equipment_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <TextField
                  required
                  margin="dense"
                  id="bom_created_by"
                  label="Bom Create By"
                  onChange={(e) =>
                    setInfo({ ...info, bom_created_by: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.bom_created_by}
                />
                <Grid style={{ marginRight: "15px" }}>
                  <ImageUploading
                    value={imageList}
                    onChange={(imageList, addUpdateIndex) =>
                      setImages(imageList)
                    }
                    maxNumber={69}
                    dataURLKey="data_url"
                  >
                    {({
                      imageList,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                    }) => (
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <Grid sx={{ mt: 2 }}>
                            <button
                              style={isDragging ? { color: "red",width:110} : {width:110}}
                              onClick={onImageUpdate}
                              {...dragProps}
                            >
                              Update
                            </button>
                          </Grid>

                          <Grid sx={{ mt: 2 }}>
                            <button
                              style={{width:110}}
                              onClick={onImageRemove}
                              hidden={imageList.length == 0 ? true : false}
                            >
                              Remove
                            </button>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          {imageList.map((image, index) => (
                            <Grid key={index} sx={{ mt: 2 }}>
                              <img
                                src={image.data_url}
                                alt=""
                                width="400"
                                height="400"
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    )}
                  </ImageUploading>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={hide}>Cancel</Button>
                <ButtonAsync onClick={handleSave} icon="save" text="Save" />
              </DialogActions>
            </Dialog>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};
