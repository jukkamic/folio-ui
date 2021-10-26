const NewsTick = (props) => (
    <span key={props.name}  
            style={{"display": "inline-block", "whiteSpace": "nowrap"}}>
        <span key={"s" + props.name} className="dot"></span>
        <a key={"a" + props.name} className="tickers" target="_blank" rel="noreferrer" href={props.url}>{props.title}</a>
    </span>
);  

export default NewsTick;