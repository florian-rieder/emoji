import csv
import requests
from bs4 import BeautifulSoup

# Load the HTML file
response = requests.get('https://unicode-org.github.io/emoji/emoji/charts-15.0/emoji-list.html')

if response.status_code != 200:
    raise ValueError('Failed to fetch emoji list')

soup = BeautifulSoup(response.text, "html.parser")

# Open CSV file for writing
with open("emoji_list.csv", "w", newline="", encoding="utf-8") as csvfile:
    fieldnames = ["emoji", "description", "keywords", "base64"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()

    # Iterate over each row in the table
    for row in soup.find_all("tr"):
        cols = row.find_all("td")
        if len(cols) > 0:
            emoji = cols[2].find("img")["alt"]  # Extract the emoji character
            description = cols[3].text.strip()  # Extract the description
            keywords = [keyword.strip() for keyword in cols[4].text.split("|")]  # Extract and split keywords
            base64 = cols[2].find("img")["src"].split(",")[1]  # Extract the base64 image string

            # Write row to CSV file
            writer.writerow({
                "emoji": emoji,
                "description": description,
                "keywords": "|".join(keywords),
                "base64": base64
            })
