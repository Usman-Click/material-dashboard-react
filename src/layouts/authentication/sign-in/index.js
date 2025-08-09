import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ useNavigate for redirection
import { signInWithEmailAndPassword } from "firebase/auth";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// firebase
import { auth } from "firebase-config";

// get device user agent info
import { UAParser } from "ua-parser-js";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      // Sign user in
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in user:", userCred.user);

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

      // Save user data in session storage
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: userCred.user.uid,
          name: "name",
          email: email,
          city: city,
          region: countryName,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.message);
      alert(err.message);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSignIn}>
            <MDBox mb={2}>
              <MDInput
                reuired
                type="email"
                label="Email"
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
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
