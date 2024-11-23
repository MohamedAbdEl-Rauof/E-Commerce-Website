"use client";

import { useState } from "react";
import { Button, TextField, Typography, Box, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
  },
});

export default function AccountDetails() {
  const [formData, setFormData] = useState({
    firstName: "Sofia",
    lastName: "Havertz",
    displayName: "Sofia Havertz",
    email: "sofia.havertz@example.com",
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <Card sx={{ p: 4 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Account Details
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <StyledTextField
                label="FIRST NAME *"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
              />

              <StyledTextField
                label="LAST NAME *"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
              />

              <Box>
                <StyledTextField
                  label="DISPLAY NAME *"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  fullWidth
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  This will be how your name will be displayed in the account
                  section and in reviews
                </Typography>
              </Box>

              <StyledTextField
                label="EMAIL *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </div>

          <div>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Password
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <StyledTextField
                label="OLD PASSWORD"
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                fullWidth
              />

              <StyledTextField
                label="NEW PASSWORD"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                fullWidth
              />

              <StyledTextField
                label="REPEAT NEW PASSWORD"
                type="password"
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </div>

          <Button
            type="submit"
            variant="contained"
            sx={{
              width: { xs: "100%", md: "auto" },
              alignSelf: { md: "flex-start" },
            }}
          >
            Save changes
          </Button>
        </Box>
      </form>
    </Card>
  );
}
