import yfinance as yf
import pandas as pd
from typing import Dict, Optional

class ESGAnalyzer:
    def __init__(self):
        self.esg_cache = {}
    
    def get_esg_score(self, ticker: str) -> Optional[Dict[str, float]]:
        """Get simple ESG scores for a company"""
        try:
            # Check cache first
            if ticker in self.esg_cache:
                return self.esg_cache[ticker]
            
            stock = yf.Ticker(ticker)
            sustainability = stock.sustainability
            
            if isinstance(sustainability, pd.DataFrame) and not sustainability.empty:
                # Get the first column (usually 'Value' or similar)
                column = sustainability.columns[0]
                esg_data = sustainability[column].to_dict()
                
                scores = {
                    'total_esg': esg_data.get('totalEsg', 50),
                    'environment': esg_data.get('environmentScore', 50),
                    'social': esg_data.get('socialScore', 50),
                    'governance': esg_data.get('governanceScore', 50)
                }
                
                # Normalize scores to 0-100 scale
                scores = {k: min(100, max(0, v)) for k, v in scores.items()}
                
                # Cache the result
                self.esg_cache[ticker] = scores
                return scores
            
            return None
            
        except Exception as e:
            print(f"Error getting ESG score for {ticker}: {str(e)}")
            return None

def main():
    analyzer = ESGAnalyzer()
    
    # Test with some stocks
    tickers = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA']
    
    for ticker in tickers:
        scores = analyzer.get_esg_score(ticker)
        if scores:
            print(f"\n{ticker} ESG Scores:")
            for metric, score in scores.items():
                print(f"{metric}: {score:.1f}")

if __name__ == "__main__":
    main() 