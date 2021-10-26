import NewsTick from "../components/NewsTick";

export function createNewsTickItems(res) {
    const news = [];
    for (const result of res.data.results) {
      news.push( (<NewsTick name={result["id"]} title={result["title"]} url={result["url"]}/> ) );
    }
    return news;
  }
  