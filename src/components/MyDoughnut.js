import {Doughnut} from 'react-chartjs-2';

const bgColors = [
    '#D63931',
    '#009400',
    '#FFFFFF',
    '#F7E010',
    '#7A5100',
    '#DD482D',
    '#00ADBE',
    '#FFEDBD',
    '#F0BB31',
    '#031944',
    '#0F6988',
    '#003AAD',
  ]
  
  const borderColors = [
    '#000000',
  ]

const getChartData = (canvas, props) => {
    const ctx = canvas.getContext("2d");

    const x = canvas.height * 0.65;
    const y = canvas.width * 0.25;
    const outerRadius = canvas.width / 3.2;

    const x1 = x * 1.49;
    const y1 = y * 0.87;

    const gradient = ctx.createLinearGradient(x, y, outerRadius, x1, y1, 1);
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(1, "white");

    return {
        labels: props.symbols,
        datasets:[{
            data: props.values,
            borderWidth: 1,        
            backgroundColor: bgColors,
            borderColor: borderColors,
        }],
    };
};
  
const MyDoughnut = (props) => {
    return(
        <Doughnut
            height="450"
            width="450"
            data={(canvas) => getChartData(canvas, props)} 
            options={{
                cutout: "25%",
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'left',
                        align: 'center',
                        labels: {                  
                            sort: function(a, b, cd) {                    
                                const aText = a.text;
                                const bText = b.text;
                                let aVal = aText.substring(aText.indexOf(" ")+1, aText.indexOf("%"));
                                let bVal = bText.substring(bText.indexOf(" ")+1, bText.indexOf("%"));
                                return bVal - aVal;
                            },                  
                        }
                    }
                }
          }}
        />
    );
}

export default MyDoughnut;