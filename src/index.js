import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import Home from './pages/home/Home';

ReactDOM.render(
    <Auth0Provider
      domain="dev-88-mri1m.us.auth0.com"
      clientId="JzTCnrphpHGiksYWnZNEtCgTq5tXsODZ"
      // ViSWsNBtyRoviyX6Gt32FbkG9VgbtCGF
      redirectUri={window.location.origin}
//      audience="https://dev-88-mri1m.us.auth0.com/api/v2/"
      audience="https://folio.kotkis.fi/"
      scope="read:all"
      useRefreshTokens={true}
      >
         <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="home" element={<Home />} />
          </Routes>
        </BrowserRouter>
    </Auth0Provider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
