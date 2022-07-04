import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {  api_get,api_post } from '@utils';
import Box from "@mui/material/Box";
export default function SelectMultiple({urlOptions, value, placeholder, onChange, sx}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);

  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
      var dataOptions = await api_get(urlOptions);
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
      multiple
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
      options={options}
      value={value}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(option, value) =>
        option.value === value.value
      }
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.value}>
          {option.title}
        </Box>
      )}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={placeholder}
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

