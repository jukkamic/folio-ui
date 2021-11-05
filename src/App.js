import './App.css';
import { withAuthenticationRequired  } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";
import { MainNav } from './components/MainNav';
import Loading from './components/Loading';
import Home from './pages/home/Home';

function App() {
  return (
    <Home />
  );

}

export default withAuthenticationRequired(App, {
  onRedirecting: () => <Loading />,
});
