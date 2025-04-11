import React, { Fragment } from "react";
import { Typography, Stepper, StepLabel, Step, Box } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import "./styles/CheckoutSteps.css";

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    {
      label: <Typography>Shipping Details</Typography>,
      icon: LocalShippingIcon,
    },
    {
      label: <Typography>Confirm Order</Typography>,
      icon: LibraryAddCheckIcon,
    },
    {
      label: <Typography>Payment</Typography>,
      icon: AccountBalanceIcon,
    },
  ];

  const stepStyles = {
    boxSizing: "border-box",
  };

  return (
    <Fragment>
      <Box className="StepCheckOut" sx={{ mt: 10, px: 2, zIndex: 1, position: "relative" }}>
  <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
    {steps.map((item, index) => (
      <Step
        key={index}
        active={activeStep === index}
        completed={activeStep > index}>
        <StepLabel
          StepIconComponent={item.icon}
          sx={{
            color: activeStep >= index ? "#3498db" : "rgba(0, 0, 0, 0.649)",
          }}>
          {item.label}
        </StepLabel>
      </Step>
    ))}
  </Stepper>
</Box>

    </Fragment>
  );
};

export default CheckoutSteps;
