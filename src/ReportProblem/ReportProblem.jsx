import React, { useState, useEffect } from "react";
import { TextField, Typography, MenuItem, Box } from "@mui/material/";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";
import "./ReportProblem.css";
import { queries } from "./data";

const Contact = ({ user }) => {
  const [formFields, setFormFields] = useState({
    email: "",
    query: "",
    data: "",
  });

  useEffect(() => {
    if (user && user.email) {
      setFormFields((prevState) => ({
        ...prevState,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (event) => {
    setFormFields((prevState) => ({
      ...prevState,
      query: event.target.value,
    }));
  };

  const sendEmail = (e) => {
    e.preventDefault();

    // Configure email parameters
    const emailParams = {
      from_name: formFields.email,
      subject: formFields.query,
      message: formFields.data,
    };

    // Send email using EmailJS service
    emailjs
      .send(
        "service_kvb7rvj",
        "template_3tsjpks",
        emailParams,
        "C2z-ft1OdJOHL1BCI"
      )
      .then((response) => {
        alertMessageSuccess();
        setFormFields({
          email: "",
          query: "",
          data: "",
        });
      })
      .catch((error) => {
        alertMessageError(error);
      });

    // Alert
    const alertMessageSuccess = () => {
      toast.success("Message sent!", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    };

    const alertMessageError = (error) => {
      toast.success(`Failed to send: ${error}`, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    };
  };

  return (
    <form className="form" onSubmit={sendEmail} style={{backgroundColor: "#F1F0FF"}}>
      <Box
        className="container"
        noValidate
        autoComplete="off"
        sx={{
          minHeight: "80vh",
          mx: "auto", // margin left & right
          py: 3, // padding top & bottom
          px: 2, // padding left & right
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h3">
          <b>Any Issues?</b>
        </Typography>
        <Typography variant="h5" style={{ marginBottom: 20 }}>
          Contact us!
        </Typography>

        <TextField
          id="outlined-textarea"
          label="Email"
          value={formFields.email || ""}
          disabled
        />

        <TextField
          id="outlined-select-query"
          select
          label="Query"
          value={formFields.query}
          onChange={handleChange}
          placeholder="Select your query"
        >
          {queries.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          id="outlined-multiline-static"
          label="Comment"
          multiline
          rows={4}
          placeholder="Enter your comments"
          value={formFields.data}
          onChange={(e) =>
            setFormFields((prevState) => ({
              ...prevState,
              data: e.target.value,
            }))
          }
        />

        <div className="button-box">
          {formFields.data && formFields.email ? (
            <button className="mail-button button--primary" type="submit">
              <svg
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z" />
              </svg>
              &nbsp;Send Message
            </button>
          ) : (
            <button className="mail-button button--primary" disabled>
              <svg
                width="30px"
                height="30px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z" />
              </svg>
              &nbsp;Send Message
            </button>
          )}

          <button className="mail-button button--danger button--with-icon">
            <svg viewBox="0 0 24 24">
              <path d="m9 3v1h-5v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-13h1v-2h-5v-1zm0 5h2v9h-2zm4 0h2v9h-2z" />
            </svg>
            Clear
          </button>
        </div>
      </Box>
    </form>
  );
};

export default Contact;
