import axios from "axios";
const api_key = process.env.NEWS_API_KEY;

export const news_get = async (req, res) => {
  var url = "https://newsapi.org/v2/top-headlines?" + "country=ph&" + "apiKey=554a93cea5b34ecc88c4a22effddea9c";
  try {
    const result = await axios.get(url);
    res.render("newsList", { articles: result.data.articles });
  } catch (error) {
    console.error(error);
  }
};
