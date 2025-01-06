from typing import Dict, List, Any
import yfinance as yf
import pandas as pd
import numpy as np
from groq import Groq
import os
from dotenv import load_dotenv
import PyPDF2
import re

os.environ['GROQ_API_KEY'] = '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'
# Load environment variables from .env file
load_dotenv()

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

SECTOR_TICKERS = {
    'Technology': ['AAPL', 'MSFT', 'NVDA', 'AMD', 'GOOGL', 'META', 'INTC', 'CRM', 'ADBE', 'ORCL'],
    'EV': ['TSLA', 'RIVN', 'NIO', 'GM', 'F', 'LCID', 'XPEV', 'LI', 'FSR'],
    'Healthcare': ['JNJ', 'PFE', 'UNH', 'ABBV', 'MRK', 'LLY', 'TMO', 'ABT', 'BMY', 'AMGN'],
    'Finance': ['JPM', 'BAC', 'V', 'MA', 'GS', 'MS', 'BLK', 'SCHW', 'AXP', 'C'],
    'Energy': ['XOM', 'CVX', 'COP', 'SLB', 'EOG', 'PXD', 'PSX', 'VLO', 'MPC', 'OXY'],
    'AI': ['NVDA', 'GOOGL', 'META', 'MSFT', 'AMD', 'IBM', 'PLTR', 'CRM', 'SNOW', 'AI'],
    'Semiconductors': ['NVDA', 'AMD', 'INTC', 'TSM', 'QCOM', 'AMAT', 'ASML', 'MU', 'LRCX', 'ADI'],
    'Cloud': ['MSFT', 'AMZN', 'GOOGL', 'CRM', 'SNOW', 'NET', 'DDOG', 'CRWD', 'ZS', 'PANW'],
    'E-commerce': ['AMZN', 'SHOP', 'MELI', 'CPNG', 'JD', 'PDD', 'ETSY', 'EBAY', 'W', 'BABA'],
    'Social Media': ['META', 'SNAP', 'PINS', 'TWTR', 'GOOGL', 'MTCH', 'BMBL', 'HOOD', 'U', 'RBLX'],
    'Biotech': ['AMGN', 'GILD', 'REGN', 'VRTX', 'BIIB', 'MRNA', 'BNTX', 'SGEN', 'INCY', 'ALNY'],
    'Green Energy': ['ENPH', 'SEDG', 'FSLR', 'RUN', 'SPWR', 'NEE', 'BE', 'PLUG', 'STEM', 'CHPT']
}

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

class PortfolioChat:
    def __init__(self):
        self.chat_history = []
        self.current_portfolio = None
        self.current_analysis = None
        self.report_analysis = {}  # Store report analyses
    
    def analyze_portfolio(self, portfolio: List[str]) -> Dict[str, Any]:
        """Analyze the given portfolio and return comprehensive metrics"""
        analysis = {
            'portfolio_metrics': {},
            'stock_metrics': {},
            'sector_exposure': {},
            'risk_profile': {},
            'esg_metrics': {}
        }
        
        try:
            # Get individual stock metrics
            for ticker in portfolio:
                stock = yf.Ticker(ticker)
                hist = stock.history(period="1y")
                if not hist.empty and len(hist) >= 21:
                    metrics = calculate_stock_metrics(hist, ticker)
                    analysis['stock_metrics'][ticker] = metrics
            
            # Calculate portfolio level metrics
            if analysis['stock_metrics']:
                analysis['portfolio_metrics'] = self._calculate_portfolio_metrics(analysis['stock_metrics'])
                analysis['sector_exposure'] = self._calculate_sector_exposure(portfolio)
                analysis['risk_profile'] = self._calculate_risk_profile(analysis['stock_metrics'])
                analysis['esg_metrics'] = self._calculate_esg_metrics(analysis['stock_metrics'])
        
        except Exception as e:
            print(f"Error analyzing portfolio: {str(e)}")
        
        return analysis
    
    def process_message(self, message: str, portfolio: List[str] = None) -> str:
        """Process user message and return AI response"""
        try:
            # Update portfolio if provided
            if portfolio:
                self.current_portfolio = portfolio
                self.current_analysis = self.analyze_portfolio(portfolio)
            
            # Create context from current analysis and reports
            context = self._create_chat_context()
            
            # Add report context if available
            if self.report_analysis:
                context += "\n\nReport Analysis:\n"
                for report_name, analysis in self.report_analysis.items():
                    context += f"\nReport: {report_name}\n"
                    if 'metrics' in analysis:
                        metrics = analysis['metrics']
                        if metrics.get('revenue'):
                            context += f"Revenue: ${metrics['revenue'][-1]}M\n"
                        if metrics.get('margins'):
                            context += f"Latest Margin: {metrics['margins'][-1]['value']}%\n"
            
            # Generate AI response
            prompt = f"""
            You are a professional investment advisor. Use the following portfolio and report analysis to answer the user's question.
            
            Context:
            {context}
            
            User Question: {message}
            
            Provide a clear, concise response focusing on the most relevant metrics and actionable insights.
            """
            
            return self._generate_completion(prompt)
            
        except Exception as e:
            return f"Error processing message: {str(e)}"
    
    def _calculate_portfolio_metrics(self, stock_metrics: Dict[str, Dict]) -> Dict[str, float]:
        """Calculate aggregate portfolio metrics"""
        metrics = {}
        try:
            # Equal-weighted for simplicity
            n_stocks = len(stock_metrics)
            if n_stocks > 0:
                metrics['total_return'] = sum(m['value_change_21d'] for m in stock_metrics.values()) / n_stocks
                metrics['portfolio_volatility'] = sum(m['volatility'] for m in stock_metrics.values()) / n_stocks
                metrics['avg_esg_score'] = sum(m['esg_score'] for m in stock_metrics.values()) / n_stocks
                metrics['avg_risk_score'] = sum(m['risk_score'] for m in stock_metrics.values()) / n_stocks
                metrics['max_drawdown'] = min(m['max_drawdown'] for m in stock_metrics.values())
        except Exception as e:
            print(f"Error calculating portfolio metrics: {str(e)}")
        return metrics
    
    def _calculate_sector_exposure(self, portfolio: List[str]) -> Dict[str, float]:
        """Calculate sector exposure percentages"""
        exposure = {}
        try:
            for ticker in portfolio:
                sector = None
                for sec, tickers in SECTOR_TICKERS.items():
                    if ticker in tickers:
                        sector = sec
                        break
                if sector:
                    exposure[sector] = exposure.get(sector, 0) + (1 / len(portfolio)) * 100
        except Exception as e:
            print(f"Error calculating sector exposure: {str(e)}")
        return exposure
    
    def _calculate_risk_profile(self, stock_metrics: Dict[str, Dict]) -> Dict[str, Any]:
        """Calculate comprehensive risk profile"""
        profile = {}
        try:
            metrics = list(stock_metrics.values())
            profile['volatility_risk'] = sum(m['volatility'] for m in metrics) / len(metrics)
            profile['drawdown_risk'] = min(m['max_drawdown'] for m in metrics)
            profile['esg_risk'] = 100 - sum(m['esg_score'] for m in metrics) / len(metrics)
            profile['climate_risk'] = sum(m['climate_risk'] for m in metrics) / len(metrics)
            profile['governance_risk'] = sum(m['governance_risk'] for m in metrics) / len(metrics)
        except Exception as e:
            print(f"Error calculating risk profile: {str(e)}")
        return profile
    
    def _calculate_esg_metrics(self, stock_metrics: Dict[str, Dict]) -> Dict[str, float]:
        """Calculate ESG-related metrics"""
        metrics = {}
        try:
            values = list(stock_metrics.values())
            metrics['avg_esg_score'] = sum(m['esg_score'] for m in values) / len(values)
            metrics['min_esg_score'] = min(m['esg_score'] for m in values)
            metrics['max_esg_score'] = max(m['esg_score'] for m in values)
            metrics['avg_climate_risk'] = sum(m['climate_risk'] for m in values) / len(values)
            metrics['avg_governance_risk'] = sum(m['governance_risk'] for m in values) / len(values)
        except Exception as e:
            print(f"Error calculating ESG metrics: {str(e)}")
        return metrics
    
    def _create_chat_context(self) -> str:
        """Create a context string from current analysis"""
        if not self.current_analysis:
            return "No portfolio analysis available."
        
        context = []
        
        # Portfolio overview
        if self.current_analysis['portfolio_metrics']:
            metrics = self.current_analysis['portfolio_metrics']
            context.append(f"Portfolio Overview:")
            context.append(f"- Total Return (21d): {metrics.get('total_return', 0):0.1f}%")
            context.append(f"- Portfolio Volatility: {metrics.get('portfolio_volatility', 0):0.1f}%")
            context.append(f"- Average ESG Score: {metrics.get('avg_esg_score', 0):0.1f}")
            context.append(f"- Risk Score: {metrics.get('avg_risk_score', 0):0.1f}")
        
        # Sector exposure
        if self.current_analysis['sector_exposure']:
            context.append("\nSector Exposure:")
            for sector, exposure in self.current_analysis['sector_exposure'].items():
                context.append(f"- {sector}: {exposure:0.1f}%")
        
        # Risk profile
        if self.current_analysis['risk_profile']:
            profile = self.current_analysis['risk_profile']
            context.append("\nRisk Profile:")
            context.append(f"- Volatility Risk: {profile.get('volatility_risk', 0):0.1f}%")
            context.append(f"- Maximum Drawdown: {profile.get('drawdown_risk', 0):0.1f}%")
            context.append(f"- ESG Risk Level: {profile.get('esg_risk', 0):0.1f}")
            context.append(f"- Climate Risk: {profile.get('climate_risk', 0):0.1f}")
        
        return "\n".join(context)
    
    def _generate_completion(self, prompt: str) -> str:
        """Generate AI completion using Groq"""
        try:
            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key:
                return """API key not found. Please set your GROQ_API_KEY environment variable.
                         You can get an API key from https://console.groq.com/keys"""
            
            client = Groq(api_key=api_key)
            chat_completion = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192",
            )
            return str(chat_completion.choices[0].message.content)
        except Exception as e:
            # Fallback response with basic analysis
            try:
                # Extract key metrics for a simple response
                if self.current_analysis and self.current_analysis['portfolio_metrics']:
                    metrics = self.current_analysis['portfolio_metrics']
                    return f"""Unable to generate AI response, but here are your key metrics:
                        - Total Return (21d): {metrics.get('total_return', 0):0.1f}%
                        - Portfolio Volatility: {metrics.get('portfolio_volatility', 0):0.1f}%
                        - Risk Score: {metrics.get('avg_risk_score', 0):0.1f}
                        Please set up your GROQ_API_KEY for detailed AI analysis."""
            except:
                pass
            
            return "Please set up your GROQ_API_KEY environment variable for AI analysis."
    
    def analyze_report(self, file_path: str) -> Dict[str, Any]:
        """Analyze a PDF report and extract insights"""
        try:
            # Read PDF
            extracted_text = self._read_pdf(file_path)
            if not extracted_text:
                return {"error": "Failed to read PDF file"}
            
            # Extract metrics
            metrics = self._extract_key_metrics(extracted_text)
            
            # Generate AI analysis
            analysis = self._analyze_report_content(extracted_text, metrics)
            
            # Store analysis
            report_key = os.path.basename(file_path)
            self.report_analysis[report_key] = {
                'metrics': metrics,
                'analysis': analysis,
                'timestamp': pd.Timestamp.now()
            }
            
            return self.report_analysis[report_key]
            
        except Exception as e:
            return {"error": f"Error analyzing report: {str(e)}"}
    
    def _read_pdf(self, file_path: str) -> str:
        """Read and extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text()
                return text
        except Exception as e:
            print(f"Error reading PDF: {str(e)}")
            return ""
    
    def _extract_key_metrics(self, text: str) -> Dict[str, Any]:
        """Extract key financial metrics and information from any type of PDF"""
        metrics = {
            'revenue': [],
            'margins': [],
            'growth_rates': [],
            'ratios': [],
            'key_stats': {},
            'dates': [],
            'currency_values': [],
            'percentages': [],
            'company_info': {},
            'market_data': {}
        }
        
        try:
            # Common patterns
            patterns = {
                'revenue': [
                    r"revenue.*?\$?([\d,]+\.?\d*)\s*(million|billion|M|B)?",
                    r"sales.*?\$?([\d,]+\.?\d*)\s*(million|billion|M|B)?",
                    r"turnover.*?\$?([\d,]+\.?\d*)\s*(million|billion|M|B)?"
                ],
                'margins': [
                    r"(gross|operating|net|profit|ebitda)\s+margin.*?(\d+\.?\d*)%",
                    r"margin of (\d+\.?\d*)%"
                ],
                'growth': [
                    r"(revenue|earnings|income|sales|profit)\s+growth.*?(\d+\.?\d*)%",
                    r"grew by (\d+\.?\d*)%",
                    r"increased by (\d+\.?\d*)%"
                ],
                'ratios': [
                    r"(p/e|price[/-]earnings).*?(\d+\.?\d*)",
                    r"(p/b|price[/-]book).*?(\d+\.?\d*)",
                    r"(d/e|debt[/-]equity).*?(\d+\.?\d*)",
                    r"(roi|return on investment).*?(\d+\.?\d*)%",
                    r"(roa|return on assets).*?(\d+\.?\d*)%",
                    r"(roe|return on equity).*?(\d+\.?\d*)%"
                ],
                'dates': [
                    r"\b(19|20)\d{2}\b",  # Years
                    r"\b(Q[1-4]|Quarter [1-4])\b",  # Quarters
                    r"\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? (19|20)\d{2}\b"  # Full dates
                ],
                'currency': [
                    r"\$\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)",
                    r"(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*dollars",
                    r"USD\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)"
                ],
                'percentages': [
                    r"(\d+\.?\d*)\s*%"
                ],
                'company_info': [
                    r"company name:?\s*([A-Za-z0-9\s,\.]+)(?:\n|$)",
                    r"ticker:?\s*([A-Z]+)(?:\n|$)",
                    r"industry:?\s*([A-Za-z\s]+)(?:\n|$)",
                    r"sector:?\s*([A-Za-z\s]+)(?:\n|$)"
                ],
                'market_data': [
                    r"market cap.*?\$?([\d,]+\.?\d*)\s*(million|billion|M|B)?",
                    r"share price.*?\$?([\d,]+\.?\d*)",
                    r"volume.*?([\d,]+)"
                ]
            }
            
            # Extract all patterns
            for category, pattern_list in patterns.items():
                for pattern in pattern_list:
                    matches = re.finditer(pattern, text.lower())
                    for match in matches:
                        if category == 'revenue':
                            value = float(match.group(1).replace(',', ''))
                            unit = match.group(2) if len(match.groups()) > 1 else None
                            if unit and ('b' in str(unit).lower() or 'billion' in str(unit).lower()):
                                value *= 1000
                            metrics['revenue'].append(value)
                        
                        elif category == 'margins':
                            margin_type = match.group(1) if len(match.groups()) > 1 else 'margin'
                            margin_value = float(match.group(-1))
                            metrics['margins'].append({
                                'type': margin_type,
                                'value': margin_value
                            })
                        
                        elif category == 'growth':
                            growth_type = match.group(1) if len(match.groups()) > 1 else 'growth'
                            growth_value = float(match.group(-1))
                            metrics['growth_rates'].append({
                                'type': growth_type,
                                'value': growth_value
                            })
                        
                        elif category == 'ratios':
                            ratio_type = match.group(1)
                            ratio_value = float(match.group(2))
                            metrics['ratios'].append({
                                'type': ratio_type,
                                'value': ratio_value
                            })
                        
                        elif category == 'dates':
                            metrics['dates'].append(match.group(0))
                        
                        elif category == 'currency':
                            metrics['currency_values'].append(float(match.group(1).replace(',', '')))
                        
                        elif category == 'percentages':
                            metrics['percentages'].append(float(match.group(1)))
                        
                        elif category == 'company_info':
                            key = pattern.split(':')[0].replace('r"', '').strip()
                            metrics['company_info'][key] = match.group(1).strip()
                        
                        elif category == 'market_data':
                            key = pattern.split('.*')[0].replace('r"', '').strip()
                            value = float(match.group(1).replace(',', ''))
                            unit = match.group(2) if len(match.groups()) > 1 else None
                            if unit and ('b' in str(unit).lower() or 'billion' in str(unit).lower()):
                                value *= 1000
                            metrics['market_data'][key] = value

            # Extract tables if present (simple table detection)
            table_data = self._extract_tables(text)
            if table_data:
                metrics['tables'] = table_data
            
            # Clean up empty categories
            metrics = {k: v for k, v in metrics.items() if v}
            
        except Exception as e:
            print(f"Error extracting metrics: {str(e)}")
        
        return metrics
    
    def _extract_tables(self, text: str) -> List[Dict]:
        """Extract tabular data from text"""
        tables = []
        try:
            # Look for common table patterns
            lines = text.split('\n')
            current_table = []
            in_table = False
            
            for line in lines:
                # Detect table headers or separators
                if re.search(r'\|\s*\w+\s*\|', line) or re.search(r'\t', line) or len(line.split()) >= 3:
                    if not in_table:
                        in_table = True
                    current_table.append(line)
                else:
                    if in_table and current_table:
                        tables.append(self._parse_table_data(current_table))
                        current_table = []
                    in_table = False
            
            # Handle last table
            if current_table:
                tables.append(self._parse_table_data(current_table))
                
        except Exception as e:
            print(f"Error extracting tables: {str(e)}")
        
        return tables
    
    def _parse_table_data(self, table_lines: List[str]) -> Dict:
        """Parse table lines into structured data"""
        table_data = {
            'headers': [],
            'rows': []
        }
        
        try:
            # Detect delimiter
            first_line = table_lines[0]
            if '|' in first_line:
                delimiter = '|'
            elif '\t' in first_line:
                delimiter = '\t'
            else:
                delimiter = None
            
            # Parse headers
            if delimiter:
                headers = [h.strip() for h in first_line.split(delimiter) if h.strip()]
            else:
                headers = first_line.split()
            table_data['headers'] = headers
            
            # Parse rows
            for line in table_lines[1:]:
                if delimiter:
                    row = [cell.strip() for cell in line.split(delimiter) if cell.strip()]
                else:
                    row = line.split()
                if row:
                    table_data['rows'].append(row)
                    
        except Exception as e:
            print(f"Error parsing table: {str(e)}")
        
        return table_data
    
    def _analyze_report_content(self, text: str, metrics: Dict[str, Any]) -> str:
        """Generate AI analysis of report content"""
        try:
            # Create context from metrics
            context = []
            
            if metrics.get('revenue'):
                context.append(f"Latest Revenue: ${metrics['revenue'][-1]}M")
            
            for margin in metrics.get('margins', []):
                context.append(f"{margin['type'].title()} Margin: {margin['value']}%")
            
            for growth in metrics.get('growth_rates', []):
                context.append(f"{growth['type'].title()} Growth: {growth['value']}%")
            
            for ratio in metrics.get('ratios', []):
                context.append(f"{ratio['type']} Ratio: {ratio['value']}")
            
            # Generate AI analysis
            prompt = f"""
            You are a financial analyst. Analyze this report summary and provide key insights and recommendations.
            
            Report Metrics:
            {chr(10).join(context)}
            
            Report Content (first 2000 chars):
            {text[:2000]}
            
            Provide:
            1. 3 key insights from the financial metrics
            2. 2 potential risks or concerns
            3. 1 specific recommendation
            
            Format your response in clear bullet points.
            """
            
            return self._generate_completion(prompt)
            
        except Exception as e:
            return f"Error analyzing content: {str(e)}"

def main():
    # Example usage
    portfolio = ["AAPL", "MSFT", "GOOGL", "AMZN", "META"]
    chat = PortfolioChat()
    
    # Initial analysis
    response = chat.process_message("Analyze my portfolio's risk profile and suggest improvements.", portfolio)
    print("\nAI Response:")
    print(response)
    
    # Follow-up question
    response = chat.process_message("What are my biggest ESG risks?")
    print("\nAI Response:")
    print(response)

    # Analyze report
    chat.analyze_report("C:/Users/Asus/Downloads/Stock-Risk-Analysis-master/Stock-Risk-Analysis-master/sample_quarterly_report.pdf")

    # Ask questions about both portfolio and report
    response = chat.process_message("What are the key risks based on both the portfolio and recent reports?")
    print(response)

if __name__ == "__main__":
    main() 