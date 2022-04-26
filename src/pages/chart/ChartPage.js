import { withAuthenticationRequired  } from "@auth0/auth0-react";
import {Spinner} from "../../components/Spinner";
import {Line} from "react-chartjs-2";
import { Row, Col, Form } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { MainNav } from "../../components/MainNav";
import moment from "moment";

const WALLET_URL = process.env.REACT_APP_WALLET_URL;

  
const options = {
    scales: {
      btc_usdt: {
        position: "left",
        display: false,
      },
      folio_usdt: {
          position: "left",
      },
      folio_btc: {
          position: "right",
          grid: {
              color: function (context) {
                  if (context.tick.value === 1) {
                      return "#000000";
                  } else {
                      return 'rgb(201, 203, 207)';
                  }
              }
          }
      }
    }
  };

function ChartPage() {
    const {getAccessTokenSilently} = useAuth0();
    const [labels, setLabels] = useState([]);
    const [usdt_values, setUsdtValues] = useState([]);
    const [btc_usdt_values, setBtcUsdtValues] = useState([]);
    // const [btc_values, setBtcValues] = useState([]);
    const [folio_btc_values, setFolioBtcValues] = useState([]);
    const [timeDays, setTimeDays] = useState("7");

    useEffect( () => {
        async function fetchHistory() {
            const token = await getAccessTokenSilently({
                audience: "https://folio.kotkis.fi/",
                scope: "read:all",
            });
            
            await axios.get(WALLET_URL + "history/" + timeDays, {headers: {Authorization: "Bearer " + token}})
            .then( (history) => {
                const history_json = JSON.parse(history.data);

                var labelArray = [];
                labelArray = history_json.map(point => {
                    return moment(point.time).format('DD.MM HH:mm');
                });
                setLabels(labelArray.reverse());

                var usdt_array = [];
                usdt_array = history_json.map(point => {
                    return point.value_usdt;
                });
                setUsdtValues(usdt_array.reverse());

                // var btc_array = [];
                // btc_array = history_json.map(point => {
                //     return point.value_btc;
                // });
                // setBtcValues(btc_array.reverse());

                var btc_usdt_array = [];
                btc_usdt_array = history_json.map(point => {
                    return point.btc_usdt;
                });
                setBtcUsdtValues(btc_usdt_array.reverse());

                const ratio = btc_usdt_array[0] / usdt_array[0];
                var folio_btc_normalized = [];
                folio_btc_normalized = usdt_array.map( function(n, i) {
                    return ratio * n / btc_usdt_array[i];
                });
                setFolioBtcValues(folio_btc_normalized);
            }).catch( (err) => {
                console.log(err);
            }).finally( 
            );
        }
        fetchHistory();
    },[getAccessTokenSilently, timeDays]);


    const data = {
        labels: labels,
        datasets: [
          {
            label: "Folio",
            data: usdt_values,
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
            yAxisID: 'folio_usdt',
          },
          {
            label: "BTC",
            data: btc_usdt_values,
            fill: false,
            backgroundColor: 'rgb(0, 0, 255)',
            borderColor: 'rgba(0, 0, 255, 0.2)',
            yAxisID: 'btc_usdt',
          },
          {
            label: "Folio BTC",
            data: folio_btc_values,
            fill: false,
            backgroundColor: 'rgb(0, 255, 132)',
            borderColor: 'rgba(0, 255, 132, 0.2)',
            yAxisID: 'folio_btc',
          },
        ],
      }; 

    return(
        <>
        <Row>
            <Col md={12}>
            <Form>
                <Form.Label>Select chart period</Form.Label>
                <Form.Group onChange={(e) => setTimeDays(e.target.id)} className="mb-6" controlId="selectDays">
                    <Form.Check checked={timeDays === "7"} inline id="7" name="days" type="radio" label="7 days"></Form.Check>
                    <Form.Check checked={timeDays === "30"} inline id="30" name="days" type="radio" label="30 days"></Form.Check>
                </Form.Group>
                </Form>
            </Col>
        </Row>
        <Row>
            <Col md={12}>
            <Line data={data} options={options} height="100%"/>
            </Col>
        </Row>
        </>
    )
}

export default withAuthenticationRequired(ChartPage, {
    onRedirecting: () => <><MainNav /><Spinner /></>,
  });
