# **Fortune Wheel**

The **Fortune Wheel** is a complete **Next.js** solution that powers the **Super Rewards Promo**, also known as the "Millionaire Geng Season." This digital solution randomly selects winners from a pool of customers who meet the specified savings criteria. The draws are conducted monthly, quarterly, and for grand prizes, with complete fairness and transparency.

---

## **Overview**

The Fortune Wheel application works by:
1. **Extracting Records:** The application extracts customer data from a file, processes it, and stores it in another file.
2. **Random Number Generation:** The application generates random numbers based on requests, simulating the drawing process for selecting winners.
3. **Data Reading and Handling:** It reads data sets from the file based on the randomly generated indices, ensuring that winners are selected impartially.

---

## **Components**

### **Core Features**
- **File Handling:** 
  - Extracts records from an input file.
  - Copies data into a new file to track processed records.
- **Random Draw Engine:** 
  - Generates random numbers based on the request (to select winners).
- **Winner Selection:** 
  - Uses the randomly generated numbers to select winners from the file based on index values.
- **Draw Process:** 
  - Supports monthly, quarterly, and grand prize draws.
  
### **Frontend:**
- **User Interface:** 
  - Displays eligibility status, upcoming draws, and prize categories.
- **Live Draw Feature:** 
  - Allows users to watch the live random draw process.
- **Notifications:** 
  - Sends alerts when a user wins or when the draw is about to happen.

---

## **Technology Stack**

- **Frontend:** Next.js
- **File Operations:** Built-in Node.js file system (`fs` module) for file reading, writing, and handling.
- **Random Number Generation:** JavaScript's `Math.random()` function for generating random numbers.
- **State Management:** React hooks for managing states like winner list, draw progress, etc.

---

## **Project Setup**

### **Prerequisites**

Before setting up the project, ensure you have the following:

1. **Install Node.js and npm**  
   - Install from [https://nodejs.org/](https://nodejs.org/)

2. **Install Next.js**  
   - Install Next.js by following the guide [here](https://nextjs.org/docs/getting-started).

### **Running the Application**

1. **Clone the Repository**  
   Clone the project repository to your local machine.
   ```bash
   git clone <repository_url>
   cd fortune-wheel
   ```

2. **Install Dependencies**  
   Run the following command to install the necessary dependencies:
   ```bash
   npm install
   ```

3. **Start the Development Server**  
   After the dependencies are installed, start the development server:
   ```bash
   npm run dev
   ```

4. **Access the Application**  
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## **How the Application Works**

### **File Handling**
- The application uses the built-in Node.js `fs` module to read customer data from an input file.
- It then processes this data, storing selected information in an output file to track the records and draw results.

### **Random Number Generation**
- Random numbers are generated based on the number of eligible customers.
- These numbers are used to select random indices from the customer data.

### **Winner Selection**
- For each prize category (monthly, quarterly, and grand draw), the system generates a set of random numbers.
- The records from the customer data file are read using these random indices, selecting winners accordingly.

### **Draw Process**
- The draw process happens in real-time, allowing customers to follow the live updates and see which number is selected for each draw category.

---

## **Features and Flow**

1. **Extract Records:**  
   The customer records are extracted from a provided file, processed, and stored in a new file for draw purposes.

2. **Random Number Generation:**  
   Based on requests (e.g., monthly or quarterly), random numbers are generated.

3. **Winner Selection:**  
   The randomly generated indices are used to pick winners from the data file.

4. **Notification and Draw Updates:**  
   Users are notified when they win, and real-time updates on the draw are displayed.
