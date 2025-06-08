import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./app/store";
import { Provider } from "react-redux";
import SuspenseContent from "./containers/SuspenseContent";
import NoInternetConnection from "./pages/NoInternetConnection";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NoInternetConnection>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<SuspenseContent />}>
          <Provider store={store}>
            <App />
          </Provider>
        </Suspense>
      </I18nextProvider>
    </NoInternetConnection>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
