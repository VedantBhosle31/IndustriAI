import yfinance as yf
import requests
from typing import Dict, Optional
import time
from functools import lru_cache

class CompanyInfo:
    def __init__(self):
        self.cache_timeout = 24 * 60 * 60  # 24 hours in seconds
        self.cache = {}
    
    @lru_cache(maxsize=1000)
    def get_company_data(self, ticker: str) -> Dict:
        """Get company logo and basic information"""
        try:
            # Check cache first
            if ticker in self.cache:
                cached_data, timestamp = self.cache[ticker]
                if time.time() - timestamp < self.cache_timeout:
                    return cached_data
            
            stock = yf.Ticker(ticker)
            info = stock.info
            
            company_data = {
                'ticker': ticker,
                'name': info.get('longName', ''),
                'short_name': info.get('shortName', ''),
                'logo_url': info.get('logo_url', ''),
                'website': info.get('website', ''),
                'icon_url': None,
                'industry': info.get('industry', ''),
                'sector': info.get('sector', ''),
                'country': info.get('country', ''),
                'employees': info.get('fullTimeEmployees', 0),
                'summary': info.get('longBusinessSummary', '')
            }
            
            # Try different sources for logo
            company_data['logo_urls'] = self._get_logo_urls(company_data)
            
            # Cache the result
            self.cache[ticker] = (company_data, time.time())
            
            return company_data
            
        except Exception as e:
            print(f"Error getting company data for {ticker}: {str(e)}")
            return self._get_default_data(ticker)
    
    def _get_logo_urls(self, company_data: Dict) -> Dict[str, Optional[str]]:
        """Get logo URLs from multiple sources"""
        logo_urls = {
            'primary': None,
            'fallback1': None,
            'fallback2': None,
            'icon': None
        }
        
        try:
            # 1. Yahoo Finance logo (primary)
            if company_data['logo_url']:
                logo_urls['primary'] = company_data['logo_url']
            
            # 2. Clearbit API (fallback1)
            if company_data['website']:
                domain = company_data['website'].replace('https://', '').replace('http://', '').split('/')[0]
                logo_urls['fallback1'] = f"https://logo.clearbit.com/{domain}"
            
            # 3. S&P Global (fallback2)
            logo_urls['fallback2'] = f"https://www.spglobal.com/marketintelligence/en/company-logo/{company_data['ticker'].lower()}"
            
            # 4. Website favicon
            if company_data['website']:
                logo_urls['icon'] = f"{company_data['website'].rstrip('/')}/favicon.ico"
            
            # Verify URLs are accessible
            for key, url in logo_urls.items():
                if url and not self._verify_url(url):
                    logo_urls[key] = None
            
            return logo_urls
            
        except Exception as e:
            print(f"Error getting logo URLs: {str(e)}")
            return logo_urls
    
    def _verify_url(self, url: str) -> bool:
        """Verify if a URL is accessible"""
        try:
            response = requests.head(url, timeout=2)
            return response.status_code == 200
        except:
            return False
    
    def _get_default_data(self, ticker: str) -> Dict:
        """Return default data structure when company info is unavailable"""
        return {
            'ticker': ticker,
            'name': ticker,
            'short_name': ticker,
            'logo_url': None,
            'website': None,
            'icon_url': None,
            'industry': None,
            'sector': None,
            'country': None,
            'employees': 0,
            'summary': None,
            'logo_urls': {
                'primary': None,
                'fallback1': None,
                'fallback2': None,
                'icon': None
            }
        }
    
    def get_best_logo_url(self, ticker: str) -> str:
        """Get the best available logo URL that's actually displayable"""
        try:
            company_data = self.get_company_data(ticker)
            logo_urls = company_data['logo_urls']
            
            # Try each source in order until we find a working image
            potential_sources = [
                ('primary', logo_urls['primary']),
                ('clearbit', f"https://logo.clearbit.com/{company_data['website'].replace('https://', '').replace('http://', '').split('/')[0]}" if company_data['website'] else None),
                ('fallback1', f"https://companiesmarketcap.com/img/company-logos/{ticker.lower()}.webp"),
                ('fallback2', f"https://seeklogo.com/images/companies/{ticker.lower()}-logo.png"),
                ('icon', company_data['logo_urls']['icon'])
            ]
            
            for source, url in potential_sources:
                if url and self._is_valid_image(url):
                    return url
            
            # If no logo found, return a default placeholder
            return f"https://ui-avatars.com/api/?name={company_data['name']}&background=random"
            
        except Exception as e:
            print(f"Error getting logo for {ticker}: {str(e)}")
            # Return a generated placeholder with ticker
            return f"https://ui-avatars.com/api/?name={ticker}&background=random"
    
    def _is_valid_image(self, url: str) -> bool:
        """Check if URL returns a valid image"""
        try:
            response = requests.head(url, timeout=3)
            return (response.status_code == 200 and 
                    'image' in response.headers.get('content-type', '').lower())
        except:
            return False

def main():
    # Test the class
    info = CompanyInfo()
    
    # Test with some popular stocks
    tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META']
    
    for ticker in tickers:
        print(f"\nTesting {ticker}:")
        data = info.get_company_data(ticker)
        print(f"Name: {data['name']}")
        print("Logo URLs:")
        for source, url in data['logo_urls'].items():
            print(f"- {source}: {url}")
        print("-" * 50)

if __name__ == "__main__":
    main() 