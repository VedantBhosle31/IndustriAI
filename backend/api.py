from flask import Flask, request, jsonify
from risk_analysis import calculate_risk_score, categorize_risk
from scrape_yfinance import scrape_yfinance_data
from swot_analysis import generate_portfolio_swot, generate_trading_signals, parse_swot_analysis
from scrape_esg import scrape_esg_sustainalytics
from esg_analysis import ESGAnalyzer
from strategy_bot import generate_strategies
from chatbot import PortfolioChat
import pandas as pd
from references import ESG_SUSTAINALYTICS_MAPPING
import json
import os
os.environ['GROQ_API_KEY'] = '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'

esg_analyser = ESGAnalyzer()

conversations = {}

app = Flask(__name__)

# Root endpoint
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the Flask API!"})

# Example endpoint: GET request
@app.route("/api/finance/<qtype>/<ticker_name>", methods=["GET"])
def get_history(ticker_name,qtype):
    if not os.path.exists(f'data/finance/{ticker_name}'):
        os.makedirs(f"data/finance/{ticker_name}", exist_ok=True)
        scrape_yfinance_data(ticker_name, f"data/finance/{ticker_name}")
    if os.path.exists(f"data/finance/{ticker_name}/{qtype}.csv"):
        query = pd.read_csv(f"data/finance/{ticker_name}/{qtype}.csv")
        data = query.to_dict(orient='records')
        return jsonify(data)
    else:
        return jsonify({"message": f"No data found for {ticker_name}/{qtype}"})
# http://127.0.0.1:5000/api/finance/technicals/RELIANCE.NS

@app.route("/api/analytics/risk/<ticker_name>", methods=["GET"])
def get_risk(ticker_name):
    if os.path.exists(f"data/{ticker_name}/technicals.csv"):
        technicals = pd.read_csv(f"data/{ticker_name}/technicals.csv")
    else:
        os.makedirs(f"data/{ticker_name}", exist_ok=True)
        scrape_yfinance_data(ticker_name, f"data/{ticker_name}")
        technicals = pd.read_csv(f"data/{ticker_name}/technicals.csv")
    risk_scores = calculate_risk_score(technicals)
    risk_scores['category'] = categorize_risk(risk_scores['risk_score'])
    return jsonify(risk_scores)
# http://127.0.0.1:5000//api/analytics/risk/RELIANCE.NS

@app.route("/api/analytics/esg/<ticker_name>", methods=["GET"])
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
    data['analysis'] = esg_analyser.get_esg_score(ticker_name)
    return jsonify(data)
# http://127.0.0.1:5000//api/analytics/esg/RELIANCE.NS

@app.route('/api/analytics/swot', methods=['GET'])
def get_swot():
     # Retrieve tickers from query parameters
    tickers_param = request.args.get('portfolio')
    if not tickers_param:
        return jsonify({"error": "No tickers provided"}), 400

    # Convert comma-separated tickers into a list
    portfolio = tickers_param.split(',')

    swot = generate_portfolio_swot(portfolio)
    swot = parse_swot_analysis(swot)
    signals = generate_trading_signals(portfolio)
    data = {
        "swot": swot,
        "signals": signals
    }
    return jsonify(data)
# http://127.0.0.1:5000/api/analytics/swot?portfolio=AAPL,GOOGL,META,MSFT,AMZN

@app.route('/api/analytics/strategies', methods=['GET']) 
def get_strategies():
    prompt = request.args.get('prompt')
    portfolio = request.args.get('portfolio').split(',')
    strategies = generate_strategies(prompt, portfolio)
    return jsonify(strategies)
# https://127.0.0.1:5000/api/analytics/strategies?portfolio=AAPL,GOOGL,META,MSFT,AMZN?prompt=%22I%20want%20to%20focus%20on%20EV%20market%20and%20emerging%20tech,%20but%20avoid%20traditional%20energy.%20Looking%20for%20growth%20opportunities%20in%20next%202-3%20years.%22


@app.route('api/chat/portfolio/reset', methods=['GET'])
def reset_portfolio_chat():
    user_id = request.args.get('user_id')
    if user_id in conversations:
        del conversations[user_id]
    return jsonify({"message": "Chat session reset."})

@app.route('/api/chat/portfolio/', methods=['GET'])
def portfoilio_chat():
    user_id = request.args.get('user_id')
    portfolio = request.args.get('portfolio')
    if portfolio is None:
        return jsonify({"error": "No portfolio provided."})
    portfolio = portfolio.split(',') 
    prompt = request.args.get('prompt')
    doc = request.args.get('doc')
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

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
