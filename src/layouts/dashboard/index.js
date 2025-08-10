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
import { getDoc, doc } from "firebase/firestore";
import { json } from "react-router-dom";

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

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [openDialog, setOpenDialog] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [code, setCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);

  useEffect(() => {
    // Do your initialization logic here
    // e.g., fetch data, load from localStorage, set up subscriptions
    // This runs once when the component mounts (like initState/onCreate)

    const fetchData = async () => {
      // get current user's data
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (user != null) {
        const currentCity = user.city;
        const currentDevice = user.device.model;
        const currentOS = user.os.name;
        var prevCity, prevDevice, prevOS;

        // stored user's data
        const userData = await getUserData(user.uid);
        if (userData) {
          prevCity = userData.metadata.city;
          prevDevice = userData.metadata.device.model;
          prevOS = userData.metadata.os.name;
        }

        if (prevCity != currentCity || prevDevice != currentDevice || prevOS != currentOS) {
          setOpenDialog(true);
        }
      }
    };

    fetchData();
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
              onClick={() => {
                setVerificationSent(true);
              }}
            >
              Verify Now
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled={code.length === 0 || codeVerified}
              onClick={() => {
                // Simulate code verification
                setCodeVerified(true);
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
