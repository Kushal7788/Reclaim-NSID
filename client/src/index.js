import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AddProof } from "./Add-Proof";
import { View } from "./View";
import { ProofView } from "./Proof-View";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" Component={App} /> {/* 👈 Renders at /app/ */}
      <Route path="/add-proof/:nsid" Component={AddProof} />
      <Route path="/view/:nsid" Component={View} />
      <Route path="/proof-view/:nsid" Component={ProofView} />
      {/* <Route path="/prover/:checkId" Component={Prover} /> */}
    </Routes>
  </BrowserRouter>
);
