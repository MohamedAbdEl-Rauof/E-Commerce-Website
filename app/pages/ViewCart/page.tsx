// ViewCart/page.tsx
"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Header from "../../components/Header/page";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Footer from "../../components/Footer/page";


const steps = ["Shopping Cart", "Checkout Details", "Order Complete"];

export default function ViewCart() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [index: number]: boolean }>({});

  const handleNext = () => {
    // Mark current step as completed
    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      [activeStep]: true,
    }));
    // Move to the next step
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <div className="w-[85%] mx-auto mt-24">
        <Box sx={{ width: "100%" }}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={!!completed[index]}>
                <StepButton onClick={() => setActiveStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div className="step-content">{renderStepContent()}</div>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Box>
      </div>
      <div className="mt-14">
        <Footer />
      </div>
    </div>
  );
}
