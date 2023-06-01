import React from "react";
import { styled } from "@mui/material/styles";
import { TextField, InputAdornment } from "@mui/material/";

const CssTextField = styled(TextField)({
  "& label": {
    color: "#fb9701", //Label color
    fontSize: 17,
  },
  "& label.Mui-focused": {
    color: "#fa2185", //Label-focus
  },

  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#000000", //Fieldset
    },
    "&:hover fieldset": {
      borderColor: "#fb9701", //Fieldset on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fa2185", //Fieldset on focus
    },
  },
});
const IconTextField = ({ iconStart, iconEnd, InputProps, ...props }) => {
  return (
    <CssTextField
      {...props}
      InputProps={{
        ...InputProps,
        style: {
          color: "#000000",
        },
        startAdornment: iconStart ? (
          <InputAdornment position="start">{iconStart}</InputAdornment>
        ) : null,
        endAdornment: iconEnd ? (
          <InputAdornment position="end">{iconEnd}</InputAdornment>
        ) : null,
      }}
    />
  );
};
export default IconTextField;
