import mysql.connector
import requests
import json
import faker

# Connect to the database
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='',
    port=3306
)

# Initialize the Faker library
fake = faker.Faker()

# Create a function to add a chain hotel
def add_chain_hotel():
    # Generate fake data using Faker
    nom = fake.company()
    nombrehotel = fake.random_int(min=1, max=100, step=1)
    rue = fake.street_address()
    code_postal = fake.zipcode()
    ville = fake.city()
    email = fake.email()
    numero_tel = fake.phone_number()

    # Make a POST request to the API to add a chain hotel
    url = 'http://localhost:3000/chaines-hotels'
    payload = {
        'nom': nom,
        'nombrehotel': nombrehotel,
        'rue': rue,
        'codePostal': code_postal,
        'ville': ville,
        'email': email,
        'numeroTel': numero_tel
    }
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.post(url, data=json.dumps(payload), headers=headers)

    # Check if the chain hotel was added successfully
    if response.status_code == 201:
        print('Chain hotel added successfully')
    else:
        print('Error adding chain hotel')

# Create a function to add a bureau
def add_bureau():
    # Generate fake data using Faker
    id_chaine = fake.random_int(min=1, max=100, step=1)
    rue = fake.street_address()
    code_postal = fake.zipcode()
    ville = fake.city()
    email = fake.email()
    numero_tel = fake.phone_number()

    # Make a POST request to the API to add a bureau
    url = f'http://localhost:3000/chaines-hotels/{id_chaine}/bureaux'
    payload = {
        'rue': rue,
        'codePostal': code_postal,
        'ville': ville,
        'email': email,
        'numeroTel': numero_tel
    }
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.post(url, data=json.dumps(payload), headers=headers)

    # Check if the bureau was added successfully
    if response.status_code == 201:
        print('Bureau added successfully')
    else:
        print('Error adding bureau')

# Call the functions to add a chain hotel and a bureau
add_chain_hotel()
add_bureau()

# Close the database connection
conn.close()
