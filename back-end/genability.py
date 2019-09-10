import uuid
from typing import Dict, List
import json

import requests


auth = {
    "app_id": "7bcdeef6-b975-4721-b962-ad34e0f33fb5",
    "app_key": "c3a8ebc7-eb65-492f-b706-952a5dedae0a"
}

# response = requests.get("https://api.genability.com/rest/echo/hello", auth=(auth["app_id"], auth["app_key"]))
# print(response.text)


class GenabilityApiInterface():
    def __init__(self, app_id, app_key):
        self.app_id = app_id
        self.app_key = app_key
        self.api_base = "https://api.genability.com/rest"
        self.CustomerClasses = {
            "residential": "1",
            "general": "2",
            "special": "4"
        }

    # Template API Request
    def send_api_request(self, endpoint_url, rest_verb, data: Dict = None):
        url_string: str = f"{self.api_base}/{endpoint_url}"
        auth_tuple = (self.app_id, self.app_key)
        if rest_verb == "GET":
            api_response: requests.Response = requests.get(url_string, params=data, auth=auth_tuple)
        # elif rest_verb == 'POST':
        #     api_response: requests.Response = requests.post(url_string, json=data, auth=auth_tuple)
        elif rest_verb == 'PUT':
            headers = {"Content-Type": "application/json"}
            api_response: requests.Response = requests.put(url_string, data=json.dumps(data), headers=headers, auth=auth_tuple)
        else:
            raise Exception(f"Unsupported verb {verb}")

        return api_response.json()

    # Step 1: Create customer account
    # Step 2 (optional): Set Corrected Utility and Tariff info for Customer (GET customer account)
    # Step 3: Create Customer Usage Profile
    # Step 4: Create Solar Profile 
    # Step 5: Calculate cost without solar and storage
    # Step 6: Create Net Hourly Profile
    # Step 7: Model Storage Profile - We create this

    # Creates a customer property account in Genability database
    def create_account(
            self,
            account_name,
            address1,
            address2,
            city,
            zipcode,
            country,
            customer_class = "residential",
        ):
        account_uuid = str(uuid.uuid4())
        endpoint_url = f"v1/accounts"
        api_body = {
            "providerAccountId": account_uuid,
            "accountName": account_name,
            "address": {
                "address1": address1,
                "address2": address2,
                "city": city,
                "zip": zipcode,
                "country": country,
            },
            "properties": {
                "customerClass": {
                    "keyName": "customerClass",
                    "dataValue": self.CustomerClasses[customer_class]
                }
            }
        }

        api_response = self.send_api_request(endpoint_url=endpoint_url, rest_verb='PUT', data=api_body)
        return api_response


    def get_account(self, providerAccountId):
        api_response = self.send_api_request(endpoint_url=f'v1/accounts/pid/{providerAccountId}', rest_verb='GET')
        return api_response

    def get_utilities(self, zipcode):
        utility_endpoint_url = f'/public/lses?postCode={zipcode}&country=US&residentialServiceTypes=ELECTRICITY&sortOn=totalCustomers&sortOrder=DESC'

        api_response = self.send_api_request(endpoint_url=utility_endpoint_url, rest_verb='GET')
        return api_response

    def set_utility(self, providerAccountId, lseId):
        endpoint_url = f'/v1/accounts/pid/{providerAccountId}/properties'
        api_body = {
            "keyName": "lseId",
            "dataValue": lseId,
            "accuracy": 100
        }

        api_response = self.send_api_request(endpoint_url=endpoint_url, rest_verb="PUT", data=api_body)
        return api_response

    # def get_tariffs(self, zipcode):
        


        # tariff_endpoint_url = f"accounts/pid/{account_uuid}/properties"

        # # tariff_body = {
        # #     "keyName": "masterTariffId",
        # #     "dataValue": "3251052",
        # #     "accuracy": 100
        # # }

        # tariff_response = self.send_api_request(tariff_endpoint_url, 'put', tariff_body)
        


######### TESTING ########

GenabilityInterface = GenabilityApiInterface(app_id=auth["app_id"], app_key=auth["app_key"])

# Test create_account PASSED
# print(GenabilityInterface.create_account(
#         account_name="My Test Account",
#         address1="1222 Harrison St",
#         address2="Apt 6611",
#         city="San Francisco",
#         zipcode="94103",
#         country="US",
#         customer_class="residential"
#     ))
providerAccountId = "4e6d4f43-a94f-478c-8201-12532c653b01"

# Test get_account PASSED
print(GenabilityInterface.get_account(providerAccountId=providerAccountId))

# Test get_utilities PASSED
# print(GenabilityInterface.get_utilities(zipcode="94103"))

# Test set_utility PASSED
# print(GenabilityInterface.set_utility(providerAccountId=providerAccountId, lseId=734))

# Test get_tariffs 





