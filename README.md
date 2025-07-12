# Roast My GPA

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)]()
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)]()
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)]()

A fun and interactive web application that provides a humorous "roast" of your GPA. Just enter your GPA, and our AI-powered roaster will give you a witty comeback!

## Features

-   **AI-Powered Roasts**: Utilizes Google's Generative AI to create unique and funny roasts for any GPA.
-   **Simple Interface**: Easy-to-use and intuitive design.
-   **Responsive Design**: Works on all devices, from desktops to mobile phones.

## Live Site

You can visit the live version of the site here: **[https://roast-my-gpa.vercel.app/](https://roast-my-gpa.vercel.app/)** 

## Tech Stack

-   **Frontend**: React, Vite, CSS
-   **Backend**: Node.js, Express.js
-   **AI**: Google Generative AI API

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

-   Node.js and npm installed on your machine.
-   A `.env` file in the `backend` directory with your `API_KEY` from Google AI Studio.

```
API_KEY="YOUR_API_KEY"
```

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/RoastMyGPA.git
    cd RoastMyGPA
    ```

2.  **Set up the backend:**
    ```bash
    cd backend
    npm install
    ```

3.  **Set up the frontend:**
    ```bash
    cd ..
    npm install
    ```

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm start
    ```
    The backend server will be running on `http://localhost:5000`.

2.  **Start the frontend development server:**
    ```bash
    cd ..
    npm run dev
    ```
    Open your browser and navigate to `http://localhost:5173` (or the address shown in your terminal) to see the application.
