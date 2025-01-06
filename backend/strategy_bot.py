from typing import Dict, List, Any
import yfinance as yf
import numpy as np
import pandas as pd
from groq import Groq
import os
from references import SECTOR_TICKERS


def normalize_sector_name(sector: str) -> str:
    """Normalize sector names to match our dictionary keys"""
    sector = sector.lower().strip()
    mapping = {
        'artificial intelligence': 'AI',
        'electric vehicles': 'EV',
        'ev': 'EV',
        'tech': 'Technology',
        'financial': 'Finance',
        'banking': 'Finance',
        'renewable': 'Green Energy',
        'solar': 'Green Energy',
        'chip': 'Semiconductors',
        'chips': 'Semiconductors',
        'ecommerce': 'E-commerce',
        'social': 'Social Media'
    }
    return mapping.get(sector, sector.title())

def generate_strategies(user_input: str, portfolio: List[str]) -> List[Dict[str, Any]]:
    """Generate three investment strategies based on user constraints and current portfolio"""
    
    prompt = f"""
    Based on this user input: "{user_input}"
    Current portfolio holdings: {', '.join(portfolio)}
    
    Generate 3 distinct forward-looking investment strategies. For each strategy provide:
    1. A strategy name
    2. A 2-sentence commentary explaining how this new strategy will transform the portfolio
    3. A SWOT analysis with exactly 15 words per section, focusing on the IMPACT of implementing this strategy:
    4. 2-3 relevant stock sectors to focus on
    
    Format as:
    Strategy 1:
    Name: [Strategy Name]
    Commentary: [2 sentences about how this strategy will change the portfolio]
    SWOT:
    Strengths: [15 words about how this strategy will enhance portfolio performance]
    Weaknesses: [15 words about potential drawbacks or challenges in implementing this strategy]
    Opportunities: [15 words about specific growth catalysts and market conditions this strategy targets]
    Threats: [15 words about market risks and external factors that could hinder this strategy]
    Sectors: [2-3 sectors]

    [Repeat for Strategy 2 and 3]

    Each strategy should be distinctly different and focus on future transformation rather than current holdings.
    """
    
    response = generate_completion(prompt)
    strategies = parse_strategies(response)
    
    # Add stock recommendations for each strategy, considering current portfolio
    for strategy in strategies:
        strategy['recommendations'] = get_portfolio_recommendations(strategy['sectors'], portfolio)
    
    return strategies

def calculate_stock_metrics(hist: pd.DataFrame, ticker: str) -> Dict[str, float]:
    """Calculate comprehensive stock metrics"""
    try:
        # Basic price metrics
        returns = hist['Close'].pct_change().dropna()
        current_price = hist['Close'].iloc[-1]
        
        # Performance metrics
        value_change_21d = ((current_price / hist['Close'].iloc[-21]) - 1) * 100
        monthly_return = ((current_price / hist['Close'].iloc[-30]) - 1) * 100
        ytd_return = ((current_price / hist['Close'].iloc[0]) - 1) * 100
        
        # Risk metrics
        volatility = returns.std() * np.sqrt(252) * 100
        downside_vol = returns[returns < 0].std() * np.sqrt(252) * 100
        max_drawdown = ((hist['Close'] / hist['Close'].expanding(min_periods=1).max()) - 1).min() * 100
        
        # Technical indicators
        sma_50 = hist['Close'].rolling(window=50).mean().iloc[-1]
        sma_200 = hist['Close'].rolling(window=200).mean().iloc[-1]
        rsi = calculate_rsi(hist['Close'])
        macd = calculate_macd(hist['Close'])
        
        # Volume and momentum
        volume_trend = (hist['Volume'].iloc[-5:].mean() / hist['Volume'].iloc[-20:-5].mean() - 1) * 100
        momentum = ((current_price / hist['Close'].iloc[-10]) - 1) * 100
        
        # ESG and risk scores (simulated - replace with actual data if available)
        esg_score = np.random.normal(65, 15)  # Simulated ESG score (0-100)
        governance_risk = np.random.normal(30, 10)  # Simulated governance risk (0-100)
        climate_risk = np.random.normal(40, 15)  # Simulated climate risk (0-100)
        
        return {
            'ticker': ticker,
            'value_change_21d': value_change_21d,
            'monthly_return': monthly_return,
            'ytd_return': ytd_return,
            'volatility': volatility,
            'downside_vol': downside_vol,
            'max_drawdown': max_drawdown,
            'momentum': momentum,
            'trend_signal': 1 if sma_50 > sma_200 else -1,
            'rsi': rsi,
            'macd_signal': macd,
            'volume_trend': volume_trend,
            'esg_score': esg_score,
            'governance_risk': governance_risk,
            'climate_risk': climate_risk,
            'risk_score': calculate_risk_score(volatility, downside_vol, rsi, esg_score)
        }
    except Exception as e:
        print(f"Error calculating metrics for {ticker}: {str(e)}")
        return {}

def calculate_rsi(prices: pd.Series, periods: int = 14) -> float:
    """Calculate Relative Strength Index"""
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=periods).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=periods).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs.iloc[-1]))

def calculate_macd(prices: pd.Series) -> int:
    """Calculate MACD signal"""
    exp1 = prices.ewm(span=12, adjust=False).mean()
    exp2 = prices.ewm(span=26, adjust=False).mean()
    macd = exp1 - exp2
    signal = macd.ewm(span=9, adjust=False).mean()
    return 1 if macd.iloc[-1] > signal.iloc[-1] else -1

def calculate_risk_score(volatility: float, downside_vol: float, rsi: float, esg_score: float) -> float:
    """Calculate comprehensive risk score including ESG factors"""
    vol_score = min(volatility / 50, 1)  # Normalize volatility
    down_score = min(abs(downside_vol) / 40, 1)  # Normalize downside vol
    rsi_score = abs(50 - rsi) / 50  # RSI deviation from neutral
    esg_score_norm = (100 - esg_score) / 100  # Convert ESG to risk (higher ESG = lower risk)
    
    return (vol_score * 0.3 + down_score * 0.3 + rsi_score * 0.2 + esg_score_norm * 0.2) * 100

def get_portfolio_recommendations(sectors: List[str], portfolio: List[str]) -> Dict[str, List[Dict[str, str]]]:
    """Get stock recommendations based on strategy sectors and current portfolio"""
    recommendations = {'buy': [], 'sell': []}
    
    try:
        # Normalize sector names
        normalized_sectors = [normalize_sector_name(sector) for sector in sectors]
        
        # Get all relevant tickers for the sectors
        potential_tickers = set()
        for sector in normalized_sectors:
            if sector in SECTOR_TICKERS:
                potential_tickers.update(SECTOR_TICKERS[sector])
        
        # Remove portfolio stocks from buy candidates
        buy_candidates = list(potential_tickers - set(portfolio))
        
        if not buy_candidates:
            print(f"Warning: No buy candidates found for sectors: {sectors}")
            return recommendations
        
        # Analyze portfolio stocks
        portfolio_metrics = []
        for ticker in portfolio:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(period="1y")
                if not hist.empty and len(hist) >= 21:  # Need at least 21 days
                    metrics = calculate_stock_metrics(hist, ticker)
                    if metrics:
                        portfolio_metrics.append(metrics)
            except Exception as e:
                continue
        
        # Analyze sector stocks for buying opportunities
        sector_metrics = []
        for ticker in buy_candidates:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(period="1y")
                if not hist.empty and len(hist) >= 21:
                    metrics = calculate_stock_metrics(hist, ticker)
                    if metrics:
                        sector_metrics.append(metrics)
            except Exception as e:
                continue
        
        # Generate buy recommendations
        if sector_metrics:
            # Score stocks based on multiple factors
            for metrics in sector_metrics:
                buy_score = (
                    (metrics['trend_signal'] == 1) * 0.3 +
                    (metrics['macd_signal'] == 1) * 0.2 +
                    (metrics['rsi'] < 70) * 0.2 +
                    (metrics['volume_trend'] > 0) * 0.15 +
                    (metrics['ytd_return'] > 0) * 0.15
                )
                metrics['buy_score'] = buy_score
            
            # Get top 2 buy recommendations
            buy_candidates = sorted(sector_metrics, key=lambda x: x.get('buy_score', 0), reverse=True)[:2]
            for stock in buy_candidates:
                signal = get_primary_signal(stock)
                recommendations['buy'].append({
                    'ticker': stock['ticker'],
                    'reason': signal
                })
        
        # Generate sell recommendations
        if portfolio_metrics:
            # Score stocks based on risk factors
            for metrics in portfolio_metrics:
                sell_score = (
                    (metrics['trend_signal'] == -1) * 0.3 +
                    (metrics['macd_signal'] == -1) * 0.2 +
                    (metrics['rsi'] > 70) * 0.2 +
                    (metrics['volume_trend'] < 0) * 0.15 +
                    (metrics['risk_score'] > 70) * 0.15
                )
                metrics['sell_score'] = sell_score
            
            # Get top 2 sell recommendations
            sell_candidates = sorted(portfolio_metrics, key=lambda x: x.get('sell_score', 0), reverse=True)[:2]
            for stock in sell_candidates:
                signal = get_primary_signal(stock)
                recommendations['sell'].append({
                    'ticker': stock['ticker'],
                    'reason': signal
                })
    
    except Exception as e:
        print(f"Error generating recommendations: {str(e)}")
    
    return recommendations

def get_primary_signal(metrics: Dict[str, float]) -> str:
    """Get the primary signal reason for a stock with consistent percentage formatting"""
    try:
        # High ESG opportunity
        if metrics['esg_score'] > 75 and metrics['value_change_21d'] > 0:
            return f"+{metrics['value_change_21d']:0.1f}% gain with strong ESG score ({metrics['esg_score']:0.1f})"
        
        # ESG risk alert
        elif metrics['esg_score'] < 40:
            return f"{metrics['value_change_21d']:0.1f}% move with ESG concerns ({metrics['esg_score']:0.1f})"
        
        # Climate risk alert
        elif metrics['climate_risk'] > 60:
            return f"{metrics['value_change_21d']:0.1f}% with high climate risk ({metrics['climate_risk']:0.1f})"
        
        # Strong momentum with good governance
        elif metrics['momentum'] > 0 and metrics['governance_risk'] < 30:
            return f"+{metrics['momentum']:0.1f}% momentum with low governance risk"
        
        # High volatility warning
        elif metrics['volatility'] > 40:
            return f"{metrics['value_change_21d']:0.1f}% move with {metrics['volatility']:0.1f}% volatility"
        
        # Significant drawdown
        elif metrics['max_drawdown'] < -20:
            return f"{metrics['value_change_21d']:0.1f}% with {metrics['max_drawdown']:0.1f}% max drawdown"
        
        # Default to trend signal
        elif metrics['trend_signal'] == 1:
            return f"+{metrics['value_change_21d']:0.1f}% uptrend with {metrics['risk_score']:0.1f} risk score"
        else:
            return f"{metrics['value_change_21d']:0.1f}% with {metrics['risk_score']:0.1f} risk score"
            
    except Exception as e:
        # Fallback with basic metric
        return f"{metrics.get('value_change_21d', 0):0.1f}% price movement"

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

def parse_strategies(response: str) -> List[Dict[str, Any]]:
    """Parse the AI response into structured strategy data"""
    strategies = []
    
    try:
        # Split response into individual strategies
        strategy_sections = response.split('Strategy')[1:]  # Skip empty first split
        
        for section in strategy_sections:
            strategy = {
                'name': '',
                'commentary': '',
                'swot': {
                    'strengths': '',
                    'weaknesses': '',
                    'opportunities': '',
                    'threats': ''
                },
                'sectors': []
            }
            
            # Parse each line
            lines = section.strip().split('\n')
            current_section = None
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                if line.startswith('Name:'):
                    strategy['name'] = line.replace('Name:', '').strip()
                elif line.startswith('Commentary:'):
                    strategy['commentary'] = line.replace('Commentary:', '').strip()
                elif line.startswith('Strengths:'):
                    strategy['swot']['strengths'] = line.replace('Strengths:', '').strip()
                elif line.startswith('Weaknesses:'):
                    strategy['swot']['weaknesses'] = line.replace('Weaknesses:', '').strip()
                elif line.startswith('Opportunities:'):
                    strategy['swot']['opportunities'] = line.replace('Opportunities:', '').strip()
                elif line.startswith('Threats:'):
                    strategy['swot']['threats'] = line.replace('Threats:', '').strip()
                elif line.startswith('Sectors:'):
                    sectors = line.replace('Sectors:', '').strip()
                    strategy['sectors'] = [s.strip() for s in sectors.split(',')]
            
            if strategy['name']:  # Only add if we found a valid strategy
                strategies.append(strategy)
    
    except Exception as e:
        print(f"Error parsing strategies: {str(e)}")
        return []
    
    return strategies

def main():
    # Example usage with portfolio
    user_input = "I want to focus on EV market and emerging tech, but avoid traditional energy. Looking for growth opportunities in next 2-3 years."
    portfolio = ["AAPL", "MSFT", "GOOGL", "AMZN", "META"]
    
    strategies = generate_strategies(user_input, portfolio)
    
    # Print strategies
    for i, strategy in enumerate(strategies, 1):
        print(f"\nStrategy {i}: {strategy['name']}")
        print(f"Commentary: {strategy['commentary']}")
        print("\nSWOT Analysis:")
        for key, value in strategy['swot'].items():
            print(f"{key.capitalize()}: {value}")
        print("\nRecommended Sectors:", ', '.join(strategy['sectors']))
        
        print("\nRecommended Actions:")
        for action in ['buy', 'sell']:
            print(f"\n{action.upper()} Recommendations:")
            for rec in strategy['recommendations'][action]:
                print(f"{'↑' if action == 'buy' else '↓'} {rec['ticker']}: {rec['reason']}")
        
        print("\n" + "="*50)

if __name__ == "__main__":
    main()