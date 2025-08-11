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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // warning icon
import EmailIcon from "@mui/icons-material/Email"; // mail icon
import { red } from "@mui/material/colors";

// firebase
import { firebaseApp, db } from "firebase-config";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { json } from "react-router-dom";
import { Try } from "@mui/icons-material";
import { UAParser } from "ua-parser-js";

async function getUserData(uid) {
  try {
    // Reference to document: users/{uid}
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("User data:", docSnap.data());
      return docSnap.data(); // This is your object
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.error("Error fetching user:", err);
  }
}

async function verifyUser(user) {
  try {
    const req = await fetch("https://ids-hook.vercel.app/api/send-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          uid: user.uid,
          email: user.email,
        },
      }),
    });

    if (!req.ok) {
      const error = await req.text();
      console.log("Code Failed" + error);
    } else {
      const res = await req.text();
      console.log("Code Sent Sucessfully to " + user.email + res);
    }
  } catch (error) {
    console.log("Code Failed" + error);
  }
}
function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [openDialog, setOpenDialog] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [code, setCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  // get current user's data from storageSessiion
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    // Do your initialization logic here
    // e.g., fetch data, load from localStorage, set up subscriptions
    // This runs once when the component mounts (like initState/onCreate)

    const analyzeData = async () => {
      if (user != null) {
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
        } catch (err) {
          // if failed, eg due to nextwork timeout, then fallback to built-in geolocator
          console.error("IP Fallback Error:", err);
          if (navigator.geolocation) {
            // try build-in geolocator
            navigator.geolocation.getCurrentPosition(
              (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
              },
              async (error) => console.error("Geo error:", error),
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

        // Save user data in session storage
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            name: user.name,
            email: user.email,
            city: city,
            region: countryName,
            device: {
              model: result.device.model || null,
            },
            os: {
              name: result.os.name || null,
            },
          })
        );

        // Get stored user's data from firestore
        var prevCity, prevDevice, prevOS;
        const userData = await getUserData(user.uid);
        if (userData) {
          prevCity = userData.metadata.city;
          prevDevice = userData.metadata.device.model;
          prevOS = userData.metadata.os.name;
        }

        // Analyze the data
        if (prevCity != city || prevDevice != device.model || prevOS != os.name) {
          setOpenDialog(true);
        }
      }
    };

    analyzeData();
  }, []);

  return (
    <DashboardLayout>
      {/* Suspicious Activity Dialog */}
      <Dialog
        disableEscapeKeyDown
        open={openDialog}
        onClose={(event, reason) => {
          // Prevent closing when clicking backdrop or pressing ESC
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setOpenDialog(false);
            setVerificationSent(false);
          }
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: red[500], fontSize: 30 }} />
          Security Alert
        </DialogTitle>

        <DialogContent dividers>
          {!verificationSent ? (
            <>
              <p>
                We’ve detected unusual activity on your account. Please verify your account to
                continue using our services securely.
              </p>
              <p style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10 }}>
                <EmailIcon color="primary" />
                Check your email for the verification link.
              </p>
            </>
          ) : (
            <>
              <p style={{ color: "green", fontWeight: "bold", marginTop: 10 }}>
                A verification code has been sent to your email address.
              </p>
              <div style={{ marginTop: 20 }}>
                <label htmlFor="verification-code" style={{ fontWeight: "bold" }}>
                  Enter Code:
                </label>
                <input
                  id="verification-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{ marginLeft: 10, padding: 5, borderRadius: 4, border: "1px solid #ccc" }}
                  placeholder="Verification code"
                />
                {codeVerified && (
                  <span style={{ color: "green", marginLeft: 10 }}>Code verified!</span>
                )}
              </div>
            </>
          )}
        </DialogContent>

        <DialogActions>
          {!verificationSent ? (
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                // Simulate code verification
                try {
                  await verifyUser(user);
                  setVerificationSent(true);
                } catch (error) {
                  // todo
                  console.log(error);
                }
              }}
            >
              Verify Now
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled={code.length === 0 || codeVerified}
              onClick={async () => {
                // Simulate code verification
                try {
                  // Get firestore verification code
                  const snapshot = await getDoc(doc(db, "users", user.uid));
                  if (code == snapshot.data().verificationCode) {
                    // Update user data in firestore
                    await setDoc(
                      doc(db, "users", user.uid),
                      {
                        metadata: {
                          city: user.city,
                          device: {
                            model: user.device.model,
                          },
                          os: {
                            name: user.os.name,
                          },
                        },
                      },
                      { merge: true }
                    );

                    console.log("Code is Verified");
                    setCodeVerified(true);
                    setOpenDialog(false);
                  } else {
                    console.log("Code is did not match");
                  }
                } catch (error) {
                  // todo
                  console.log(error);
                }
              }}
            >
              Verify
            </Button>
          )}
          {/* <Button
            onClick={() => {
              setOpenDialog(false);
              setVerificationSent(false);
              setCode("");
              setCodeVerified(false);
            }}
            color="secondary"
          >
            Dismiss
          </Button> */}
        </DialogActions>
      </Dialog>

      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Bookings"
                count={281}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Today's Users"
                count="2,300"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Revenue"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
