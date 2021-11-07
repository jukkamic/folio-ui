import React from "react";
import { Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button onClick={() => logout({ returnTo: window.location.origin })} 
          style={{"color": "#FFD580", "border": "1px solid orange", "borderRadius": "0.25rem", 
                  "backgroundColor": "transparent", "paddingBottom": "0.5rem"}}>
      Log Out
    </Button>
  );
};

export default LogoutButton;