from simple_salesforce import Salesforce
from app.services.encryption import decrypt_value, encrypt_value
from typing import Dict, Any

class SalesforceService:
    @staticmethod
    def validate_and_connect(credentials: Dict[str, str]) -> Dict[str, Any]:
        """
        Validates credentials by attempting to connect to Salesforce.
        Returns org metadata if successful, raises exception if not.
        """
        try:
            print(f"Attempting Salesforce Login... Username: {credentials['username']}, Domain: {credentials.get('domain', 'login')}")
            sf = Salesforce(
                username=credentials['username'],
                password=credentials['password'],
                security_token=credentials['security_token'],
                domain=credentials.get('domain', 'login')
            )
            # Fetch Org Details (Name, Id, Sandbox Status)
            print("Login successful. Fetching Org Metadata...")
            org_info = sf.query("SELECT Id, Name, IsSandbox, OrganizationType FROM Organization")
            org_details = org_info['records'][0]
            
            return {
                "organization_id": org_details['Id'],
                "organization_name": org_details['Name'],
                "is_sandbox": org_details['IsSandbox'],
                "type": org_details['OrganizationType']
            }
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"Salesforce Connection Error: {str(e)}")
            raise Exception(f"Salesforce Connection Failed: {str(e)}")

    @staticmethod
    def encrypt_credentials(credentials: Dict[str, str]) -> Dict[str, str]:
        return {
            "sf_username": encrypt_value(credentials['username']),
            "sf_password": encrypt_value(credentials['password']),
            "sf_security_token": encrypt_value(credentials['security_token']),
            "sf_domain": credentials.get('domain', 'login')
        }
