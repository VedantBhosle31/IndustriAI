import re
import numpy as np
import pandas as pd
import yfinance as yf
from typing import Dict, Any, List
import os
from groq import Groq
from datetime import datetime, timedelta


def calculate_max_drawdown(prices: pd.Series) -> float:
    """Calculate the maximum drawdown percentage"""
    peak = prices.expanding(min_periods=1).max()
    drawdown = (prices - peak) / peak
    return float(drawdown.min() * 100)

def analyze_portfolio(tickers: List[str], period: str = "1y") -> Dict[str, Any]:
    """Comprehensive portfolio analysis including quantitative metrics and AI insights"""
    portfolio_data = {}
    
    for ticker in tickers:
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period=period)
            
            if hist.empty:
                print(f"Warning: No data available for {ticker}, skipping...")
                continue
                
            # Calculate quantitative metrics
            metrics = calculate_stock_metrics(hist, ticker)
            
            # Generate AI insights
            ai_insights = generate_stock_insights(metrics, stock.info)
            
            # Get trading recommendations
            recommendations = generate_trading_recommendations(metrics, stock.info)
            
            portfolio_data[ticker] = {**metrics, **ai_insights, **recommendations}
            
        except Exception as e:
            print(f"Error analyzing {ticker}: {str(e)}")
            continue
    
    if not portfolio_data:
        raise ValueError("No valid stocks found in portfolio")
        
    return portfolio_data

def calculate_stock_metrics(hist: pd.DataFrame, ticker: str) -> Dict[str, float]:
    """Calculate key quantitative metrics for a stock"""
    daily_returns = hist['Close'].pct_change()
    
    # Calculate periods for different metrics
    days_21 = hist['Close'].iloc[-21:] if len(hist) >= 21 else hist['Close']
    days_67 = hist['Close'].iloc[-67:] if len(hist) >= 67 else hist['Close']
    days_321 = hist['Close'].iloc[-321:] if len(hist) >= 321 else hist['Close']
    
    metrics = {
        'ticker': ticker,
        'current_price': hist['Close'].iloc[-1],
        'value_change_21': (hist['Close'].iloc[-1] / hist['Close'].iloc[-21] - 1) * 100 if len(hist) >= 21 else 0,
        'risk_change_67': calculate_risk_change(days_67),
        'esg_change_321': calculate_esg_score_change(days_321),
        'volatility': daily_returns.std() * np.sqrt(252) * 100,
        'sharpe_ratio': (daily_returns.mean() / daily_returns.std()) * np.sqrt(252) if daily_returns.std() != 0 else 0,
        'max_drawdown': calculate_max_drawdown(hist['Close']),
        'rsi': calculate_rsi(hist['Close']),
    }
    
    return metrics

def calculate_risk_change(prices: pd.Series) -> float:
    """Calculate risk change over the period"""
    volatility = prices.pct_change().std() * np.sqrt(252) * 100
    return volatility

def calculate_esg_score_change(prices: pd.Series) -> float:
    """Simulate ESG score change (in practice, you'd pull this from an ESG data provider)"""
    return np.random.uniform(-30, 30)  # Placeholder for actual ESG data

def generate_trading_recommendations(metrics: Dict[str, float], stock_info: Dict[str, Any]) -> Dict[str, Any]:
    """Generate specific trading recommendations with explanations"""
    prompt = f"""
    Based on the following metrics for {metrics['ticker']}:
    - Value change (21 days): {metrics['value_change_21']:.1f}%
    - Risk change (67 days): {metrics['risk_change_67']:.1f}%
    - ESG change (321 days): {metrics['esg_change_321']:.1f}%
    - Current volatility: {metrics['volatility']:.1f}%
    - Sharpe ratio: {metrics['sharpe_ratio']:.2f}
    
    Provide a single-line trading recommendation (BUY or SELL) with a brief reason.
    Format: [BUY/SELL]: [Brief reason focusing on the most significant metric]
    """
    
    recommendation = generate_completion(prompt)
    
    return {
        'recommendation': recommendation.split(':')[0].strip(),
        'reason': recommendation.split(':')[1].strip() if ':' in recommendation else '',
        'metrics': {
            'value_21d': f"+{metrics['value_change_21']:.1f}%" if metrics['value_change_21'] > 0 else f"{metrics['value_change_21']:.1f}%",
            'risk_67d': f"+{metrics['risk_change_67']:.1f}%" if metrics['risk_change_67'] > 0 else f"{metrics['risk_change_67']:.1f}%",
            'esg_321d': f"+{metrics['esg_change_321']:.1f}%" if metrics['esg_change_321'] > 0 else f"{metrics['esg_change_321']:.1f}%"
        }
    }

def generate_completion(prompt: str) -> str:
    """Generate AI completion using Groq"""
    try:
        client = Groq(
            api_key=os.environ.get("GROQ_API_KEY"),
        )
        
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
        )
        
        if hasattr(chat_completion, 'content'):
            return str(chat_completion.content)
        elif hasattr(chat_completion, 'choices'):
            return str(chat_completion.choices[0].message.content)
        else:
            return str(chat_completion)
    except Exception as e:
        print(f"Error in AI completion: {str(e)}")
        return "AI analysis temporarily unavailable"

def calculate_rsi(prices: pd.Series, period: int = 14) -> float:
    """Calculate Relative Strength Index"""
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs.iloc[-1])) if loss.iloc[-1] != 0 else 50

def generate_stock_insights(metrics: Dict[str, float], stock_info: Dict[str, Any]) -> Dict[str, str]:
    """Generate SWOT analysis using AI"""
    prompt = f"""
    Based on the following metrics for {metrics['ticker']}:
    - Value change (21 days): {metrics['value_change_21']:.1f}%
    - Risk change (67 days): {metrics['risk_change_67']:.1f}%
    - ESG change (321 days): {metrics['esg_change_321']:.1f}%
    - Volatility: {metrics['volatility']:.1f}%
    - Sharpe ratio: {metrics['sharpe_ratio']:.2f}
    - RSI: {metrics['rsi']:.1f}

    Provide a concise SWOT analysis in the following format:
    Strengths: (one line)
    Weaknesses: (one line)
    Opportunities: (one line)
    Threats: (one line)
    """
    
    swot_analysis = generate_completion(prompt)
    
    return {
        'swot': swot_analysis,
        'analysis_date': datetime.now().strftime('%Y-%m-%d')
    }

def calculate_portfolio_metrics(portfolio: List[str]) -> Dict[str, float]:
    """Calculate comprehensive portfolio metrics for SWOT analysis"""
    metrics = {
        'avg_return': 0.0,
        'portfolio_volatility': 0.0,
        'beta': 1.0,
        'sector_diversity': 0.0,
        'avg_correlation': 0.0
    }
    
    try:
        # Get market data (S&P 500 as benchmark)
        spy = yf.Ticker("SPY")
        market_hist = spy.history(period="1y")
        market_returns = market_hist['Close'].pct_change().dropna()
        
        returns_data = []
        volatilities = []
        betas = []
        
        for ticker in portfolio:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(period="1y")
                
                if not hist.empty and len(hist) > 30:  # Ensure sufficient data
                    returns = hist['Close'].pct_change().dropna()
                    annual_return = returns.mean() * 252 * 100
                    annual_vol = returns.std() * np.sqrt(252) * 100
                    beta = returns.cov(market_returns) / market_returns.var()
                    
                    returns_data.append(annual_return)
                    volatilities.append(annual_vol)
                    betas.append(beta)
            
            except Exception as e:
                print(f"Warning: Error processing {ticker}: {str(e)}")
                continue
        
        if returns_data:
            metrics.update({
                'avg_return': np.mean(returns_data),
                'portfolio_volatility': np.mean(volatilities),
                'beta': np.mean(betas),
                'sector_diversity': 75.0,  # Placeholder - implement actual sector analysis if needed
                'avg_correlation': 0.5  # Placeholder - implement if needed
            })
    
    except Exception as e:
        print(f"Warning: Error in portfolio metrics calculation: {str(e)}")
    
    return metrics

def generate_portfolio_swot(portfolio: List[str]) -> str:
    """Generate a portfolio-level SWOT analysis based on quantitative metrics"""
    metrics = calculate_portfolio_metrics(portfolio)
    
    prompt = f"""
    Based on portfolio analysis with these metrics:
    - Average Annual Return: {metrics['avg_return']:.1f}%
    - Portfolio Volatility: {metrics['portfolio_volatility']:.1f}%
    - Portfolio Beta: {metrics['beta']:.2f}
    - Sector Diversity Score: {metrics['sector_diversity']:.1f}%
    - Average Inter-stock Correlation: {metrics['avg_correlation']:.2f}
    
    Provide a SWOT analysis. Each section must be EXACTLY 10 words, focusing on:
    Strengths: Current portfolio advantages (returns, stability, diversity)
    Weaknesses: Current portfolio limitations (risk, concentration, performance)
    Opportunities: Potential future gains (market conditions, sectors, trends)
    Threats: Potential risks (market risks, economic factors, sector challenges)

    Format as:
    Strengths: [10 words]
    Weaknesses: [10 words]
    Opportunities: [10 words]
    Threats: [10 words]
    """
    
    return generate_completion(prompt)

def generate_trading_signals(portfolio: List[str]) -> Dict[str, List[Dict[str, str]]]:
    """Generate top 2 buy and sell recommendations with quantitative reasons"""
    recommendations = {'buy': [], 'sell': []}
    
    try:
        # Analyze each stock
        stock_metrics = []
        valid_tickers = ["AAPL", "GOOGL", "META", "MSFT", "AMZN", "NVDA", "TSLA", "JPM", "V", "WMT"]
        
        # Filter portfolio to only include valid tickers
        portfolio = [ticker for ticker in portfolio if ticker in valid_tickers]
        
        for ticker in portfolio:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(period="1y")
                
                if not hist.empty and len(hist) >= 21:  # Only need 21 days minimum
                    value_change = ((hist['Close'].iloc[-1] / hist['Close'].iloc[-21]) - 1) * 100
                    risk_change = hist['Close'].pct_change().std() * np.sqrt(252) * 100
                    esg_change = np.random.uniform(-30, 30)  # Placeholder for ESG data
                    
                    metrics = {
                        'ticker': ticker,
                        'value_21d': value_change,
                        'risk_67d': risk_change,
                        'esg_321d': esg_change
                    }
                    stock_metrics.append(metrics)
            except Exception as e:
                print(f"Warning: Error analyzing {ticker}: {str(e)}")
                continue
        
        # Ensure we have metrics before sorting
        if stock_metrics:
            # Sort by value change for buy recommendations (highest value change)
            buy_candidates = sorted(stock_metrics, key=lambda x: x['value_21d'], reverse=True)
            # Sort by risk for sell recommendations (highest risk)
            sell_candidates = sorted(stock_metrics, key=lambda x: x['risk_67d'], reverse=True)
            
            # Take top 2 for each category
            for stock in buy_candidates[:2]:
                recommendations['buy'].append({
                    'ticker': stock['ticker'],
                    'reason': f"+{stock['value_21d']:.1f}% value since 21 days",
                    'metrics': {
                        'value_21d': f"+{stock['value_21d']:.1f}%",
                        'risk_67d': f"{stock['risk_67d']:.1f}%",
                        'esg_321d': f"{stock['esg_321d']:.1f}%"
                    }
                })
            
            for stock in sell_candidates[:2]:
                recommendations['sell'].append({
                    'ticker': stock['ticker'],
                    'reason': f"+{stock['risk_67d']:.1f}% risk since 67 days",
                    'metrics': {
                        'value_21d': f"{stock['value_21d']:.1f}%",
                        'risk_67d': f"+{stock['risk_67d']:.1f}%",
                        'esg_321d': f"{stock['esg_321d']:.1f}%"
                    }
                })
    
    except Exception as e:
        print(f"Warning: Error generating trading signals: {str(e)}")
    
    return recommendations

def get_stock_metrics(ticker: str) -> Dict[str, str]:
    """Get relevant metrics for a stock recommendation"""
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1y")
        
        return {
            'value_21d': f"+{calculate_change(hist, 21):.1f}%",
            'risk_67d': f"+{calculate_risk_change(hist.iloc[-67:]):.1f}%",
            'esg_321d': f"+{calculate_esg_score_change(hist.iloc[-321:]):.1f}%"
        }
    except:
        return {
            'value_21d': "N/A",
            'risk_67d': "N/A",
            'esg_321d': "N/A"
        }

def calculate_change(hist: pd.DataFrame, days: int) -> float:
    """Calculate percentage change over specified days"""
    if len(hist) >= days:
        return (hist['Close'].iloc[-1] / hist['Close'].iloc[-days] - 1) * 100
    return 0.0

def parse_swot_analysis(swot_text):
    """
    Parses the SWOT analysis text into a dictionary using regex.

    Parameters:
        swot_text (str): The SWOT analysis text.

    Returns:
        dict: A structured dictionary containing SWOT categories and their descriptions.
    """
    swot_pattern = r"(Strengths|Weaknesses|Opportunities|Threats): (.+)"
    matches = re.findall(swot_pattern, swot_text)
    
    swot_dict = {match[0]: match[1].strip() for match in matches}
    return swot_dict

def main():
    # Updated portfolio with currently valid tickers
    portfolio = ["AAPL", "GOOGL", "META", "MSFT", "AMZN"]
    
    # Generate SWOT analysis
    print("\nPortfolio SWOT Analysis:")
    print("-" * 50)
    swot = generate_portfolio_swot(portfolio)
    print(swot)
    
    # Generate trading signals
    signals = generate_trading_signals(portfolio)
    
    print("\nRecommended Actions:")
    for action_type in ['buy', 'sell']:
        print(f"\n{action_type.upper()} Recommendations:")
        for rec in signals[action_type]:
            print(f"{'↑' if action_type == 'buy' else '↓'} {rec['ticker']}: {rec['reason']}")
            print(f"   Value (21d): {rec['metrics']['value_21d']}")
            print(f"   Risk (67d): {rec['metrics']['risk_67d']}")
            print(f"   ESG (321d): {rec['metrics']['esg_321d']}")

if __name__ == "__main__":
    main()
