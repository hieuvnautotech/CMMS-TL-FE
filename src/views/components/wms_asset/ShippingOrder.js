import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import { api_get, api_post, AlertSuccess, ErrorAlert } from "@utils";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import { useModal, useModal2, SelectBox, ButtonAsync, DataTable } from "@basesShared";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
export default function ShippingOrder() {
  const [mode, setMode] = useState("add");
  const [rowDataMaster, setRowDataMaster] = useState({});
  const [rowDataDetail, setRowDataDetail] = useState({});
  const { isShowing, toggle } = useModal();

  const { isShowing2, toggle2 } = useModal2();

  const [searchSO, setSearchSO] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEquipment, setSearchEquipment] = useState("");

  const gridRefMaster = useRef();
  const gridRefDetail = useRef();

  const columns_master = [
    { field: "shipping_id", headerName: "ID", width: 90 },
    {
      field: "shipping_name",
      headerName: "Shipping Name",
      width: 150,
    },
    {
      field: "so",
      headerName: "SO",
      width: 150,
      editable: false,
    },
    {
      field: "etd_fomat",
      headerName: "Etd",
      width: 200,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      editable: false,
    },
    {
      field: "reg_date_fomat",
      headerName: "Reg Date",
      width: 200,
      editable: false,
    },
    {
      field: "location_name",
      headerName: "Location Name",
      width: 150,
      editable: false,
    },
    {
      field: "remark",
      headerName: "Remark",
      width: 150,
      editable: false,
    },
    {
      field: "created_by",
      headerName: "Created By",
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
            onClick={() => editRowMaster(params)}
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
            onClick={() => deleteRowMaster(params)}
          >
            Delete
          </Button>
        );
      },
    },
  ];
  const columns_detail = [
    { field: "shipping_order_id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "shipping_name",
      headerName: "Shipping Name",
      width: 150,
      editable: false,
    },
    {
      field: "part_name",
      headerName: "Part Name",
      width: 150,
      editable: false,
    },
    {
      field: "unit_name",
      headerName: "Unit Name",
      width: 150,
      editable: false,
    },
    {
      field: "location_name",
      headerName: "Location Name",
      width: 150,
      editable: false,
    },
    {
      field: "equipment_code",
      headerName: "Equipment Code",
      width: 150,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      editable: false,
    },
    {
      field: "so_qty",
      headerName: "So Qty",
      width: 150,
      editable: false,
    },
    {
      field: "shipped_qty",
      headerName: "Shipped Qty",
      width: 150,
      editable: false,
    },
    //{
    //   field: "created_by",
    //   headerName: "Created By",
    //   width: 150,
    //   editable: false,
    // },
    {
      field: "created_at_fomat",
      headerName: "Created At",
      width: 200,
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
            onClick={() => editRowDetail(params)}
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
            onClick={() => deleteRowDetail(params)}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const addNewMaster = () => {
    setMode("add");
    setRowDataMaster({});
    toggle();
  };
  const addNewDetail = () => {
    setMode("add");
    setRowDataDetail({});
    toggle2();
  };

  const editRowMaster = (params) => {
    var row_data = params.row;
    setMode("edit");
    setRowDataMaster(row_data);
    toggle();
  };
  const editRowDetail = (params) => {
    var row_data = params.row;
    setMode("edit");
    setRowDataDetail(row_data);
    toggle2();
  };

  const deleteRowMaster = (params) => {
    if (window.confirm("Delete the item?")) {
      api_post("ShippingOrder/delete-master", params.row).then(() => {
        refreshTable();
      });
    }
  };
  const deleteRowDetail = (params) => {
    if (window.confirm("Delete the item?")) {
      api_post("ShippingOrder/delete-detail", params.row).then(() => {
        refreshTableDetail();
      });
    }
  };

  const refreshTable = () => {
    gridRefMaster.current
      .refreshGrid()
      .then(() => AlertSuccess("save success"));
  };

  const refreshTableDetail = () => {
    gridRefDetail.current
      .refreshGrid()
      .then(() => AlertSuccess("save success"));
  };

  const searchMaster = () => {
    gridRefMaster.current.search({ so: searchSO });
  };

  const searchDetail = () => {
    gridRefDetail.current.search({
      equipment: searchEquipment,
      name: searchName,
    });
  };

  return (
    <>
      <Box sx={{ pb: 5, height: 450, width: "100%" }}>
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
              onClick={addNewMaster}
            >
              Add Master
            </Button>
          </Grid>
          <Grid item>
            <TextField
              label="Search SO"
              variant="standard"
              onChange={(e) => setSearchSO(e.target.value)}
              sx={{ borderRadius: 2, mb: 1 }}
            />
            <ButtonAsync
              variant="contained"
              color="primary"
              sx={{ mx: 3, boxShadow: 1, mb: -4 }}
              onClick={searchMaster}
              icon ="search"
              text = "Search"
            />
          </Grid>
        </Grid>

        <DataTable
          ref={gridRefMaster}
          url="ShippingOrder/master"
          columns={columns_master}
          getRowId={(rows) => rows.shipping_id}
        />

        <Modal_Master
          isShowing={isShowing}
          hide={toggle}
          mode={mode}
          data={rowDataMaster}
          refreshTable={refreshTable}
        />
      </Box>

      <Box sx={{ pb: 5, height: 450, width: "100%", mt: 5 }}>
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
              onClick={addNewDetail}
            >
              Add Detail
            </Button>
          </Grid>
          <Grid item>
            <TextField
              label="Search Equipment"
              variant="standard"
              onChange={(e) => setSearchEquipment(e.target.value)}
              sx={{ borderRadius: 2, mb: 1 , mr: 3 }}
            />
            <TextField
              label="Search Name"
              variant="standard"
              onChange={(e) => setSearchName(e.target.value)}
              sx={{ borderRadius: 2, mb: 1 }}
            />
            <ButtonAsync
              variant="contained"
              color="primary"
              sx={{ mx: 3, boxShadow: 1, mb: -4 }}
              onClick={searchDetail}
              icon ="search"
              text = "Search"
            />
          </Grid>
        </Grid>

        <DataTable
          ref={gridRefDetail}
          url="ShippingOrder/detail"
          columns={columns_detail}
          getRowId={(rows) => rows.shipping_order_id}
        />

        <Modal_Detail
          isShowing={isShowing2}
          hide={toggle2}
          mode={mode}
          data={rowDataDetail}
          refreshTable={refreshTableDetail}
        />
      </Box>
    </>
  );
}

const Modal_Master = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({ h: 0 });
  useEffect(() => {
    setInfo(data);
  }, [data]);
  const handleSave = () => {
    return api_post("ShippingOrder/add-update-master", info).then((res) => {
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
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="shipping_name"
                  label="Shipping Name"
                  onChange={(e) =>
                    setInfo({ ...info, shipping_name: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.shipping_name}
                />
                <TextField
                  required
                  margin="dense"
                  id="so"
                  label="SO"
                  onChange={(e) => setInfo({ ...info, so: e.target.value })}
                  fullWidth
                  defaultValue={info.so}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Etd"
                    value={info.etd ? info.etd : null}
                    onChange={(newValueEtd) => {
                      setInfo({ ...info, etd: newValueEtd });
                    }}
                    renderInput={(params) => <TextField margin="dense" fullWidth {...params} />}
                  />
                </LocalizationProvider>
                <TextField
                  required
                  margin="dense"
                  id="status"
                  label="Status"
                  onChange={(e) => setInfo({ ...info, status: e.target.value })}
                  fullWidth
                  defaultValue={info.status}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Reg Date"
                    value={info.reg_date ? info.reg_date : null}
                    onChange={(newValue) => {
                      setInfo({ ...info, reg_date: newValue });
                    }}
                    renderInput={(params) => <TextField margin="dense" fullWidth {...params} />}
                  />
                </LocalizationProvider>
                <FormControl margin="dense" fullWidth>
                  <SelectBox
                    placeholder="Location"
                    url="ShippingOrder/get-location"
                    defaultValue={{
                      title: data.location_name,
                      value: data.location_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, location_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>

                <TextField
                  margin="dense"
                  id="remark"
                  label="Remark"
                  required
                  onChange={(e) => setInfo({ ...info, remark: e.target.value })}
                  fullWidth
                  defaultValue={info.remark}
                />
                <TextField
                  margin="dense"
                  id="created_by"
                  label="Created By"
                  required
                  onChange={(e) =>
                    setInfo({ ...info, created_by: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.created_by}
                />
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

const Modal_Detail = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({ h: 0 });
  useEffect(() => {
    console.log(data);
    setInfo(data);
  }, [data]);
  const handleSaveDetail = () => {
    return api_post("ShippingOrder/add-update-detail", info).then((res) => {
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
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  label="Name"
                  onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  fullWidth
                  defaultValue={info.name}
                />
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
                <FormControl margin="dense" fullWidth>
                  <SelectBox
                    placeholder="Part"
                    url="ShippingOrder/get-part"
                    defaultValue={{
                      title: data.part_name,
                      value: data.part_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, part_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <FormControl margin="dense" fullWidth>
                  <SelectBox
                    placeholder="Location"
                    url="ShippingOrder/get-location"
                    defaultValue={{
                      title: data.location_name,
                      value: data.location_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, location_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <FormControl margin="dense" fullWidth>
                  <SelectBox
                    placeholder="Unit"
                    url="ShippingOrder/get-unit"
                    defaultValue={{
                      title: data.unit_name,
                      value: data.unit_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, unit_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <FormControl margin="dense" fullWidth>
                  <SelectBox
                    placeholder="Shipping"
                    url="ShippingOrder/get-shipping"
                    defaultValue={{
                      title: data.shipping_name,
                      value: data.shipping_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, shipping_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <TextField
                  required
                  margin="dense"
                  id="shipped_qty"
                  label="Shipped Qty"
                  onChange={(e) =>
                    setInfo({ ...info, shipped_qty: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.shipped_qty}
                />
                <TextField
                  required
                  margin="dense"
                  id="so_qty"
                  label="Qty"
                  onChange={(e) => setInfo({ ...info, so_qty: e.target.value })}
                  fullWidth
                  defaultValue={info.so_qty}
                />
                <TextField
                  required
                  margin="dense"
                  id="status"
                  label="Status"
                  onChange={(e) => setInfo({ ...info, status: e.target.value })}
                  fullWidth
                  defaultValue={info.status}
                />
                {/* <TextField
                  margin="dense"
                  id="created_by"
                  label="Created By"
                  required
                  onChange={(e) =>
                    setInfo({ ...info, created_by: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.created_by}
                /> */}
              </DialogContent>
              <DialogActions>
                <Button onClick={hide}>Cancel</Button>
                <ButtonAsync
                  onClick={handleSaveDetail}
                  icon="save"
                  text="Save"
                />
              </DialogActions>
            </Dialog>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};
