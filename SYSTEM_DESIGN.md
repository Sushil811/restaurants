# Lumiere Luxury Restaurant — System Architecture & Design Flow

This document details the system design, architecture, and core execution flows of the **Lumiere Restaurant** application. It serves as a comprehensive developer reference of how the Next.js frontend, Express.js backend, MongoDB database, Stripe payment system, and Cloudinary media server interact.

---

## 1. System Architecture Overview

![Lumiere System Architecture Diagram](./system_architecture_diagram.png)

Lumiere is designed as a decoupled full-stack application. The frontend is a static and dynamic web app powered by **Next.js 14** (utilizing React Server Components and Route Groups), while the backend is a stateless RESTful API built with **Node.js, Express, and TypeScript**.

```mermaid
graph TD
    %% Styling
    classDef client fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef server fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef database fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff;
    classDef external fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;

    %% Nodes
    Client["Next.js Client (Vercel)"]:::client
    Server["Express.js API Server (Railway)"]:::server
    DB[("MongoDB Atlas Database")]:::database
    Stripe["Stripe Payment Gateway"]:::external
    Cloudinary["Cloudinary Image Storage"]:::external

    %% Connections
    Client -- "1. HTTP Requests (JSON)" --> Server
    Client -- "2. Card Tokenization" --> Stripe
    Server -- "3. Read / Write Data" --> DB
    Server -- "4. Image Upload" --> Cloudinary
    Server -- "5. Create Payment Intent & Charge" --> Stripe
    Stripe -- "6. Webhook Events" --> Server
```

### Technology Breakdown
*   **Frontend**: Next.js 14 App Router, Tailwind CSS (styling), Zustand (client-side state: cart & auth), Framer Motion (animations), and React Query (server-state synchronization).
*   **Backend**: Express.js, Node.js, TypeScript, Mongoose (MongoDB ODM), Express-Rate-Limit (DDOS & abuse protection), JWT (authentication).
*   **External Integrations**:
    *   **Stripe**: Secure credit card authorization, payment intent verification, and webhook callbacks.
    *   **Cloudinary**: Media server for storage of high-resolution food images.
    *   **MongoDB Atlas**: Managed multi-region document database.

---

## 2. Core User Flows

### A. Ordering & Payment Flow
This flow represents the customer's journey from adding items to their cart, executing a secure card checkout via Stripe, backend verification, and real-time order tracking.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (Browser)
    participant UI as Next.js Client
    participant API as Express API Server
    participant DB as MongoDB
    participant Stripe as Stripe Gateway

    Customer->>UI: Add gourmet items to Cart
    Note over UI: Zustand Cart Store updates total price, taxes, and items.
    Customer->>UI: Click 'Checkout' (Navigate to /checkout)
    UI->>Customer: Render step-by-step form (Delivery -> Payment -> Review)
    
    Customer->>UI: Input Card Details & Submit
    UI->>Stripe: Send Card details (Tokenization request)
    Stripe-->>UI: Return transaction token (e.g., tok_123)
    
    UI->>API: POST /api/v1/orders (Payload + transactionId)
    Note over API: Rate limiting middleware validates IP request limits
    API->>Stripe: Create Payment Intent / Capture (using transactionId)
    Stripe-->>API: Confirm Payment Success
    
    API->>DB: Save Order Document (Status: 'confirmed')
    DB-->>API: Saved Successfully
    API-->>UI: Return Order ID (e.g., ORD_786524)
    
    UI->>Customer: Redirect to /order-tracking/[id]
    
    loop Real-Time Simulation (Every 12s)
        UI->>API: GET /api/v1/orders/[id]
        API->>DB: Fetch order status
        DB-->>API: Return status ('preparing', 'ready', 'out_for_delivery')
        API-->>UI: Update tracking UI
        UI->>Customer: Display updated status on interactive timeline
    end
```

---

### B. Table Reservation & Slot Booking Flow
This flow ensures double-booking prevention by querying existing reservations dynamically when the guest selects a date and size.

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Guest (Browser)
    participant UI as Next.js Client
    participant API as Express API Server
    participant DB as MongoDB

    Guest->>UI: Choose Date & Guest Count
    UI->>API: GET /api/v1/reservations/slots?date=YYYY-MM-DD&guests=N
    API->>DB: Query reservations on date (aggregate occupied slots)
    DB-->>API: Return list of occupied slots
    Note over API: Filter out slots where remaining table capacity is exceeded
    API-->>UI: Return available slots (e.g., ['7:00 PM', '8:30 PM'])
    UI->>Guest: Display available slot buttons
    
    Guest->>UI: Select slot & input details (Name, phone, special requests)
    Guest->>UI: Submit Reservation
    UI->>API: POST /api/v1/reservations (Payload)
    API->>DB: Save Reservation (Status: 'Pending' or 'Confirmed')
    DB-->>API: Save success + generate confirmationCode
    API-->>UI: Return 201 Created (confirmationCode: RES-823901)
    UI->>Guest: Display luxury Reservation Success screen with details
```

---

## 3. Database Schema Flow (Relationships)

MongoDB stores documents inside collections. The connections below display how the relational references are handled using Mongo ObjectIds (`Schema.Types.ObjectId`).

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes
    USER ||--o{ RESERVATION : books
    ORDER ||--|{ ORDER_ITEM : contains
    MENU_ITEM ||--o{ ORDER_ITEM : "specifies product"
    COUPON ||--o{ ORDER : "applies discount"

    USER {
        string id PK
        string name
        string email
        string passwordHash
        string role "user | admin"
        string avatar
    }

    MENU_ITEM {
        string id PK
        string name
        string description
        number price
        string category "Mains | Desserts | etc"
        string imageURL
        boolean isAvailable
    }

    ORDER {
        string id PK
        string user FK
        string orderNumber
        string orderType "delivery | pickup"
        object deliveryAddress
        string orderStatus "pending | confirmed | preparing | ready | out_for_delivery | delivered | cancelled"
        number subtotal
        number deliveryFee
        number tax
        number total
        string paymentMethod "stripe | cod | wallet"
        string transactionId
        string couponCode
    }

    RESERVATION {
        string id PK
        string user FK "optional"
        string name
        string email
        string phone
        string date
        string time
        number guests
        string occasion
        string specialRequests
        string status "pending | confirmed | cancelled"
        string confirmationCode
    }

    REVIEW {
        string id PK
        string user FK
        string name
        number rating "1-5 stars"
        string comment
        string order FK "optional"
        boolean isApproved
    }
```

---

## 4. API Endpoints Map & Middleware Flow

Every request directed to the API server is passed through layered middleware controls for security, rate limiting, and session verification before reaching the core execution controllers.

```mermaid
graph LR
    %% Style
    classDef middleware fill:#f43f5e,stroke:#be123c,stroke-width:2px,color:#fff;
    classDef route fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef controller fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;

    %% Request Source
    Req[Incoming HTTP Request]
    
    %% Middleware Layer
    subgraph Middleware Layer
        Cors["CORS Headers Check"]:::middleware
        RateLimit["Rate Limiter (Express-Rate-Limit)"]:::middleware
        Auth["Auth Check (JWT Verification)"]:::middleware
        Roles["Admin Role Check"]:::middleware
    end

    %% Route mappings
    subgraph Route Handlers
        AuthRoute["/api/v1/auth"]:::route
        OrderRoute["/api/v1/orders"]:::route
        AdminRoute["/api/v1/admin"]:::route
    end

    %% Controllers
    subgraph Controllers
        AuthController["AuthController"]:::controller
        OrderController["OrderController"]:::controller
        AdminController["AdminController"]:::controller
    end

    %% Path flows
    Req --> Cors
    Cors --> RateLimit
    
    %% Paths to auth
    RateLimit --> AuthRoute
    AuthRoute --> AuthController
    
    %% Paths to order (needs auth)
    RateLimit --> Auth
    Auth --> OrderRoute
    OrderRoute --> OrderController

    %% Paths to admin dashboard (needs auth + role)
    Auth --> Roles
    Roles --> AdminRoute
    AdminRoute --> AdminController
```

---

## 5. System Runtime Architecture Flow

This sequence flow outlines the lifecycle of system requests, showing how the client browser, Vercel CDN, Next.js server nodes, Express.js backend handlers, MongoDB Atlas cluster, and external services (Stripe & Cloudinary) communicate during runtime:

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant CDN as Vercel Edge / CDN
    participant Next as Next.js Server (Frontend)
    participant Exp as Express.js Node (Backend)
    participant DB as MongoDB Atlas (Data Store)
    participant Stripe as Stripe API (Payments)
    participant Cloud as Cloudinary (Media Assets)

    %% Flow 1: Rendering
    Note over User, Next: 1. Page Request & Hydration
    User->>CDN: Request Page (e.g. /menu)
    CDN->>Next: Forward Request (SSR / Static Cache Check)
    Next->>Exp: GET /api/v1/menu (Fetch current dishes)
    Exp->>DB: Query menu items (Category filters)
    DB-->>Exp: Return active menu documents
    Exp-->>Next: Return JSON dataset
    Next-->>User: Rendered HTML + JS Hydration bundle
    Note over User: User interacts with UI (Zustand state changes)

    %% Flow 2: Media Upload
    Note over User, Cloud: 2. Media Upload Flow (Admin / Chef Portal)
    User->>Next: Admin uploads file to UI
    Next->>Exp: Forward file streams
    Exp->>Cloud: POST /v1_1/upload (Send image binary)
    Cloud-->>Exp: Return image secure URL & metadata
    Exp->>DB: Save menu item with Cloudinary image URL
    DB-->>Exp: Save successful
    Exp-->>Next: Return 201 Created (JSON metadata)
    Next-->>User: Update Admin grid

    %% Flow 3: Checkout Payment
    Note over User, Stripe: 3. Payment Intent & Database Commit
    User->>Stripe: Send card details for secure authentication (Stripe SDK)
    Stripe-->>User: Return verified Payment Method token
    User->>Next: Initiate Place Order (token + details)
    Next->>Exp: POST /api/v1/orders (Forward transaction token)
    Exp->>Stripe: POST /v1/payment_intents (Charge authorization)
    Stripe-->>Exp: Payment captured successfully
    Exp->>DB: Write order transaction to DB
    DB-->>Exp: Write successful
    Exp-->>Next: Return order confirmation status
    Next-->>User: Render tracking screen
```

---

## 6. Developer Guide: How the Code Works

This section explains the actual implementation details of the key codebase modules.

### A. The Luxury Branding & Layout
*   **Visual Identity**: Built around a curated luxury color scheme featuring gold accent highlights (`#C9A84C`) on deep charcoal-black (`#0D0D0D`) surfaces. Custom fonts like **Playfair Display** (for headers) and **Inter** (for UI controls) are loaded directly.
*   **Header Navigation**: Located at [Navbar.tsx](file:///d:/Sushil/Projects/NextJs/I%20want%20to%20do%20earn%20big/Restaurants/frontend/src/components/layout/Navbar.tsx). It keeps track of the window scroll position. When users scroll down, it collapses; when they scroll up, it drops back down as a frosted glass container (`glass-dark` class).

### B. Dynamic Reservation Slots
*   **Avoiding Overbooking**: Inside [ReservationForm.tsx](file:///d:/Sushil/Projects/NextJs/I%20want%20to%20do%20earn%20big/Restaurants/frontend/src/components/reservation/ReservationForm.tsx), every change to the date or guest fields calls the backend to query existing reservations. Instead of presenting a static list of times, the time slots are populated dynamically from the database using capacity aggregations.

### C. Persistent Cart & Checkout Flow
*   **State Management**: Zustand handles state synchronously. Adding a dish with its customized choices (e.g., allergies, preparation temperature) updates a global cart state which automatically recalculates taxes, estimated delivery fees, discounts, and order subtotals.
*   **Checkout**: Handled in [checkout/page.tsx](file:///d:/Sushil/Projects/NextJs/I%20want%20to%20do%20earn%20big/Restaurants/frontend/src/app/(ordering)/checkout/page.tsx). The checkout form uses React Hook Form and maps the step progression (Steps 1, 2, and 3). Stripe's tokenization checks the card's validity securely before posting the order payload to the backend REST endpoint.

### D. Real-Time Order Tracking
*   **Timeline Progressions**: After creating an order, guests are routed to [order-tracking/[id]/page.tsx](file:///d:/Sushil/Projects/NextJs/I%20want%20to%20do%20earn%20big/Restaurants/frontend/src/app/(ordering)/order-tracking/%5Bid%5D/page.tsx). It uses Framer Motion components to fill up a gold vertical line indicating order milestones as the status changes in the database.

### E. Backend Security & Abuse Protection
*   **Rate Limits**: Inside [rateLimit.middleware.ts](file:///d:/Sushil/Projects/NextJs/I%20want%20to%20do%20earn%20big/Restaurants/backend/src/middleware/rateLimit.middleware.ts), different endpoints carry variable safety bounds. Authentication controllers (login/signup) restrict requests to **5 per 15 minutes** to prevent password cracking, while checkout triggers are limited to **20 per 15 minutes** to avoid card-spamming attacks.

---

## 7. How to Run the Project Locally

*Note: This is a full-stack Next.js and Node.js project. Do not use PHP or Laravel `artisan` commands.*

1.  **Install all dependencies**:
    ```bash
    npm run install:all
    ```
2.  **Launch the development environments**:
    ```bash
    npm run dev
    ```
    This will run both servers simultaneously using `concurrently`. 
    *   **Frontend Web App**: `http://localhost:3000`
    *   **Backend API Gateway**: `http://localhost:5000`
