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

import { use, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function PlatformSettings() {
  const [followsMe, setFollowsMe] = useState(true);
  const [answersPost, setAnswersPost] = useState(false);
  const [mentionsMe, setMentionsMe] = useState(true);
  const [newLaunches, setNewLaunches] = useState(false);
  const [productUpdate, setProductUpdate] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={1.5}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Location
        </MDTypography>
      </MDBox>

      <MDTypography variant="button" fontWeight="regular" color="text" pl={1.5}>
        {user != null ? user.region + ", " + user.city : "Nigeria"}
      </MDTypography>

      <MDBox pt={3} pb={2} pl={1.5} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Settings
        </MDTypography>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={followsMe} onChange={() => setFollowsMe(!followsMe)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me when someone logged from new location
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={answersPost} onChange={() => setAnswersPost(!answersPost)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me when someone logged from new device
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>

      <MDBox ml={1.5}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          application
        </MDTypography>
      </MDBox>
      <MDBox ml={1} display="flex" alignItems="center" mb={0.5}>
        <MDBox mt={0.5}>
          <Switch checked={newLaunches} onChange={() => setNewLaunches(!newLaunches)} />
        </MDBox>
        <MDBox width="80%" ml={0.5}>
          <MDTypography variant="button" fontWeight="regular" color="text">
            New launches and projects
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox display="flex" alignItems="center" mb={0.5} ml={1}>
        <MDBox mt={0.5}>
          <Switch checked={productUpdate} onChange={() => setProductUpdate(!productUpdate)} />
        </MDBox>
        <MDBox width="80%" ml={0.5}>
          <MDTypography variant="button" fontWeight="regular" color="text">
            Monthly product updates
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox display="flex" alignItems="center" mb={0.5} ml={1}>
        <MDBox mt={0.5}>
          <Switch checked={newsletter} onChange={() => setNewsletter(!newsletter)} />
        </MDBox>
        <MDBox width="80%" ml={0.5}>
          <MDTypography variant="button" fontWeight="regular" color="text">
            Subscribe to newsletter
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
