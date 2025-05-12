# Hostel Management System (HMS)

The **Hostel Management System (HMS)** is a comprehensive solution designed to streamline hostel-related processes for the University of Lucknow. This system provides an intuitive interface for students, provosts, and administrators to manage hostel accommodations efficiently.

---

## Features

### 1. **Student Registration**

- A guided multi-step registration process for students to apply for hostel accommodation.
- Includes personal information, email/mobile verification, and hostel selection.
- Ensures eligibility through academic performance checks.

![Registration Page](frontend/public/ForReadMe/register-page-image.png)

### 2. **Result Verification**

- Automatic verification of student eligibility based on semester results.
- Fetches and validates academic performance from the university's result portal.
- Ensures students meet the minimum academic criteria for hostel allocation.

![Result Verification](frontend/public/ForReadMe/result-verification-image.png)

### 3. **Automatic Room Allocation**

- Allocates rooms based on student preferences (e.g., single, double, or triple occupancy).
- Ensures gender-specific hostel allocation (boys/girls).
- Tracks room availability and occupancy dynamically.

![Room Allocation](frontend/public/ForReadMe/room-allocation-image.png)

### 4. **Student Dashboard**

- Submit maintenance requests, leave applications, and feedback.
- View room details and hostel-related notices.

![Student Dashboard](frontend/public/ForReadMe/student-dashboard-image.png)

### 5. **Provost Dashboard**

- Manage student profiles, room allocations, and grievances.
- Publish and manage public notices for students.

![Provost Dashboard](frontend/public/ForReadMe/provost-dashboard-image.png)

### 6. **Responsive Design**

- Optimized for both desktop and mobile devices.
- Ensures a seamless user experience across all platforms.

### 7. **Secure Login**

- Role-based login for students, provosts, and administrators.
- Ensures data privacy and secure access.

---

## Functionalities

### **Result Verification**

- The system integrates with the university's result portal to fetch semester results.
- Verifies eligibility based on academic performance (minimum 60% required in both semesters).
- Displays detailed student information, including SGPA, total marks, and eligibility status.

### **Registration Process**

- A step-by-step registration process:

  1. **Personal Information**: Collects basic details like name, roll number, and course.
  2. **Email/Mobile Verification**: Sends OTP for verification to ensure authenticity.
  3. **Hostel Selection**: Allows students to select room preferences and gender-specific hostels.
  4. **Preview & Submit**: Enables students to review their application before submission.

### **Automatic Room Allocation**

- Dynamically assigns rooms based on availability and student preferences.
- Ensures fair allocation while adhering to hostel capacity limits.
- Tracks room occupancy and updates the database in real-time.

---

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Result Scraping**: Axios, Cheerio
- **Authentication**: JWT, bcrypt
- **Email Services**: Nodemailer

---

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/amansinghnishad/Project-HMS.git
   cd Project-HMS
   ```

2. **Install Dependencies**:

   - For the backend:

     ```bash
     cd backend
     npm install
     ```

   - For the frontend:

     ```bash
     cd frontend
     npm install
     ```

3. **Start the Servers**:

   - Backend:

     ```bash
     npm start
     ```

   - Frontend:

     ```bash
     npm run dev
     ```

4. **Access the Application**:

   Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

---



