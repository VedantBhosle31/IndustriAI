import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from typing import Union, Dict, Any

def validate_price_data(prices: Union[pd.DataFrame, pd.Series]) -> pd.DataFrame:
    """Validate and standardize input price data."""
    required_columns = ['Open', 'High', 'Low', 'Close']
    
    # If input is a Series, convert it to DataFrame
    if isinstance(prices, pd.Series):
        prices = pd.DataFrame({'Close': prices})
    
    # If only Close prices are provided, create synthetic OHLC data
    if 'Close' in prices.columns and not all(col in prices.columns for col in required_columns):
        prices = pd.DataFrame({
            'Open': prices['Close'],
            'High': prices['Close'],
            'Low': prices['Close'],
            'Close': prices['Close']
        })
    
    # Validate that all required columns exist
    missing_cols = [col for col in required_columns if col not in prices.columns]
    if missing_cols:
        raise ValueError(f"Missing required columns: {missing_cols}")
    
    # Remove any NaN values
    prices = prices.dropna()
    
    if len(prices) < 2:
        raise ValueError("Insufficient data points for analysis")
        
    return prices

def calculate_daily_returns(prices: Union[pd.DataFrame, pd.Series]) -> pd.Series:
    """Calculate daily returns from historical prices."""
    try:
        prices = validate_price_data(prices)
        returns = prices['Close'].pct_change().dropna()
        return returns
    except Exception as e:
        raise ValueError(f"Error calculating daily returns: {str(e)}")

def calculate_heiken_ashi(prices: pd.DataFrame) -> pd.DataFrame:
    """Calculate Heiken-Ashi candles from historical prices."""
    try:
        prices = validate_price_data(prices)
        ha_prices = pd.DataFrame(index=prices.index)
        
        # Initialize the first Heiken-Ashi values
        ha_prices['HA_Close'] = (prices['Open'] + prices['High'] + prices['Low'] + prices['Close']) / 4
        ha_prices.loc[prices.index[0], 'HA_Open'] = (prices['Open'].iloc[0] + prices['Close'].iloc[0]) / 2
        ha_prices['HA_High'] = prices[['High', 'Open', 'Close']].max(axis=1)
        ha_prices['HA_Low'] = prices[['Low', 'Open', 'Close']].min(axis=1)

        # Calculate subsequent Heiken-Ashi values
        for i in range(1, len(prices)):
            ha_prices.loc[prices.index[i], 'HA_Open'] = (ha_prices['HA_Open'].iloc[i-1] + ha_prices['HA_Close'].iloc[i-1]) / 2
            ha_prices.loc[prices.index[i], 'HA_High'] = ha_prices.loc[prices.index[i:i+1], ['HA_Open', 'HA_Close']].max(axis=1).iloc[0]
            ha_prices.loc[prices.index[i], 'HA_Low'] = ha_prices.loc[prices.index[i:i+1], ['HA_Open', 'HA_Close']].min(axis=1).iloc[0]

        return ha_prices
    except Exception as e:
        raise ValueError(f"Error calculating Heiken-Ashi candles: {str(e)}")

def calculate_rolling_std_dev(daily_returns: pd.Series, window: int = 30) -> pd.Series:
    """Calculate rolling standard deviation of daily returns."""
    if len(daily_returns) < window:
        raise ValueError(f"Insufficient data points for {window}-day window")
    return daily_returns.rolling(window=window, min_periods=1).std()

def calculate_max_drawdown(prices: Union[pd.DataFrame, pd.Series]) -> float:
    """Calculate the maximum drawdown of the portfolio."""
    try:
        prices = validate_price_data(prices)
        daily_returns = calculate_daily_returns(prices)
        cumulative_returns = (1 + daily_returns).cumprod()
        peak = cumulative_returns.expanding().max()
        drawdown = (cumulative_returns - peak) / peak
        return float(drawdown.min() * 100)  # Return as a percentage
    except Exception as e:
        raise ValueError(f"Error calculating maximum drawdown: {str(e)}")

def calculate_risk_score(prices: Union[pd.DataFrame, pd.Series], window: int = 30) -> Dict[str, Any]:
    """Calculate a comprehensive risk score based on multiple factors."""
    try:
        prices = validate_price_data(prices)
        daily_returns = calculate_daily_returns(prices)
        
        # Calculate various risk metrics
        volatility = daily_returns.std() * np.sqrt(252)  # Annualized volatility
        max_dd = calculate_max_drawdown(prices)
        rolling_std = calculate_rolling_std_dev(daily_returns, window)
        
        # Calculate base risk score from volatility
        vol_score = min(100, (volatility * 100) / 0.4)  # Normalize to 100, assuming 40% annual volatility as maximum
        
        # Adjust score based on maximum drawdown
        dd_score = min(100, abs(max_dd))
        
        # Final risk score is weighted average
        risk_score = 0.7 * vol_score + 0.3 * dd_score
        
        return {
            'risk_score': min(100, max(0, risk_score)),  # Ensure score is between 0 and 100
            'volatility': volatility,
            'max_drawdown': max_dd,
            'rolling_std': rolling_std.iloc[-1] if len(rolling_std) > 0 else np.nan
        }
    except Exception as e:
        raise ValueError(f"Error calculating risk score: {str(e)}")

def categorize_risk(risk_score: float) -> str:
    """Categorize the risk score into Low, Medium, or High."""
    if risk_score < 33:
        return "Low Risk"
    elif risk_score < 66:
        return "Medium Risk"
    else:
        return "High Risk"

def visualize_risk(prices: Union[pd.DataFrame, pd.Series], window: int = 30):
    """Visualize risk metrics."""
    try:
        prices = validate_price_data(prices)
        daily_returns = calculate_daily_returns(prices)
        rolling_std = calculate_rolling_std_dev(daily_returns, window)
        ha_prices = calculate_heiken_ashi(prices)

        fig, axes = plt.subplots(3, 1, figsize=(14, 10))
        
        # Plot 1: Daily Returns
        daily_returns.plot(ax=axes[0], color='blue', label='Daily Returns')
        axes[0].set_title('Daily Returns')
        axes[0].axhline(y=0, color='black', linestyle='--', alpha=0.3)
        axes[0].legend()

        # Plot 2: Rolling Volatility
        rolling_std.plot(ax=axes[1], color='orange', label='Rolling Volatility')
        axes[1].set_title(f'{window}-Day Rolling Volatility')
        axes[1].legend()

        # Plot 3: Heiken-Ashi
        ha_prices['HA_Close'].plot(ax=axes[2], color='green', label='Heiken-Ashi Close')
        axes[2].set_title('Heiken-Ashi Close Prices')
        axes[2].legend()

        plt.tight_layout()
        plt.show()
    except Exception as e:
        raise ValueError(f"Error visualizing risk metrics: {str(e)}")

def main():
    try:
        # Example historical price data for green stocks
        dates = pd.date_range(start='2023-01-01', periods=100, freq='D')
        stock_data = pd.DataFrame({
            'Open': np.random.normal(100, 2, 100).cumsum(),
            'High': np.random.normal(101, 2, 100).cumsum(),
            'Low': np.random.normal(99, 2, 100).cumsum(),
            'Close': np.random.normal(100, 2, 100).cumsum()
        }, index=dates)

        # Calculate risk metrics
        risk_metrics = calculate_risk_score(stock_data)
        risk_score = risk_metrics['risk_score']
        risk_category = categorize_risk(risk_score)

        # Print results
        print("\nRisk Analysis Results:")
        print("-" * 50)
        print(f"Risk Score (0-100): {risk_score:.2f} - {risk_category}")
        print(f"Annualized Volatility: {risk_metrics['volatility']*100:.2f}%")
        print(f"Maximum Drawdown: {risk_metrics['max_drawdown']:.2f}%")
        print(f"Current Rolling Volatility: {risk_metrics['rolling_std']*100:.2f}%")
        
        # Visualize results
        visualize_risk(stock_data)

    except Exception as e:
        print(f"Error in main execution: {str(e)}")

if __name__ == "__main__":
    main()