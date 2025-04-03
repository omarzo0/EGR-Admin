// All components mapping with path for internal routes

import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Blank = lazy(() => import("../pages/protected/Blank"));
const Leads = lazy(() => import("../pages/protected/Leads"));
const Bills = lazy(() => import("../pages/protected/Bills"));
const Citizen = lazy(() => import("../pages/protected/citizen"));
const Department = lazy(() => import("../pages/protected/department"));
const Services = lazy(() => import("../pages/protected/services"));
const Esign = lazy(() => import("../pages/protected/e-sign"));
const Process = lazy(() => import("../pages/protected/process"));
const DigitalWallet = lazy(() => import("../pages/protected/digital-wallet"));
const Wallet = lazy(() => import("../pages/protected/wallet"));
const Documents = lazy(() => import("../pages/protected/documents"));
const Details = lazy(() => import("../pages/protected/details"));
const ProfileSettings = lazy(() =>
  import("../pages/protected/ProfileSettings")
);

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },

  {
    path: "/leads",
    component: Leads,
  },

  {
    path: "/settings-profile",
    component: ProfileSettings,
  },
  {
    path: "/settings-billing",
    component: Bills,
  },

  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
  {
    path: "/citizen",
    component: Citizen,
  },
  {
    path: "/department",
    component: Department,
  },
  {
    path: "/services",
    component: Services,
  },
  {
    path: "/e-sign",
    component: Esign,
  },
  {
    path: "/process",
    component: Process,
  },
  {
    path: "/digital-wallet",
    component: DigitalWallet,
  },
  {
    path: "/wallet/:id",
    component: Wallet,
  },
  {
    path: "/documents",
    component: Documents,
  },
  {
    path: "/details",
    component: Details,
  },
];

export default routes;
