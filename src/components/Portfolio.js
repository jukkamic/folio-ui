import { Accordion } from 'react-bootstrap';

const shareValue = (share, total) => {
  const current_share = Math.round(((total * share) + Number.EPSILON) * 100) / 100;
  return current_share;
};

const netUSDT = (og, share, total) => {
  const current_value = shareValue(share, total);
  const net = Math.round(((current_value - og) + Number.EPSILON) * 100) / 100;

  if (net >= 0) {
      return <span className='up'>+{Intl.NumberFormat('en-US').format(net)} USDT</span>
  } else {
      return <span className='down'>{Intl.NumberFormat('en-US').format(net)} USDT</span>
  }
};

const netPercentage = (og, share, total) => {
  const current_value = shareValue(share, total);
  const net = Math.round(((current_value / og - 1) + Number.EPSILON) * 10000) / 100;
  if (net >= 0) {
      return <span className='up'>+{net} %</span>
  } else {
      return <span className='down'>{net} %</span>
  }
};

const Portfolio = (props) => {
  return (
      <Accordion.Item eventKey={props.email}>
        <Accordion.Header>
          <span style={{"color": "black"}}><b>{props.name}</b> {props.loading? "Loading" : netPercentage(props.og, props.share, props.total)}</span>
        </Accordion.Header>
        <Accordion.Body>
        {props.loading ? "Loading" : Intl.NumberFormat('en-US').format(shareValue(props.share, props.total))} USDT
        <br />{props.loading? "Loading" : netUSDT(props.og, props.share, props.total)}
        </Accordion.Body>
      </Accordion.Item>

    // <Card fluid style={{}}>
    //   <Card.Body>
    //     <Card.Title style={{"fontSize": "16px"}}>{props.name}</Card.Title>
    //     <Card.Subtitle>{netPercentage(props.og, props.share, props.total)}</Card.Subtitle>
    //     <Card.Text>{Intl.NumberFormat('en-US').format(shareValue(props.share, props.total))} USDT
    //     <br />{netUSDT(props.og, props.share, props.total)}</Card.Text>
    //   </Card.Body>
    // </Card>
  );
}

export default Portfolio;