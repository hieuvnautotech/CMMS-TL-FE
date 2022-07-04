import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Box from "@mui/material/Box";
import {  api_get,api_post } from '@utils';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function SelectBox({url, placeholder, onChange,defaultValue,sx,variantInput}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  


  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
        //lấy dữ liệu từ server
     // await sleep(1e3); // For demo purposes.
      var dataOptions= await api_get(url);

      if (active) {
        setOptions(dataOptions);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);


  return (
    <Autocomplete
      
      sx={sx}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, newValue) => {
        onChange && newValue && onChange(newValue)
      }}
      onInputChange={(event, newInputValue) => {
       
        if (!newInputValue)
        onChange  && onChange({title:'',value:''})
      }}

      defaultValue={defaultValue && defaultValue.title && defaultValue.value ? defaultValue:null}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      options={options}
      loading={loading}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.value}>
          {option.title}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={placeholder}
          variant={variantInput}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

