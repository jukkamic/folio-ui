import { Col, Row } from 'react-bootstrap';

const shareValue = (share, total) => {
  const current_share = Math.round(((total * share) + Number.EPSILON) * 100) / 100;
  return current_share;
};

const netUSDT = (og, share, total) => {
  const current_value = shareValue(share, total);
  console.log("current value " + current_value);
  const net = Math.round(((current_value - og) + Number.EPSILON) * 100) / 100;

  if (net >= 0) {
      return <span className='up'>+{Intl.NumberFormat('en-US').format(net)} USDT</span>
  } else {
      return <span className='down'>{Intl.NumberFormat('en-US').format(net)} USDT</span>
  }
};

const netPercentage = (og, share, total) => {
  const current_value = shareValue(share, total);
  console.log("current value " + current_value);
  const net = Math.round(((current_value / og - 1) + Number.EPSILON) * 10000) / 100;
  console.log("net percentage " + net);
  if (net >= 0) {
      return <span className='up'>+{net} %</span>
  } else {
      return <span className='down'>{net} %</span>
  }
};

const MyPortfolioRow = (props) => {
  return (
    <Row style={{"marginTop": 0, "marginBottom": 0}}>
      <Col style={{"borderBottom": "2px solid black", "borderRadius": "6px"}}><b>{props.name}</b> {netPercentage(props.og, props.share, props.total)}
        <br /><b>{Intl.NumberFormat('en-US').format(shareValue(props.share, props.total))}</b> USDT
        <br />{netUSDT(props.og, props.share, props.total)} 
      </Col>
    </Row>
  );
}

export default MyPortfolioRow;