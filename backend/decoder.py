import requests
from bs4 import BeautifulSoup

def fetch_document_data(doc_url):
    response = requests.get(doc_url)
    if response.status_code != 200:
        raise Exception("Failed to fetch the document")
    
    soup = BeautifulSoup(response.content, 'html.parser')
    table_rows = soup.find_all('tr')
    grid_data = []
    for row in table_rows[1:]:
        cells = row.find_all('td')
        if len(cells) == 3:
            x = int(cells[0].text.strip())
            char = cells[1].text.strip()
            y = int(cells[2].text.strip())
            grid_data.append((x, y, char))

    return grid_data

def create_grid(grid_data):
    max_x = max(x for x, y, char in grid_data)
    max_y = max(y for x, y, char in grid_data)
    grid = [[" " for _ in range(max_x + 1)] for _ in range(max_y + 1)]
    for x, y, char in grid_data:
        grid[y][x] = char
    
    return grid

def print_grid(grid):
    for row in grid:
        print("".join(row))

def decode_secret_message(doc_url):
    grid_data = fetch_document_data(doc_url)
    grid = create_grid(grid_data)
    print_grid(grid)

doc_url = "https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub"
decode_secret_message(doc_url)
