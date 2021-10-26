export function countTotal(data) {
    var total = 0;
    // eslint-disable-next-line
    for (const [key, value] of Object.entries(data)) {
      total += parseFloat(value["value"]);
    }
    return total;
}
  
export function parseSymbolsValues(data, total, hideSmall) {
    const values = [];
    const symbols = [];
    const sorted = Object.entries(data).sort( function (a,b) {
      return (parseFloat(a[1]["value"]) < parseFloat(b[1]["value"]) ? 1 : -1);
    });
    for (const entry of Object.entries(sorted)) {
      const val = parseFloat(entry[1][1]["value"]);
      if( !(hideSmall && (val < 10)) ) {
        const share = (val / total) * 100.00;
        symbols.push(entry[1][1]["asset"] + " " + (share.toPrecision(2)).toString() + "%");
        values.push(val);
      }
    }
    return [symbols, values];
}
  