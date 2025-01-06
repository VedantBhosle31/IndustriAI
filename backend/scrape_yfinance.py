import yfinance as yf
import pandas as pd
import os

def scrape_yfinance_data(ticker_name, save_path):
    """
    Scrape data from Yahoo Finance for a given ticker and save it as CSV files.

    Args:
        ticker_name (str): The ticker symbol of the company (e.g., "RELIANCE.NS").
        save_path (str): The directory path where the data will be saved.

    Returns:
        None
    """
    # Ensure the save directory exists
    os.makedirs(save_path, exist_ok=True)

    # Initialize the ticker object
    ticker = yf.Ticker(ticker_name)

    # Function to save DataFrame to CSV
    def save_to_csv(data, file_name):
        if not data.empty:
            data.to_csv(os.path.join(save_path, file_name))
            print(f"Saved: {file_name}")
        else:
            print(f"No data found for {file_name}")

    # 1. Technical Data: Historical Data
    history = ticker.history(period="1y", interval="1d")
    save_to_csv(history, "technicals.csv")

    # 2. Fundamental Data
    # Financials (Income Statement)
    save_to_csv(ticker.financials, "financials.csv")

    # Balance Sheet
    save_to_csv(ticker.balance_sheet, "balance_sheet.csv")

    # Cash Flow
    save_to_csv(ticker.cashflow, "cashflow.csv")

    # Quarterly Financials
    save_to_csv(ticker.quarterly_financials, "quarterly_financials.csv")

    # Quarterly Balance Sheet
    save_to_csv(ticker.quarterly_balance_sheet, "quarterly_balance_sheet.csv")

    # Quarterly Cash Flow
    save_to_csv(ticker.quarterly_cashflow, "quarterly_cashflow.csv")

    # Key Statistics and Info
    info = pd.DataFrame.from_dict(ticker.info, orient="index", columns=["Value"])
    save_to_csv(info, "info.csv")

    # Institutional Holders
    save_to_csv(ticker.institutional_holders, "holders.csv")

    # Major Holders
    major_holders = pd.DataFrame(ticker.major_holders)
    save_to_csv(major_holders, "major_holders.csv")

    # Recommendations
    save_to_csv(ticker.recommendations, "recommendations.csv")

if __name__ == "__main__":
    ticker_name = "RELIANCE.NS"
    save_path = f"data/{ticker_name}"
    scrape_yfinance_data(ticker_name, save_path)