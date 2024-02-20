import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./authentication/LoginForm";
import RegistrationForm from "./authentication/RegistrationForm";
import DashBoard from "./components/DashBoard";
import OrderRequest from "./components/OrderRequest";
import AddressCard from "./modals/AddressCard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={LoginForm} />
        <Route exact path="/login" Component={LoginForm} />
        <Route exact path="/signUp" Component={RegistrationForm} />
        <Route exact path="/dashboard" Component={DashBoard} />
        <Route exact path="/orders" Component={OrderRequest} />
        <Route exact path="/address" Component={AddressCard} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;