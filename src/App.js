import './App.css';
import { withAuthenticationRequired  } from "@auth0/auth0-react";
import { MainNav } from './components/MainNav';
import Home from './pages/home/Home';
import ChartPage from './pages/chart/ChartPage';
import QueryPage from './pages/query/QueryPage';
import { Container, Alert } from "react-bootstrap";
import { Routes, Route, Outlet } from "react-router-dom";
import { useState } from 'react';
import { Spinner } from './components/Spinner';

function App() {
  const [loading] = useState(true);
  const [error, setError] = useState(null);

  return (
      <Container fluid>
        {error ? 
        <Alert variant="danger" closeVariant="dark" dismissible={true} onClose={ () => {setError(null)}} >{error.message}</Alert>
        : <></> }
        <MainNav />
        <Routes>
          <Route path="/" element={<Home loading={loading} />} />
          <Route path="charts" element={<ChartPage />} />
          <Route path="binance" element={<QueryPage />} />
        </Routes>
        <Outlet />
      </Container>
  );

}

export default withAuthenticationRequired(App, {
  onRedirecting: () => <><MainNav /><Spinner /></>,
});
