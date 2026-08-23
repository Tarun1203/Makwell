# MAKWELL WEBSITE + CRM
## Final Master Sitemap, Functional Plan & Tab Structure

**Brand:** MakWell — Make it Happen  
**Company:** PUSHPAK ENTERPRISES  
**Address:** NO. 62/2, 3rd MAIN ROAD, NEW TIMBER YARD, UNKAL, HUBLI - 580031  
**Phone:** 9980000515  
**Email:** makwellindia456@gmail.com

---

# 1. SYSTEM OVERVIEW

MakWell consists of two connected interfaces:

1. **Public MakWell Website** — customer-facing
2. **MakWell CRM** — internal operations, dealer, service, warehouse and administration

Both use the same Firebase-backed data ecosystem.

```text
                         MAKWELL
                            |
          +-----------------+-----------------+
          |                                   |
     PUBLIC WEBSITE                       MAKWELL CRM
          |                                   |
      Customers                     +---------+---------+
                                    |         |         |
                                  Admin   Operations  Partners
          |                                   |
          +-------------------+---------------+
                              |
                           FIREBASE
```

---

# 2. PUBLIC MAKWELL WEBSITE

## Public Website Sitemap

```text
MAKWELL WEBSITE
|
+-- HOME
|
+-- PRODUCTS
|   +-- All Products
|   +-- Television
|   +-- Washing Machine
|   +-- Iron Box
|   +-- Sound System
|   +-- Stabilizer
|   +-- Future Product Categories
|
+-- PRODUCT DETAILS
|
+-- REGISTER PRODUCT
|
+-- BOOK SERVICE
|
+-- TRACK SERVICE
|
+-- BECOME A DEALER
|
+-- ABOUT MAKWELL
|
+-- CONTACT
|
+-- LEGAL
    +-- Warranty Policy
    +-- Privacy Policy
    +-- Terms & Conditions
```

## Home

- Hero banner
- Featured products
- Product categories
- Why MakWell
- Product quality
- Service/support
- Dealer CTA
- About
- Contact
- Footer

## Products

Initial categories:

- Television
- Washing Machine
- Iron Box
- Sound System
- Stabilizer

Product categories must come from the Product Master so Super Admin can add future categories without changing the website code.

## Product Details

Each product page can contain:

- Product images
- Product name
- Model
- Features
- Specifications
- Documents
- User manual
- Warranty
- Available variants
- Register Product
- Book Service
- Enquiry

## Register Product

Fields:

- Mobile
- Customer name
- Product category
- Model
- Serial number
- Purchase date
- Dealer
- Invoice upload

Flow:

```text
Website
  -> Customer
  -> Product
  -> Serial
  -> Warranty
  -> CRM
```

## Book Service

Fields:

- Mobile
- Customer
- Product
- Model
- Serial
- Complaint
- Photos
- Address

Flow:

```text
Website
  -> CRM Request
  -> Request Number
  -> District
  -> Service Center
  -> Technician
```

## Track Service

Customer enters:

- Request ID
- Mobile number

Example:

`PE-KA-SR-260823-0001`

Customer-facing status:

```text
Request Received
Assigned
Scheduled
Technician Visit
Spare Required
Repair
Completed
Closed
```

Internal CRM information such as technician phone number, internal comments, spare cost, claim amount and internal approval notes must not be exposed.

## Become a Dealer

Fields:

- Business name
- Owner name
- Mobile
- Email
- City
- District
- State
- Business type
- Years in business
- Existing brands
- Expected business
- Message

Flow:

```text
Website
  -> Dealer Lead
  -> CRM
  -> Approval
  -> Dealer Account
```

## Contact

**PUSHPAK ENTERPRISES**

NO. 62/2, 3rd MAIN ROAD,  
NEW TIMBER YARD,  
UNKAL, HUBLI - 580031

**Phone:** 9980000515  
**Email:** makwellindia456@gmail.com

---

# 3. MAKWELL CRM — 30 FUNCTION MASTER SITEMAP

```text
MAKWELL CRM
|
+-- 01. Dashboard
+-- 02. Customer Management
+-- 03. Customer 360
+-- 04. Product Category Management
+-- 05. Product & Model Management
+-- 06. Serial / Batch Management
+-- 07. Product Registration
+-- 08. Warranty Management
+-- 09. Dealer Management
+-- 10. Dealer Sales & Orders
+-- 11. Service Hub
+-- 12. Service Scheduling
+-- 13. Service Visits & Diagnosis
+-- 14. Installation Management
+-- 15. Spare Parts Management
+-- 16. Inventory Management
+-- 17. Stock Movement & Transfers
+-- 18. Spare Request & Logistics
+-- 19. Service Billing & Estimates
+-- 20. Payments, Claims & Settlements
+-- 21. RMA & Replacement
+-- 22. Service Center Management
+-- 23. Technician Management
+-- 24. Approvals & Onboarding
+-- 25. SLA & Escalation
+-- 26. Communication & Notifications
+-- 27. Reports & Analytics
+-- 28. Website & Lead Management
+-- 29. Users, Roles & Permissions
+-- 30. System Settings & Audit
```

---

# 4. ACTUAL SUPER ADMIN SIDEBAR

The 30 functions should NOT appear as 30 separate sidebar buttons. Group them into practical navigation.

```text
MAKWELL CRM

Dashboard

Customers
  +-- Customer 360

Products
  +-- Categories
  +-- Products & Models
  +-- Serial / Batch
  +-- Registration
  +-- Warranty

Dealers
  +-- Dealers
  +-- Sales
  +-- Orders

Service
  +-- Service Hub
  +-- Scheduling
  +-- Visits & Diagnosis
  +-- Installation

Inventory
  +-- Spare Parts
  +-- Warehouse
  +-- Service Centers
  +-- Technician Stock
  +-- Stock Movement
  +-- Spare Pipeline

Finance
  +-- Estimates
  +-- Invoices
  +-- Payments
  +-- Claims
  +-- Settlements

RMA & Replacement

Service Centers

Technicians

Approvals

SLA

Communication

Reports

Website
  +-- Website Requests
  +-- Leads
  +-- Products
  +-- Home Banner
  +-- Website Tools

Administration
  +-- Users & Permissions
  +-- Master Data
  +-- Configuration
  +-- Audit Logs
```

---

# 5. FUNCTION 01 — DASHBOARD

## Tabs

- Overview
- Service
- Inventory
- Financial
- Performance

## Super Admin dashboard

- New requests
- Active requests
- Closed requests
- Hold for spare
- Low stock
- Spare dispatch pending
- Warranty jobs
- Installation jobs
- RMA
- Claims
- Payments
- Dealer performance
- Service center performance
- Technician performance
- State analysis
- District analysis
- Product analysis

---

# 6. FUNCTION 02 — CUSTOMER MANAGEMENT

## Tabs

- All Customers
- Add Customer
- Active
- Inactive
- Duplicates

## Functions

- Add
- Edit
- Search
- Phone search
- Duplicate detection
- Merge
- Address
- State
- District
- Dealer
- Documents
- Customer status

**Customer ID** is the permanent database identifier. Phone number is used for search and duplicate detection.

---

# 7. FUNCTION 03 — CUSTOMER 360

Customer 360 is opened from a customer profile.

## Tabs

- Overview
- Products
- Warranty
- Service
- Installation
- Payments
- Claims
- RMA
- Communication
- Documents

Customer 360 provides the complete history of the customer.

---

# 8. FUNCTION 04 — PRODUCT CATEGORY MANAGEMENT

## Tabs

- Categories
- Add Category
- Active
- Inactive

Initial categories:

- Television
- Washing Machine
- Iron Box
- Sound System
- Stabilizer

Super Admin can add future categories.

---

# 9. FUNCTION 05 — PRODUCT & MODEL MANAGEMENT

## Tabs

- Products
- Models / SKUs
- Specifications
- Attributes
- Images
- Documents
- Price / MRP

## Product structure

```text
Category
  -> Product
  -> Model
  -> Attributes
  -> Warranty
```

Product attributes must be dynamic.

Examples:

### TV

- Screen size
- Resolution
- OS
- Panel

### Washing Machine

- Capacity
- Type
- Motor
- RPM

### Iron

- Wattage
- Soleplate
- Type

Future categories must be able to define their own attributes.

---

# 10. FUNCTION 06 — SERIAL / BATCH MANAGEMENT

## Tabs

- Search Serial
- Register Serial
- Serial History
- Transfers
- RMA / Replacement History

## Final serial-number rule

There is **NO separate Serial Number Master Import**.

Serial numbers are captured when the product is actually used in a business transaction:

- Dealer Sale
- Product Registration
- Installation
- Service Request

## Serial workflow

```text
Sale / Registration / Installation / Service
              |
              v
       Enter or Scan Serial
              |
              v
          Validate
              |
       +------+------+
       |             |
    Existing      Not Found
       |             |
       v             v
     Link       Register New
```

Functions:

- Enter serial
- Scan QR/barcode
- Validate serial
- Search serial
- Register serial
- Assign serial
- Transfer serial
- Serial history
- Warranty link
- Service link
- RMA link
- Replacement link

---

# 11. FUNCTION 07 — PRODUCT REGISTRATION

## Tabs

- New Registration
- Registered Products
- Pending
- Rejected
- Registration History

## Registration flow

```text
Customer
  -> Product
  -> Model
  -> Serial
  -> Invoice
  -> Purchase Date
  -> Dealer
  -> Registration
  -> Warranty Activation
```

Registration can originate from:

- Website
- Dealer
- CRM
- Service Center

---

# 12. FUNCTION 08 — WARRANTY MANAGEMENT

Warranty is **component-level where applicable**.

## Tabs

- Warranty Plans
- Coverage Components
- Active Warranty
- Expired Warranty
- Claims
- Warranty Exceptions

## Confirmed MakWell warranty rules

| Product | Component | Warranty |
|---|---|---:|
| Washing Machine | Full Product | 1 Year |
| Washing Machine | Spin Motor | 2 Years |
| Washing Machine | Wash Motor | 5 Years |
| Stabilizer | Full Product | 5 Years |
| Iron Box | Full Product | 2 Years |

## Example

Purchase date: `23-Aug-2026`

### Washing Machine

- Full Product: 23-Aug-2026 to 22-Aug-2027
- Spin Motor: 23-Aug-2026 to 22-Aug-2028
- Wash Motor: 23-Aug-2026 to 22-Aug-2031

## Service warranty check

The system must check the defective component.

Example:

```text
Product: Washing Machine
Component: Wash Motor
Warranty: 5 Years
Status: ACTIVE
```

The system should not simply show `Warranty: Active`.

---

# 13. FUNCTION 09 — DEALER MANAGEMENT

## Tabs

- All Dealers
- Pending Approval
- Active
- Inactive
- Dealer Profile
- Dealer Performance

## Dealer data

- Dealer code
- Business name
- Contact
- Address
- State
- District
- Login
- Customers
- Sales
- Registrations
- Service requests
- Performance

---

# 14. FUNCTION 10 — DEALER SALES & ORDERS

## Dealer Portal Tabs

```text
Dashboard
Customers
Sales
Orders
Product Registration
My Products
Service Requests
RMA
Reports
```

## Sale flow

```text
Dealer
  -> Customer
  -> Product
  -> Model
  -> Serial
  -> Invoice
  -> Product Registration
  -> Warranty
```

---

# 15. FUNCTION 11 — SERVICE HUB

One universal **Request** record.

## Tabs

- All
- Installation
- In-Warranty
- Out-Warranty
- Other

## Request sources

- Website
- Dealer
- Service Center
- Technician
- Staff

## Filters

- Request ID
- Customer
- Phone
- Product
- Model
- Serial
- Dealer
- State
- District
- Service Center
- Technician
- Source
- Status
- Priority
- SLA
- Date

---

# 16. FUNCTION 12 — SERVICE SCHEDULING

## Tabs

- Calendar
- Today
- Upcoming
- Rescheduled
- Missed Visits

## Functions

- Appointment
- Preferred date
- Preferred time
- Technician assignment
- Reschedule
- Customer unavailable
- Visit attempt
- Next visit

---

# 17. FUNCTION 13 — SERVICE VISITS & DIAGNOSIS

Inside a Request:

```text
Service Request
+-- Overview
+-- Customer
+-- Product
+-- Warranty
+-- Visit
+-- Diagnosis
+-- Parts
+-- Photos
+-- Financial
+-- Claims
+-- Timeline
+-- Audit
```

## Diagnosis

```text
Complaint
  -> Component
  -> Diagnosis
  -> Warranty Check
  -> Action
  -> Repair / Spare / RMA
```

Capture:

- Complaint
- Diagnosis
- Cause
- Component
- Action
- Parts required
- Parts used
- Photos
- Technician notes
- Check-in
- Check-out
- Customer confirmation

---

# 18. FUNCTION 14 — INSTALLATION MANAGEMENT

## Tabs

- New
- Scheduled
- Assigned
- In Progress
- Completed
- Closed

## Workflow

```text
Installation Request
  -> Schedule
  -> Technician
  -> Product
  -> Serial
  -> Installation Checklist
  -> Photos
  -> Customer OTP / Signature
  -> Completed
  -> Closed
```

Installation financial information connects to Payments, Claims & Settlements.

---

# 19. FUNCTION 15 — SPARE PARTS MANAGEMENT

## Tabs

- Part Master
- Categories
- Compatibility
- Prices
- Suppliers
- Reorder Levels
- Inactive

## Part master fields

- Part code
- Part name
- Category
- Compatible products
- Compatible models
- Cost
- MRP
- Customer price
- Reorder level
- Minimum stock
- Supplier
- Active/inactive

---

# 20. FUNCTION 16 — INVENTORY MANAGEMENT

## Tabs

- Head Office
- Service Centers
- Technicians
- Low Stock
- In Transit
- Stock Summary

## Warehouse stock

- Fresh
- Reserved
- In Transit
- Used/Returned
- Claimed
- Refurbished
- Disposed

## Service Center stock

- Fresh
- Assigned
- Used
- Claimed
- In Transit

## Technician stock

- Available
- Assigned
- Used

---

# 21. FUNCTION 17 — STOCK MOVEMENT & TRANSFERS

## Tabs

- All Transactions
- HO -> Center
- Center -> Technician
- Technician -> Center
- Center -> HO
- Adjustments
- Audit

Every stock movement records:

- From
- To
- Part
- Quantity
- Reference
- User
- Date/time

---

# 22. FUNCTION 18 — SPARE REQUEST & LOGISTICS

## Tabs

- Technician Requests
- Center Orders
- Warehouse Dispatch
- In Transit
- Received
- Send Back
- Claims
- Resend
- Local Purchase

## Normal spare flow

```text
Technician
  -> Center Stock?
       |
       +-- Yes -> Issue
       |
       +-- No -> Center Request
                    -> Warehouse
                    -> Dispatch
                    -> In Transit
                    -> Receive
```

## Local spare purchase

Available to:

- Service Center
- Technician

Flow:

```text
Stock unavailable
  -> Local Purchase Request
  -> Center / Technician purchases
  -> Upload Invoice
  -> Spare used
  -> Service completed
  -> Warranty eligibility check
  -> Reimbursement Claim
  -> Approval
  -> Settlement
  -> Payment
```

## Emergency purchase

Allowed within Super Admin-configured limits.

---

# 23. FUNCTION 19 — SERVICE BILLING & ESTIMATES

## Tabs

- Estimates
- Customer Approval
- Invoices
- Pending Payment
- Paid
- Refunds

## Out-warranty flow

```text
Diagnosis
  -> Estimate
  -> Customer Approval
  -> Repair
  -> Invoice
  -> Payment
  -> Receipt
  -> Close
```

Charges:

- Visit
- Labour
- Spare
- Other
- Discount
- Tax
- Total

---

# 24. FUNCTION 20 — PAYMENTS, CLAIMS & SETTLEMENTS

This is a separate financial layer from customer service requests.

## Tabs

```text
Financial
+-- Customer Payments
+-- Service Center Claims
+-- Technician Claims
+-- Local Purchase Reimbursement
+-- Commission
+-- Settlements
+-- Pending Payments
+-- Paid
+-- Payment History
```

## Customer payments

- Service charge
- Installation charge
- Spare charge
- Payment received
- Pending payment
- Refund

## Service Center claims

- Installation claim
- Service visit claim
- Warranty service claim
- Out-warranty service claim
- Spare-related claim
- Local purchase reimbursement

## Technician claims

- Installation claim
- Service visit claim
- Travel/visit claim
- Local spare purchase reimbursement
- Commission

## Claim lifecycle

```text
Draft
  -> Submitted
  -> Under Review
  -> Approved
  -> Payable
  -> Paid
```

Alternative states:

- Partially Approved
- Rejected
- Resubmitted

## Settlement

```text
Service Center / Technician
  -> Approved Claims
  -> Settlement Batch
  -> Payment
  -> Payment Reference
```

---

# 25. FUNCTION 21 — RMA & REPLACEMENT

## Tabs

- New RMA
- Pending Approval
- Approved
- Product Return
- Inspection
- Replacement
- Rejected
- Closed

## Workflow

```text
Service
  -> Diagnosis
  -> Replacement Required
  -> RMA
  -> Approval
  -> Old Product Return
  -> Inspection
  -> Replacement
  -> New Serial
  -> Customer
  -> Close
```

Critical relationship:

**Old Serial -> New Serial**

---

# 26. FUNCTION 22 — SERVICE CENTER MANAGEMENT

## Tabs

- All Centers
- Pending
- Active
- Center Profile
- Center Stock
- Technicians
- Requests
- Claims
- Performance

## Center information

- Center name
- State
- District
- Address
- Contact
- POC
- Login
- Technicians
- Stock
- Requests
- Claims

## Routing

```text
Customer District
  -> Service Center Mapping
  -> Default Active Center
  -> Request Assignment
```

If no center exists:

**HO / Warehouse Queue**

---

# 27. FUNCTION 23 — TECHNICIAN MANAGEMENT

## Tabs

- All Technicians
- Active
- Inactive
- Technician Profile
- Jobs
- Spare Bag
- Claims
- Earnings
- Performance

## Technician information

- Name
- Center
- Contact
- Login
- Assigned jobs
- Spare stock
- Claims
- Commission
- Performance
- Documents

---

# 28. FUNCTION 24 — APPROVALS & ONBOARDING

## Tabs

- All
- Dealer
- Service Center
- Technician
- Local Purchase
- Spare Request
- RMA
- Replacement
- Discount
- Claims
- Master Data

## Master data workflow

```text
Warehouse
  -> Prepare Import
  -> Validate
  -> Submit
  -> Super Admin
  -> Approve
  -> Publish
```

---

# 29. FUNCTION 25 — SLA & ESCALATION

## Tabs

- Dashboard
- Due Soon
- Breached
- Escalated
- SLA Rules
- Escalation Rules

Track:

- First response
- Assignment
- Visit
- Spare
- Repair
- Closure

Statuses:

- Within SLA
- Due Soon
- Breached

Escalation:

```text
Technician
  -> Service Center
  -> Warehouse
  -> Super Admin
```

---

# 30. FUNCTION 26 — COMMUNICATION & NOTIFICATIONS

## Tabs

- WhatsApp
- SMS
- Email
- Templates
- Notifications
- Communication History

## Customer notifications

- Request received
- Appointment
- Technician assigned
- Visit
- Spare delay
- Repair completed
- Payment
- Closure
- Warranty

## Dealer notifications

- Request status
- Completion
- Product registration
- RMA

## Internal notifications

- Assignment
- Approval
- Spare request
- SLA
- Claim
- Low stock

---

# 31. FUNCTION 27 — REPORTS & ANALYTICS

## Tabs

- Dashboard
- Sales
- Products
- Customers
- Service
- Warranty
- Installation
- Inventory
- Spare Consumption
- RMA
- Claims
- Payments
- Dealers
- Service Centers
- Technicians
- SLA

## Reports

### Sales

- State
- Dealer
- Product
- Model

### Service

- State
- District
- Product
- Model
- Component
- Complaint
- Warranty
- Out-warranty
- Installation
- Repeat complaints

### Inventory

- Stock
- Consumption
- Spare cost
- Claims
- Local purchases
- Refurbished
- Disposed

### Financial

- Technician claims
- Center claims
- Pending
- Approved
- Rejected
- Paid
- Outstanding
- Service revenue
- Service cost
- RMA cost

---

# 32. FUNCTION 28 — WEBSITE & LEAD MANAGEMENT

## Tabs

- Website Requests
- Leads
- Dealer Enquiries
- Product Enquiries
- Contact Enquiries
- Product Catalogue
- Home Banner
- Website Settings

## Website -> CRM connections

```text
Product Catalogue
  -> Product Master

Register Product
  -> Customer + Product + Serial + Warranty

Book Service
  -> Service Hub

Track Service
  -> Request Status

Dealer Enquiry
  -> Dealer Leads

Contact
  -> Website Leads
```

---

# 33. FUNCTION 29 — USERS, ROLES & PERMISSIONS

## Tabs

- Users
- Roles
- Permissions
- Login Activity
- Access History

## Final roles

1. Super Admin
2. Warehouse / Secondary Admin
3. Service Center
4. Technician
5. Dealer

## Super Admin

Full access.

## Warehouse

Operational access plus approved/controlled master-data requests.

## Service Center

Own center.

## Technician

Own assigned work.

## Dealer

Own dealer ecosystem.

Permission types:

- View
- Create
- Edit
- Approve
- Close
- Export
- Financial visibility
- Master-data access

---

# 34. FUNCTION 30 — SYSTEM SETTINGS & AUDIT

## Tabs

```text
Administration
+-- General Settings
+-- State & District
+-- Product Configuration
+-- Warranty Configuration
+-- Service Configuration
+-- Inventory Configuration
+-- Claim Rules
+-- Commission Rules
+-- SLA Rules
|
+-- Master Data Management
|   +-- Import Masters
|   +-- Download Sample Files
|   +-- Export Masters
|   +-- Validation
|   +-- Pending Approval
|   +-- Import History
|
+-- Audit Logs
```

---

# 35. MASTER DATA IMPORT

Master import is available to Super Admin.

Warehouse can prepare selected imports and submit them for approval.

## Importable masters

- Product Categories
- Products
- Models / SKUs
- Product Attributes
- Warranty Plans
- Warranty Components
- Spare Parts
- Spare Compatibility
- Spare Prices
- Dealers
- Service Centers
- Technicians
- Customers
- Product Registrations
- Opening Stock
- Other configured masters

## Import process

```text
Download Sample
  -> Fill Excel/CSV
  -> Upload
  -> Validate
  -> Preview
  -> Fix Errors
  -> Submit
  -> Approval if required
  -> Publish
  -> Import History
```

## Validation

Check:

- Required fields
- Invalid values
- Duplicate records
- Unknown product/model
- Unknown dealer
- Unknown center
- Invalid state/district
- Invalid references
- Data format

## Import history

Store:

- File name
- Uploaded by
- Date/time
- Record count
- Valid records
- Errors
- Warnings
- Status
- Approval
- Publish result

## Important

**Serial Number is NOT a Master Data Import.**

Serial numbers are captured during:

- Sale
- Product Registration
- Installation
- Service Request

---

# 36. FINAL REQUEST NUMBER FORMAT

```text
PE-[STATE]-[TYPE]-[YYMMDD]-[SEQUENCE]
```

Examples:

```text
PE-KA-SR-260823-0001
PE-KA-IN-260823-0002
PE-KA-WR-260823-0003
PE-KA-OW-260823-0004
PE-KA-RMA-260823-0005
PE-KA-PR-260823-0006

PE-AP-SR-260823-0001
PE-TS-SR-260823-0001
PE-TN-SR-260823-0001
PE-KL-SR-260823-0001
```

**District is NOT included in the customer-facing request number.**

District remains a database field for routing and reporting.

---

# 37. REQUEST TYPE CODES

| Code | Meaning |
|---|---|
| SR | Service Request |
| IN | Installation |
| WR | Warranty |
| OW | Out-Warranty |
| RMA | RMA |
| PR | Product Registration |
| DL | Dealer |
| EN | Enquiry |
| DM | Demo |

Super Admin should be able to configure additional request types in the future.

---

# 38. REQUEST STATUS

```text
NEW
  -> ASSIGNED
  -> IN PROGRESS
       +-- WAITING FOR SPARE
       +-- WAITING FOR CUSTOMER
       +-- WAITING FOR APPROVAL
  -> COMPLETED
  -> CLOSED
```

Alternative paths:

- Cancelled
- Reopened

**Waiting for Spare** should be system-controlled by an open spare request.

---

# 39. COMPLETE SERVICE FINANCIAL FLOW

```text
                    SERVICE REQUEST
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
     CUSTOMER COST    SERVICE CLAIM     SPARE COST
          |                |                |
          v                v                v
       PAYMENT       CENTER/TECHNICIAN   INVENTORY
                           |
                           v
                    LOCAL PURCHASE
                           |
                           v
                    WARRANTY CHECK
                           |
                 +---------+---------+
                 |                   |
                 v                   v
             ELIGIBLE           NOT ELIGIBLE
                 |                   |
                 v                   v
          REIMBURSEMENT          CUSTOMER
                 |
                 v
             APPROVAL
                 |
                 v
             SETTLEMENT
                 |
                 v
               PAID
```

---

# 40. LOCAL SPARE PURCHASE

Local purchase is available to:

- Service Center
- Technician

## Required fields

- Service Request ID
- Purchaser type
- Purchaser
- Center
- Part
- Quantity
- Supplier
- Invoice number
- Purchase date
- Purchase amount
- Tax
- Total amount
- Invoice upload
- Payment proof
- Purchase mode
- Reason

## Warranty reimbursement

After the service is completed:

```text
Local Purchase
  -> Invoice
  -> Service Request
  -> Product
  -> Component
  -> Warranty Check
  -> Eligible?
  -> Claim
  -> Approval
  -> Settlement
  -> Payment
```

Super Admin can configure maximum reimbursement limits.

---

# 41. CLAIM RULES

Claim rules should be configurable.

Fields:

- Product category
- Product/model
- Spare part
- Warranty type
- Claimant type
- Fixed amount / percentage
- Maximum claim
- Approval required
- Effective from
- Effective to
- Active

This prevents uncontrolled reimbursement.

---

# 42. CORE DATA RELATIONSHIP

```text
                    PRODUCT CATEGORY
                           |
                           v
                     PRODUCT / MODEL
                           |
                           v
                     SERIAL / BATCH
                           |
              +------------+------------+
              |                         |
              v                         v
           DEALER                   CUSTOMER
              |                         |
              +------------+------------+
                           |
                           v
                        WARRANTY
                           |
                           v
                    SERVICE REQUEST
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
          VISIT         SPARES        BILLING
             |             |             |
             v             v             v
        DIAGNOSIS      INVENTORY      PAYMENT
             |
        +----+----+
        |         |
        v         v
      REPAIR     RMA
        |         |
        |         v
        |    REPLACEMENT
        |         |
        |         v
        |     NEW SERIAL
        |
        v
      CLOSE
```

---

# 43. COMPLETE WEBSITE -> CRM FLOW

```text
                         PUBLIC WEBSITE
                              |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
       PRODUCTS           REGISTER            SERVICE
       CATALOGUE          PRODUCT             REQUEST
          |                   |                   |
          +-------------------+-------------------+
                              |
                              v
                           FIREBASE
                              |
        +---------------------+---------------------+
        |                     |                     |
        v                     v                     v
     CUSTOMER              PRODUCT                DEALER
        |                     |                     |
        +---------------------+---------------------+
                              |
                              v
                          WARRANTY
                              |
                              v
                       SERVICE REQUEST
                              |
                              v
                          DISTRICT
                              |
                              v
                       SERVICE CENTER
                              |
                              v
                         TECHNICIAN
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
           DIAGNOSIS        SPARES         BILLING
              |               |               |
              v               v               v
            REPAIR        INVENTORY        PAYMENT
              |
         +----+----+
         |         |
         v         v
       CLOSE      RMA
                   |
                   v
              REPLACEMENT
                   |
                   v
               NEW SERIAL
```

---

# 44. ROLE-BASED SIDEBARS

## Super Admin

```text
Dashboard
Customers
Products
Dealers
Service
Inventory
Finance
RMA & Replacement
Service Centers
Technicians
Approvals
SLA
Communication
Reports
Website
Administration
```

## Warehouse

```text
Dashboard
Service
Inventory
Finance / Claims
Approvals
Reports
Profile
```

Warehouse should have:

- Network view
- My Work view

Warehouse can prepare controlled master imports, subject to approval where configured.

## Service Center

```text
Dashboard
Service
Scheduling
Technicians
Center Inventory
Spare Pipeline
Local Purchase
Claims
Reports
Profile
```

## Technician

```text
Dashboard
My Jobs
Schedule
Diagnosis
My Spare Bag
Local Purchase
Claims
Earnings
Profile
```

## Dealer

```text
Dashboard
Customers
Sales
Orders
Products
Product Registration
Service Requests
RMA
Reports
Profile
```

---

# 45. CORE BUSINESS RULES

1. MakWell is the brand.
2. Pushpak Enterprises is the company/contact entity.
3. The normal MakWell website remains separate from the CRM interface.
4. Website and CRM use the same Firebase ecosystem.
5. CRM supports all MakWell product categories, not only TVs.
6. Super Admin can create new product categories.
7. Product specifications use dynamic attributes.
8. Warranty supports component-level coverage.
9. Washing Machine warranty = 1 Year Full Product + 2 Years Spin Motor + 5 Years Wash Motor.
10. Stabilizer warranty = 5 Years.
11. Iron Box warranty = 2 Years.
12. Serial numbers are captured at sale, registration, installation or service.
13. There is no separate Serial Number Master Import.
14. One Request record handles service, installation, warranty, out-warranty and other request types.
15. District is used for routing, not request numbering.
16. Request number = `PE-[STATE]-[TYPE]-[YYMMDD]-[SEQUENCE]`.
17. Local spare purchase is available to Service Center and Technician.
18. Warranty-eligible local purchases can become reimbursement claims.
19. Customer payments and Center/Technician claims are separate financial flows.
20. Claims require approval before settlement.
21. RMA maintains old serial -> new serial history.
22. Warehouse can prepare controlled master-data imports.
23. Protected master changes require Super Admin approval.
24. Important operational and financial actions must be audited.
25. Website, CRM, dealer and service operations use the same Firebase data ecosystem.
26. The 30 functions define the functional architecture; the UI uses grouped navigation and tabs.
27. Future products must be addable without changing the core CRM architecture.
28. Historical records should not be deleted; use inactive/archived states.
29. Financial claims must retain invoice/payment evidence.
30. Customer-facing pages must never expose internal operational or financial information.

---

# 46. RECOMMENDED DEVELOPMENT PHASES

## Phase 1 — Foundation

- Firebase
- Authentication
- Users
- Roles
- Permissions
- Customers
- Products
- Categories
- Models
- Dynamic attributes
- Serial records
- Warranty

## Phase 2 — Service

- Service Hub
- Routing
- Service Centers
- Technicians
- Scheduling
- Visits
- Diagnosis
- Installation

## Phase 3 — Inventory

- Spare Parts
- Warehouse
- Center Stock
- Technician Stock
- Stock Movements
- Spare Requests
- Dispatch
- Receiving
- Local Purchase

## Phase 4 — Finance

- Estimates
- Invoices
- Customer Payments
- Technician Claims
- Center Claims
- Reimbursements
- Settlements
- Commission

## Phase 5 — After-Sales

- RMA
- Replacement
- Old/New Serial mapping

## Phase 6 — Website

- Product Catalogue
- Product Details
- Registration
- Service Booking
- Service Tracking
- Dealer Enquiry
- Contact/Leads

## Phase 7 — Automation

- WhatsApp
- SMS
- Email
- Notifications
- SLA
- Escalation

## Phase 8 — Management

- Reports
- Analytics
- Master Import/Export
- Audit
- Configuration

---

# 47. FINAL ARCHITECTURE PRINCIPLE

The CRM should NOT be designed as a TV service CRM.

It should be:

> **A product-agnostic MakWell ecosystem where Super Admin can add a new product category, define its models, attributes, warranty and service rules, and immediately use that product across sales, registration, warranty, service, inventory and RMA.**

The central relationship is:

```text
Product
  -> Model
  -> Serial
  -> Customer
  -> Warranty
  -> Service
  -> Parts
  -> Claims
  -> RMA
  -> Replacement
```

while:

```text
Dealer
  -> Sale
  -> Serial
  -> Customer
  -> Registration
```

and:

```text
Website
  -> Lead / Registration / Service
  -> Customer
  -> CRM
```

All three flows converge into the same system.
