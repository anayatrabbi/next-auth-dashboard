"use client";
import React, { useState } from "react";
import {
  Box,
  Card,
  Button,
  Typography,
  Container,
  TextField,
} from "@mui/material";
import OTPInput from "@/app/components/OtpComponent";

export default function LoginPage() {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [response , setResponse ] = useState<any>(null);

  const showEmail = () => {
    setShowOtp(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://staging-1.transporter2u.com/api/v1/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: email,
          type: "Email",
          countryCode: "",
          appSignature: "",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShowOtp(true);
        setEmail(email);
        setResponse(data);
      } else {
        console.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ width: "75%", p: 4 }}>
          {!showOtp ? (
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h4" gutterBottom textAlign="center">
                Admin Login
              </Typography>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                margin="normal"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 2 }}
              >
                Send OTP
              </Button>
            </Box>
          ) : (
            <OTPInput response={response} showEmail={showEmail} email={email}/>
          )}
        </Card>
      </Box>
    </Container>
  );
}
