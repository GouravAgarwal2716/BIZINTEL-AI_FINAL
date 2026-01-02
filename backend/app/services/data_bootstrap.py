from simple_salesforce import Salesforce, SalesforceMalformedRequest
import random
from datetime import datetime, timedelta

class DataBootstrapService:
    @staticmethod
    def check_data_presence(sf: Salesforce):
        """
        Checks counts of key objects.
        """
        objects = ['Lead', 'Opportunity', 'Task', 'Case']
        counts = {}
        has_data = False
        
        for obj in objects:
            try:
                # Using REST API limits query 'SELECT count() FROM Object' which is not directly supported in SOQL via simple-salesforce easily without tooling api or iterating.
                # Efficient way: query limit 1. If 1 exists, we have data. 
                # Or use proper count query: SELECT count() FROM Lead
                # Simple query to get records (more compatible than COUNT())
                res = sf.query_all(f"SELECT Id FROM {obj} LIMIT 1000")
                count = len(res['records'])
                counts[obj] = count
                if count > 0:
                    has_data = True
                print(f"✅ {obj}: {count} records found")
            except Exception as e:
                print(f"❌ {obj}: Error - {str(e)}")
                counts[obj] = 0  # Set to 0 instead of -1
                
        print(f"Final counts: {counts}, has_data: {has_data}")
        return {"counts": counts, "has_data": has_data}

    @staticmethod
    def seed_demo_data(sf: Salesforce):
        """
        Injects realistic demo data.
        """
        # 1. Accounts
        accounts = []
        tech_companies = ['NexGen Corp', 'Quantum Systems', 'Vertex AI', 'CyberDyne Systems', 'Globex Corp']
        for name in tech_companies:
            try:
                res = sf.Account.create({'Name': name, 'Industry': 'Technology', 'Rating': 'Hot'})
                accounts.append({'name': name, 'id': res['id']})
            except Exception:
                pass # Skip if exists or error
        
        if not accounts: 
            # Fetch existing if we failed to create (likely exist)
            existing = sf.query("SELECT Id, Name FROM Account LIMIT 5")
            accounts = [{'name': r['Name'], 'id': r['Id']} for r in existing['records']]

        # 2. Leads (Churn Risk & New)
        leads = [
            {'FirstName': 'Sarah', 'LastName': 'Connor', 'Company': 'CyberDyne', 'Status': 'Open - Not Contacted', 'Email': 'sarah@cyberdyne.com'},
            {'FirstName': 'John', 'LastName': 'Doe', 'Company': 'Unknown Inc', 'Status': 'Working - Contacted', 'Email': 'john@unknown.com'},
            {'FirstName': 'Jane', 'LastName': 'Smith', 'Company': 'Vertex AI', 'Status': 'Open - Not Contacted', 'Email': 'jane@vertex.ai'}
        ]
        for lead in leads:
            try:
                sf.Lead.create(lead)
            except: pass

        # 3. Opportunities (For Sales Agent)
        if accounts:
            stages = ['Prospecting', 'Qualification', 'Needs Analysis', 'Closed Won']
            for i in range(5):
                acc = random.choice(accounts)
                sf.Opportunity.create({
                    'Name': f"{acc['name']} Deal - Q{random.randint(1,4)}",
                    'AccountId': acc['id'],
                    'StageName': random.choice(stages),
                    'CloseDate': (datetime.now() + timedelta(days=random.randint(10, 90))).strftime('%Y-%m-%d'),
                    'Amount': random.randint(10000, 500000)
                })

        return {"status": "seeded", "message": "Demo data injected successfully"}
