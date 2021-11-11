import './App.css';
import { withAuthenticationRequired  } from "@auth0/auth0-react";
import { MainNav } from './components/MainNav';
import Loading from './components/Loading';
import Home from './pages/home/Home';
import { Container } from "react-bootstrap";
import { Routes, Route, Outlet } from "react-router-dom";
import ChartPage from './pages/chart/ChartPage';
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from 'react';
import useInterval from 'react-useinterval';
import axios from "axios";

const WALLET_URL = process.env.REACT_APP_WALLET_URL;

function App() {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletData, setWalletData] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect( () => {
    async function fetchWalletData() {
      const token = await getAccessTokenSilently({
        audience: "https://folio.kotkis.fi/",
        scope: "read:all",
      });
      
      await axios.get(WALLET_URL, {headers: {Authorization: "Bearer " + token}})
      .then( (response) => {
        setWalletData(response.data);
      })
      .catch( (error) => {
        console.log(error);
        setError(error);
      }).finally( () => {
        setLoading(false);
      });
    }
    fetchWalletData();  
  },[getAccessTokenSilently, refresh]);

  useInterval( () => {
    setRefresh(!refresh);
  }, 13000);


  if (error) {
    return "Error";
  }

  return (
      <Container fluid>
        <MainNav walletData={walletData} />
        <Routes>
          <Route path="/" element={<Home loading={loading} walletData={walletData}/>} />
          <Route path="charts" element={<ChartPage />} />
        </Routes>
        <Outlet />
      </Container>
  );

}

export default withAuthenticationRequired(App, {
  onRedirecting: () => <Loading />,
});
