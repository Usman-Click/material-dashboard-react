/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link, Navigate } from "react-router-dom";

// react imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅ Import navigate hook

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// firebase
import { firebaseApp, auth, db } from "firebase-config.js";
import { createUserWithEmailAndPassword } from "firebase/auth"; // standalone func, nees to be imported spearely
import { doc, setDoc } from "firebase/firestore";

// get device user agent info
import { UAParser } from "ua-parser-js";

function Cover() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); //  Create navigate instance

  const createUser = async () => {
    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed in:", userCred.user);

      // Get devicde info : location, ip
      var latitude, longitude, city, ip, region, countryName, timezone, device, os, browser;

      try {
        // Get location
        const res = await fetch("https://ipapi.co/json");
        const data = await res.json();
        city = data.city;
        ip = data.ip;
        latitude = data.latitude;
        longitude = data.longitude;
        countryName = data.country_name;
        timezone = data.timezone;
        region = data.region;

        console.log("City:", data.city);
        console.log("Lat:", data.latitude);
        console.log("Long:", data.longitude);
      } catch (err) {
        // if failed, eg due to nextwork timeout, then fallback to built-in geolocator
        console.error("IP Fallback Error:", err);
        if (navigator.geolocation) {
          // try build-in geolocator
          navigator.geolocation.getCurrentPosition(
            (position) => {
              latitude = position.coords.latitude;
              longitude = position.coords.longitude;
              console.log("Lat:", latitude, "Lng:", longitude);
            },
            async (error) => {
              console.error("Geo error:", error);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        }
      }

      // 2. Parse device user agent detaiuls using parser
      const parser = new UAParser();
      const result = parser.getResult();

      device = result.device;
      os = result.os;
      browser = result.browser;

      console.log("Device:", device);
      console.log("OS:", result);
      console.log("Browser:", result);

      // 3. save user's data in Firestore document with UID as ID
      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        name: name,
        email: email,
        createdAt: new Date(),
        metadata: {
          latitude: latitude,
          longitude: longitude,
          city: city,
          ip: ip,
          region: region,
          country_name: countryName,
          timezone: timezone,
          device: {
            model: result.device.model || null,
            type: result.device.type || null,
          },
          os: {
            name: result.os.name || null,
            version: result.os.version || null,
          },
          browser: {
            name: result.browser.name || null,
            version: result.browser.version || null,
          },
        },
      });

      // Save user data in session storage
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: userCred.user.uid,
          name: name,
          email: email,
          city: city,
          region: countryName,
          device: {
            model: result.device.model || null,
            type: result.device.type || null,
          },
          os: {
            name: result.os.name || null,
            version: result.os.version || null,
          },
        })
      );

      setSuccessOpen(true);
    } catch (error) {
      console.error("Auth error:", error.message);
      setErrorMessage(error.message);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>Account created successfully!</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSuccessOpen(false);
              navigate("/dashboard");
            }}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={errorOpen} onClose={() => setErrorOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>{errorMessage || "An error occurred while signing up."}</DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorOpen(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox
            component="form"
            role="form"
            onSubmit={(e) => {
              e.preventDefault(); // stop page reload
              createUser();
            }}
          >
            <MDBox mb={2}>
              <MDInput
                required
                type="text"
                label="Name"
                variant="standard"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                required
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                required
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit" // important
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
