from flask import Flask, request, jsonify
from risk_analysis import calculate_risk_score, categorize_risk
from scrape_yfinance import scrape_yfinance_data
from swot_analysis import (
    generate_portfolio_swot,
    generate_trading_signals,
    parse_swot_analysis,
)
from scrape_esg import scrape_esg_sustainalytics
from esg_analysis import ESGAnalyzer
from strategy_bot import generate_strategies
from chatbot import PortfolioChat
import pandas as pd
from references import ESG_SUSTAINALYTICS_MAPPING
import json
import os
import pandas as pd
import requests as R
from company_info import CompanyInfo
from flask_caching import Cache
from flask_cors import CORS

company_info = CompanyInfo()


os.environ["GROQ_API_KEY"] = "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"
TIMEOUT = 6000000
esg_analyser = ESGAnalyzer()

conversations = {}

app = Flask(__name__)
cache = Cache(app, config={"CACHE_TYPE": "simple"})
CORS(app)


# Root endpoint
@app.route("/", methods=["GET"])
@cache.cached(timeout=TIMEOUT)
def home():
    return jsonify({"message": "Welcome to the Flask API!"})


# Example endpoint: GET request
@app.route("/api/finance/<qtype>/<ticker_name>", methods=["GET"])
@cache.cached(timeout=TIMEOUT)
def get_history(ticker_name, qtype):
    if not os.path.exists(f"data/finance/{ticker_name}"):
        os.makedirs(f"data/finance/{ticker_name}", exist_ok=True)
        scrape_yfinance_data(ticker_name, f"data/finance/{ticker_name}")
    if os.path.exists(f"data/finance/{ticker_name}/{qtype}.csv"):
        query = pd.read_csv(f"data/finance/{ticker_name}/{qtype}.csv")
        data = query.to_dict(orient="records")
        return jsonify(data)
    else:
        return jsonify({"message": f"No data found for {ticker_name}/{qtype}"})


# http://127.0.0.1:5000/api/finance/technicals/RELIANCE.NS


@app.route("/api/analytics/risk/<ticker_name>", methods=["GET"])
@cache.cached(timeout=TIMEOUT)
def get_risk(ticker_name):
    if os.path.exists(f"data/{ticker_name}/technicals.csv"):
        technicals = pd.read_csv(f"data/{ticker_name}/technicals.csv")
    else:
        os.makedirs(f"data/{ticker_name}", exist_ok=True)
        scrape_yfinance_data(ticker_name, f"data/{ticker_name}")
        technicals = pd.read_csv(f"data/{ticker_name}/technicals.csv")
    risk_scores = calculate_risk_score(technicals)
    risk_scores["category"] = categorize_risk(risk_scores["risk_score"])
    return jsonify(risk_scores)


# http://127.0.0.1:5000//api/analytics/risk/RELIANCE.NS


@app.route("/api/analytics/esg/<ticker_name>", methods=["GET"])
@cache.cached(timeout=TIMEOUT)
def get_esg(ticker_name):
    # if ticker_name not in ESG_SUSTAINALYTICS_MAPPING:
    #     return jsonify({"message": f"No ESG data found for {ticker_name}"})
    # if not os.path.exists(f"data/esg/{ticker_name}.json"):
    #     os.makedirs(f"data/esg", exist_ok=True)
    #     esg_data = scrape_esg_sustainalytics(ESG_SUSTAINALYTICS_MAPPING[ticker_name])
    #     with open(f"data/esg/{ticker_name}.json", "w") as f:
    #         json.dump(esg_data, f)

    # with open(f"data/esg/{ticker_name}.json") as f:
    #     data = json.load(f)
    data = {}
    data["analysis"] = esg_analyser.get_esg_score(ticker_name)
    return jsonify(data)


# http://127.0.0.1:5000//api/analytics/esg/RELIANCE.NS


@app.route("/api/analytics/swot", methods=["GET"])
@cache.cached(timeout=TIMEOUT)
def get_swot():
    # Retrieve tickers from query parameters
    tickers_param = request.args.get("portfolio")
    if not tickers_param:
        return jsonify({"error": "No tickers provided"}), 400

    # Convert comma-separated tickers into a list
    portfolio = tickers_param.split(",")

    swot = generate_portfolio_swot(portfolio)
    swot = parse_swot_analysis(swot)
    signals = generate_trading_signals(portfolio)
    data = {"swot": swot, "signals": signals}
    return jsonify(data)


# http://127.0.0.1:5000/api/analytics/swot?portfolio=AAPL,GOOGL,META,MSFT,AMZN


@app.route("/api/analytics/strategies", methods=["GET"])
@cache.cached(timeout=TIMEOUT, query_string=True)
def get_strategies():
    prompt = request.args.get("prompt")
    # prompt = prompt.replace("1234567890", " ")
    portfolio = request.args.get("portfolio").split(",")
    strategies = generate_strategies(prompt, portfolio)
    return jsonify(strategies)


# https://127.0.0.1:5000/api/analytics/strategies?portfolio=AAPL,GOOGL,META,MSFT,AMZN?prompt=%22I%20want%20to%20focus%20on%20EV%20market%20and%20emerging%20tech,%20but%20avoid%20traditional%20energy.%20Looking%20for%20growth%20opportunities%20in%20next%202-3%20years.%22


@app.route("/api/chat/portfolio/reset", methods=["GET"])
# @cache.cached(timeout=TIMEOUT)
def reset_portfolio_chat():
    user_id = request.args.get("user_id")
    if user_id in conversations:
        del conversations[user_id]
    return jsonify({"message": "Chat session reset."})


@app.route("/api/chat/portfolio/", methods=["GET"])
# @cache.cached(timeout=TIMEOUT)
def portfoilio_chat():
    user_id = request.args.get("user_id")
    portfolio = request.args.get("portfolio")
    if portfolio is None:
        return jsonify({"error": "No portfolio provided."})
    portfolio = portfolio.split(",")
    prompt = request.args.get("prompt")
    doc = request.args.get("doc")
    if user_id not in conversations:
        conversations[user_id] = PortfolioChat()
    bot = conversations[user_id]
    if doc:
        assert prompt is None
        bot.analyze_report(doc)
    if prompt:
        response = bot.process_message(prompt, portfolio)
    if not prompt and not doc:
        response = {"error": "No prompt or document provided."}
    return jsonify(response)


def rest_api_call(url, method, data=None, headers=None):
    url = "http://127.0.0.1:5000" + url
    if headers is None:
        headers = {"Content-Type": "application/json"}
    response = R.request(method, url, headers=headers, data=data)
    return response.json()


@app.route("/api/one/", methods=["GET"])
@cache.cached(timeout=60000000)
def get_portfolio(prompt="Improve my strategies"):
    tickers = request.args.get("portfolio").split(",")
    portfolio_data = []
    for ticker in tickers:
        history = rest_api_call(f"/api/finance/technicals/{ticker}", method="GET")
        last = history[-1]
        last_to_last = history[-2]
        month_ago = history[-31]
        percentage_change = (
            (last["Close"] - last_to_last["Close"]) / last_to_last["Close"] * 100
        )
        roi = ((last["Close"] / month_ago["Close"]) - 1) * 100
        roi_prev = ((last_to_last["Close"] / month_ago["Close"]) - 1) * 100
        roi_pct = ((roi - roi_prev) / roi_prev) * 100
        data = {
            "Value": last["Close"],
            "name": ticker,
            "ticker_name": ticker,
            "percentage_change": percentage_change,
            "sign": percentage_change > 0,
            "ESG": rest_api_call(f"/api/analytics/esg/{ticker}", method="GET")[
                "analysis"
            ]["total_esg"],
            "Risk": rest_api_call(f"/api/analytics/risk/{ticker}", method="GET")[
                "risk_score"
            ],
            "ROI": roi,
            "ROI_PCT": roi_pct,
            "Principle": month_ago["Close"],
        }
        data.update(rest_api_call(f"/api/company/basic/{ticker}", method="GET"))
        portfolio_data.append(data)
    ret = {
        "tickers": portfolio_data,
        "overall": pd.DataFrame(portfolio_data)[["ESG", "Risk", "ROI", "Principle"]]
        .mean()
        .to_dict(),
        "swot": rest_api_call(
            f"/api/analytics/swot?portfolio={','.join(tickers)}", "GET"
        ),
        "strategies": rest_api_call(
            f"/api/analytics/strategies?portfolio={','.join(tickers)}?prompt={prompt}",
            "GET",
            data=None,
            headers=None,
        ),
    }

    return ret


@app.route("/api/company/basic/<ticker>", methods=["GET"])
@cache.cached(timeout=TIMEOUT)
def get_company_basic(ticker):
    """Get company logo URL and name"""
    try:
        # Get company data
        data = company_info.get_company_data(ticker)

        # Return simplified response with just logo and names
        return jsonify(
            {
                "ticker": ticker,
                "name": data.get("name", ticker),
                "short_name": data.get("short_name", ticker),
                "logo_url": company_info.get_best_logo_url(ticker),
                "sector": data.get("sector", "Unknown"),
                "industry": data.get("industry", "Unknown"),
            }
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "ticker": ticker,
                    "name": ticker,
                    "short_name": ticker,
                    "logo_url": f"https://ui-avatars.com/api/?name={ticker}&background=random",
                    "sector": "Unknown",
                    "industry": "Unknown",
                    "error": str(e),
                }
            ),
            404,
        )


# Run the app
if __name__ == "__main__":
    app.run(debug=True)
