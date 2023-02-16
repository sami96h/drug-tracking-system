# Hyperledger Fabric Drug Tracking Web Application

This is a highly scalable and secure drug tracking web application that leverages the power of the Hyperledger Fabric network to create a reliable and transparent drug supply chain system. It provides a distributed workflow across three organizations, including the manufacturer, distributor, and retailer, allowing them to add medication batches and transfer ownership while restricting access to sensitive information.

![image](https://user-images.githubusercontent.com/28482320/219410650-cbfc72af-644a-465f-aac9-c3accbde892d.png)


## Features

* Scalable and secure drug tracking web application
* Utilizes Hyperledger Fabric network for a reliable and transparent drug supply chain system
* Implements Bullmq for efficient long-running transaction processing
* Utilizes MongoDB for optimal data storage and retrieval
* Orchestrates a distributed workflow among three organizations
* Offers an intuitive user interface that allows for the addition of medication batches, the transfer of ownership, and the scanning of QR codes for supply chain information
* Enhances regulatory compliance and end-user satisfaction

## Installation and Usage (locally)

### Step 1. Clone the Repo

Git clone this repo onto your computer in the destination of your choice, then go into D.T.S folder:
```
Sami $ git clone https://github.com/sami96h/drug-tracking-system.git
```

### Step 2. Start the Fabric Network

[NOTE] You need to have docker installed . 

-First, Navigate to 'network' directory :
    ```bash
    cd network
    ./network.sh up
    ```
    The network would take up to 2 minutes to launch , if everything goes well you should see this output : 

![image](https://user-images.githubusercontent.com/28482320/219404237-927b5772-24b6-4258-8381-419e13ea8ec2.png)

### Step 3. Run the Web App
To run the app, we will need to install dependencies for both our front-end and our back-end. 

#### Start the Server
  - First, navigate to the `web-app` directory, and install the node dependencies.
    ```bash
    cd web-app
    npm install
    ```
  - Then, start the server: 
    ```bash
    npm run dev
    ```
  - If all goes well, you should see the following in your terminal:
  
    ![image](https://user-images.githubusercontent.com/28482320/219394752-1d9e796b-8cdb-489a-9e5a-cf8780a1628b.png)

#### Start the Front-end (Client)

- First, navigate to the `client` directory, and install the node dependencies.
  ```bash
  cd client
  npm install
  ```
- Then, start the client: 
  ```bash
  npm start
  ```
- If all goes well,a new browser window displaying your app will be launched at http://localhost:3000/home.
 
# Now to start interacting with the project you need to login to the system :
  
  there are the organizations (Manufacturer, Distriputer, Retailer) all with the same credentials : UserName: admin , Password: adminpw 
  BUT with different privileges, listed as bellow :
  
#### Manufacturer :

* Add Drug
* Add Batch
* Delete Drug
* Delete Batch
* Transfer Batch ownership
  
#### Distriputer :

* Add Distriputing related data to the batch
* Transfer Batch ownership
    
#### Retailer : 

* Sell the boxes within the batch
   
#### All the parties can do the following : 
* Show the transactions list
* Show the batches list 
* query the drug boxes using QR scanning (This feature is accessible to the public) 
