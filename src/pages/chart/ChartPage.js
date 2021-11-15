import { withAuthenticationRequired  } from "@auth0/auth0-react";
import {Spinner} from "../../components/Spinner";
import {Line} from "react-chartjs-2";
import { Toast } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { MainNav } from "../../components/MainNav";
import moment from "moment";

const WALLET_URL = process.env.REACT_APP_WALLET_URL;

  
const options = {
    scales: {
      btc: {
        position: "right",
      },
      usdt: {
          position: "left",
          
      },
      btc_usdt: {
          position: "left"
      }
    }
  };

function ChartPage() {
    const {getAccessTokenSilently} = useAuth0();
    const [labels, setLabels] = useState([]);
    const [usdt_values, setUsdtValues] = useState([]);
    const [btc_values, setBtcValues] = useState([]);
    const [btc_usdt_values, setBtcUsdtValues] = useState([]);
    const [showToast, setShowToast] = useState(true);

    useEffect( () => {
        async function fetchHistory() {
            const token = await getAccessTokenSilently({
                audience: "https://folio.kotkis.fi/",
                scope: "read:all",
            });
            
            await axios.get(WALLET_URL + "history/30/", {headers: {Authorization: "Bearer " + token}})
            .then( (history) => {
                const history_json = JSON.parse(history.data);

                var labelArray = [];
                history_json.map(point => {
                    labelArray.push(moment(point.time).format('DD.MM HH:mm'));
                });
                setLabels(labelArray.reverse());

                var usdt_array = [];
                history_json.map(point => {
                    usdt_array.push(point.value_usdt);
                });
                setUsdtValues(usdt_array.reverse());

                var btc_array = [];
                history_json.map(point => {
                    btc_array.push(point.value_btc);
                });
                setBtcValues(btc_array.reverse());

                var btc_usdt_array = [];
                history_json.map(point => {
                    btc_usdt_array.push(point.btc_usdt);
                });
                setBtcUsdtValues(btc_usdt_array.reverse());
            }).catch( (err) => {
                console.log(err);
            }).finally( 
            );
        }
        fetchHistory();
    },[getAccessTokenSilently]);


    const data = {
        labels: labels,
        datasets: [
          {
            label: "Folio USDT",
            data: usdt_values,
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
            yAxisID: 'usdt',
          },
          {
            label: "Folio BTC",
            data: btc_values,
            fill: false,
            backgroundColor: 'rgb(0, 255, 132)',
            borderColor: 'rgba(0, 255, 132, 0.2)',
            yAxisID: 'btc',
          },
          {
            label: "BTC USDT",
            data: btc_usdt_values,
            fill: false,
            backgroundColor: 'rgb(0, 0, 255)',
            borderColor: 'rgba(0, 0, 255, 0.2)',
            yAxisID: 'btc_usdt',
          },
        ],
      }; 

      console.log("labels: " + data.labels)
      console.log("data: " + data.datasets[0].data)

    return(
        <>
            <Toast show={showToast} onClose={() => setShowToast(false)}>
                <Toast.Header>Click the chart headers to toggle visibility.</Toast.Header>
            </Toast>
            <Line data={data} options={options} />
        </>
    )
}

export default withAuthenticationRequired(ChartPage, {
    onRedirecting: () => <><MainNav /><Spinner /></>,
  });
