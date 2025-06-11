# Garage Management System Documentation

## Table of Contents
1. [Business Analysis](#business-analysis)
2. [System Architecture](#system-architecture)
3. [Database Design](#database-design)
4. [Entity Design](#entity-design)
5. [Sequence Diagrams](#sequence-diagrams)
6. [Comprehensive System Flows](#comprehensive-system-flows)
7. [API Documentation](#api-documentation)
8. [Security Implementation](#security-implementation)

## Business Analysis

### 1.1 Project Overview
The Garage Management System is a comprehensive solution designed to streamline the operations of automotive service centers. The system facilitates vehicle service management, appointment scheduling, and customer relationship management.

### 1.2 Business Objectives
- Improve customer satisfaction through efficient service management
- Optimize resource allocation and scheduling
- Enhance communication between staff and customers
- Maintain accurate service records and history
- Streamline payment processing and invoicing

### 1.3 User Roles
1. **Customer**
   - Schedule appointments
   - View vehicle service history
   - Track service status
   - Make payments
   - Receive notifications

2. **Staff**
   - Manage appointments
   - Update service status
   - Record service details
   - Generate invoices
   - Handle customer inquiries

3. **Manager**
   - Oversee operations
   - Generate reports
   - Manage staff
   - Monitor performance metrics
   - Configure system settings

### 1.4 Key Features
- Vehicle management
- Appointment scheduling
- Service tracking
- Payment processing
- Customer notifications
- Reporting and analytics
- Inventory management
- Staff management

## System Architecture

### 2.1 Technology Stack
- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT with refresh tokens
- **State Management**: React Context API
- **UI Framework**: Tailwind CSS

### 2.2 System Components
1. **Frontend Application**
   - User interface components
   - State management
   - API integration
   - Authentication handling

2. **Backend Services**
   - RESTful API
   - Authentication service
   - Business logic
   - Data persistence

3. **Database**
   - Data storage
   - Data relationships
   - Data integrity

## Database Design

### 3.1 Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(17),
    color VARCHAR(30),
    mileage INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    service_type VARCHAR(100) NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    estimated_duration INTEGER,
    estimated_cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services Table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id),
    service_name VARCHAR(100) NOT NULL,
    description TEXT,
    cost DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Database Relationships
- Users -> Vehicles (One-to-Many)
- Users -> Appointments (One-to-Many)
- Vehicles -> Appointments (One-to-Many)
- Appointments -> Services (One-to-Many)
- Appointments -> Payments (One-to-Many)

## Entity Design

### 4.1 User Entity
```typescript
interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
}
```

### 4.2 Vehicle Entity
```typescript
interface Vehicle {
    id: number;
    customerId: number;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin?: string;
    color?: string;
    mileage: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
```

### 4.3 Appointment Entity
```typescript
interface Appointment {
    id: number;
    customerId: number;
    vehicleId: number;
    serviceType: string;
    appointmentDate: Date;
    status: string;
    description: string;
    estimatedDuration: number;
    estimatedCost: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
```

### 4.4 Service Entity
```typescript
interface Service {
    id: number;
    appointmentId: number;
    serviceName: string;
    description: string;
    cost: number;
    status: string;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
```

### 4.5 Payment Entity
```typescript
interface Payment {
    id: number;
    appointmentId: number;
    amount: number;
    paymentMethod: string;
    status: string;
    transactionId?: string;
    paymentDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
```

## Sequence Diagrams

### 5.1 Authentication Flows
- **Login Flow**: `login-flow.puml` - Basic login process
- **Registration Flow**: `register-flow.puml` - User registration process
- **Authentication Journey**: `auth-journey.puml` - Complete authentication user journey
- **Refresh Token Flow**: `refresh-token-flow.puml` - Token refresh mechanism
- **JWT Login**: `loginJWT.puml` - JWT-based authentication

### 5.2 Vehicle Management Flows
- **Vehicle List Flow**: `vehicle-list-flow.puml` - Vehicle listing and management
- **Vehicle Management Journey**: `vehicle-management-journey.puml` - Complete vehicle management workflow
- **Vehicle Management Flow**: `vehicle-management-flow.puml` - Core vehicle operations
- **Vehicle Process Flow**: `vehicle-process-flow.puml` - Vehicle processing workflow

### 5.3 Customer Dashboard Flows
- **Customer Dashboard Flow**: `customer-dashboard-flow.puml` - Customer dashboard operations
- **Customer Dashboard Use Case**: `customer-dashboard-use-case.puml` - Customer dashboard use cases

### 5.4 System Architecture Flows
- **System Flows**: `system-flows.puml` - Overall system workflow
- **Component Diagram**: `component-diagram.puml` - System component relationships
- **Component**: `component.puml` - Component structure
- **Container**: `container.puml` - Container architecture
- **Context**: `context.puml` - System context

## Comprehensive System Flows

### 6.1 Payment Processing Flow
**File**: `payment-processing-flow.puml`
- Complete payment lifecycle from appointment creation to payment completion
- Multiple payment methods (credit card, bank transfer, cash)
- Payment confirmation and receipt generation
- Refund processing workflow
- Manager oversight and payment analytics

### 6.2 Appointment Management Flow
**File**: `appointment-management-flow.puml`
- End-to-end appointment lifecycle management
- Appointment scheduling with availability checking
- Pre-appointment reminders and confirmations
- Service execution and progress tracking
- Appointment modifications and cancellations
- Manager oversight and scheduling analytics

### 6.3 Work Order Management Flow
**File**: `work-order-management-flow.puml`
- Complete work order workflow for staff members
- Work order creation and assignment
- Parts planning and reservation
- Work execution and progress updates
- Quality control and approval process
- Work order tracking and modifications

### 6.4 Staff Management Flow
**File**: `staff-management-flow.puml`
- Comprehensive staff administration for managers
- Staff hiring and onboarding process
- Schedule management and shift assignments
- Performance management and reviews
- Training and development tracking
- Payroll and benefits management
- Staff termination process

### 6.5 Inventory Management Flow
**File**: `inventory-management-flow.puml`
- Complete inventory and parts management
- Parts management and reorder level setting
- Stock management and parts reservation
- Purchase order processing
- Stock receiving and quality control
- Inventory tracking and auditing
- Supplier management

### 6.6 Notification System Flow
**File**: `notification-system-flow.puml`
- Real-time notification system
- Multiple notification types (appointments, services, payments, staff, system)
- Notification preferences and management
- Email, SMS, and push notification integration
- Notification analytics and reporting

### 6.7 Error Handling Flow
**File**: `error-handling-flow.puml`
- Comprehensive error handling and recovery
- Authentication and authorization errors
- Network and connectivity errors
- Validation and data constraint errors
- Database and business logic errors
- Frontend error handling
- Error recovery and reporting

### 6.8 Data Export and Reporting Flow
**File**: `data-export-reporting-flow.puml`
- Complete reporting and analytics system
- Multiple report types (financial, operational, customer, inventory, staff)
- Report generation and scheduling
- Data export functionality
- Report sharing and collaboration
- Report analytics and usage tracking

## API Documentation

### 7.1 Authentication Endpoints
```typescript
// Login
POST /api/auth/login
Request: {
    username: string;
    password: string;
}
Response: {
    token: string;
    user: User;
}

// Refresh Token
POST /api/auth/refresh
Request: {
    refreshToken: string;
}
Response: {
    accessToken: string;
    refreshToken: string;
}
```

### 7.2 Vehicle Endpoints
```typescript
// Get Customer Vehicles
GET /api/vehicles
Response: Vehicle[]

// Add Vehicle
POST /api/vehicles
Request: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin?: string;
    color?: string;
    mileage: number;
}
Response: Vehicle

// Update Vehicle
PUT /api/vehicles/:id
Request: {
    make?: string;
    model?: string;
    year?: number;
    licensePlate?: string;
    vin?: string;
    color?: string;
    mileage?: number;
}
Response: Vehicle
```

### 7.3 Appointment Endpoints
```typescript
// Get Appointments
GET /api/appointments
Response: Appointment[]

// Schedule Appointment
POST /api/appointments
Request: {
    vehicleId: number;
    serviceType: string;
    appointmentDate: string;
    description: string;
    estimatedDuration: number;
    estimatedCost: number;
    notes?: string;
}
Response: Appointment

// Update Appointment
PUT /api/appointments/:id
Request: {
    status?: string;
    description?: string;
    estimatedDuration?: number;
    estimatedCost?: number;
    notes?: string;
}
Response: Appointment
```

## Security Implementation

### 8.1 Authentication
- JWT-based authentication
- Refresh token mechanism
- Token expiration handling
- Secure password hashing

### 8.2 Authorization
- Role-based access control
- Route protection
- API endpoint security
- Resource access control

### 8.3 Data Security
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

### 8.4 Security Best Practices
- HTTPS enforcement
- Secure headers
- Rate limiting
- Error handling
- Logging and monitoring

## Conclusion
This documentation provides a comprehensive overview of the Garage Management System, including its business requirements, technical architecture, database design, and security implementation. The system is designed to be scalable, maintainable, and secure while providing a seamless experience for both customers and staff.

The comprehensive flow diagrams provide detailed insights into all major system workflows, ensuring complete understanding of the application's functionality and user interactions. These flows serve as valuable references for development, testing, and maintenance activities. 