from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options


def initialize_driver():
    """
    Initialize the Selenium WebDriver.
    """
    # Configure Chrome Options for headless mode
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    driver = webdriver.Chrome(options=chrome_options)
    wait = WebDriverWait(driver, 10)  # Set an explicit wait timeout
    return driver, wait

def get_element_text(driver, xpath, is_float=False, is_int=False):
    """
    Utility function to get the text of an element by XPath.
    Optionally, convert the text to float or int.
    """
    try:
        element = driver.find_element(By.XPATH, xpath)
        text = element.text
        if is_float:
            return float(text)
        if is_int:
            return int(text)
        return text
    except Exception as e:
        print(f"Error retrieving element at {xpath}: {e}")
        return None

def scrape_esg_sustainalytics(url):
    """
    Scrape ESG data from the Sustainalytics page.
    
    Args:
        url (str): URL of the Sustainalytics ESG rating page.
    
    Returns:
        dict: A dictionary containing the scraped data.
    """
    driver, wait = initialize_driver()
    data = {}
    
    try:
        # Load the URL
        driver.get(url)

        # Scrape the company description
        data['about'] = get_element_text(driver, "//div[@class='company company-risk-rating-detail']//div[@class='company-description-text']")

        # Scrape ESG risk rating and assessment
        data['esg_risk_rating'] = get_element_text(driver, "//div[@class='col-6 risk-rating-score']", is_float=True)
        data['esg_risk_assessment'] = get_element_text(driver, "//div[@class='col-6 risk-rating-assessment']")

        # Scrape industry group rankings
        data['industry_group'] = get_element_text(driver, "//strong[@class='industry-group']")
        data['group_rank'] = get_element_text(driver, "//strong[@class='industry-group-position']", is_int=True)
        data['group_rank_out_of'] = get_element_text(driver, "//span[@class='industry-group-positions-total']", is_int=True)

        # Scrape overall universe rankings
        data['overall_rank'] = get_element_text(driver, "//strong[@class='universe-position']", is_int=True)
        data['overall_rank_out_of'] = get_element_text(driver, "//span[@class='universe-positions-total']", is_int=True)

        # Scrape exposure and risk management
        data['exposure'] = get_element_text(driver, "//strong[@class='company-exposure-assessment']")
        data['exposure_risk_management'] = get_element_text(driver, "//strong[@class='company-risk-management-assessment']")

        # Scrape competitive comparison (peers)
        data['peers'] = []
        peer_table = driver.find_element(By.XPATH, "//section[@class='competitive-comparison']//table[@class='table comparison-table']")
        rows = peer_table.find_elements(By.XPATH, ".//tr")[1:]  # Skip the header row
        for row in rows:
            peer = {}
            peer['name'] = row.find_element(By.XPATH, ".//td[@class='cc-company-name']").text
            rating_text = row.find_element(By.XPATH, ".//td[@class='cc-company-risk-rating']").text
            rating_value, rating_category = rating_text.split('\n')
            peer['esg_rating'] = float(rating_value)
            peer['esg_category'] = rating_category.strip()
            peer['group_rank'] = int(row.find_element(By.XPATH, ".//span[@class='cc-company-industry-group-rank']").text)
            peer['group_rank_out_of'] = int(row.find_element(By.XPATH, ".//span[@class='cc-company-industry-group-positions-total']").text)
            data['peers'].append(peer)
    
    except Exception as e:
        print(f"Error during scraping: {e}")
    
    finally:
        driver.quit()

    return data
if __name__ == "__main__":
    # Example usage
    url = "https://www.sustainalytics.com/esg-rating/north-west-redwater-partnership-inc/1215040509"
    esg_data = scrape_esg_sustainalytics(url)
    print(esg_data)