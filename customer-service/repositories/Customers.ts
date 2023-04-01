import { CustomerT } from "../models/Customer";
import fs from "fs";

interface CustomersRepository
{
  init(): Promise<void>;
  
  fetchAll(): Promise<CustomerT[]>;
  
  findByEmail(email: string): Promise<CustomerT | undefined>;
  
  findById(id: string): Promise<CustomerT | undefined>;
  
  add(customer: CustomerT): Promise<CustomerT>; 
}

class CustomersFileRepository implements CustomersRepository
{
    private customers: CustomerT[] = [];
    private fileParentFolder: string = "./fake-db";
    private fileLocation: string = this.fileParentFolder + "/customers-db.json";
  
    async init() 
    {
      try
      {
        if (!fs.existsSync(this.fileLocation))
        {
          fs.mkdirSync(this.fileParentFolder, {
            recursive: true
          });

          fs.writeFileSync(this.fileLocation, "[]");
        }

        const rawCustomers = fs.readFileSync(
          this.fileLocation,
          "utf8"
        );
        this.customers = JSON.parse(rawCustomers);
      }
      catch(err)
      {
        console.log(err);

        this.customers = [];
      };
    }
  
    fetchAll(): Promise<CustomerT[]> 
    {
      return Promise.resolve(this.customers);
    }
  
    findByEmail(email: string): Promise<CustomerT | undefined> 
    {
      return Promise.resolve(this.customers.find((customer) => customer.email === email));
    }
  
    findById(id: string): Promise<CustomerT | undefined> 
    {
      return Promise.resolve(this.customers.find((customer) => customer.id === id));
    }
  
    async add(newCustomer: CustomerT): Promise<CustomerT> 
    {
      const existingCustomer = await this.findById(newCustomer.id);
      if (existingCustomer) {
        throw new Error(`Existing customer ID ${newCustomer.id}`);
      }
  
      this.customers.push(newCustomer);

      fs.writeFileSync(
        this.fileLocation,
        JSON.stringify(this.customers)
      );

      return newCustomer;
    }
  }

  export default new CustomersFileRepository();