# 🏥 Hospital Management System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)

</div>

<div align="center">

### 🌐 [Live Demo](https://hospital-management-system-ruby-eight.vercel.app/) | 📦 [GitHub Repository](https://github.com/woafi/hospital-management-system)

</div>

A comprehensive, production-ready hospital management system built with Next.js 16, featuring server-side rendering for optimal performance and demonstrating modern full-stack development practices. The application provides complete management of hospital operations including appointments, patient records, doctor management, and multi-role dashboard systems.

> ⚠️ **Deployment Note**: This project is deployed on **Vercel Free Tier** with **PostgreSQL database on Supabase Free Tier**. The majority of pages use **Server-Side Rendering (SSR)** to demonstrate professional server-side coding patterns and best practices. This architectural choice may result in slightly slower initial page loads during peak usage times. Image uploads are handled through **Cloudinary** for efficient media management. This is intentional to showcase real-world performance considerations in full-stack development in case of **Server-Side Rendering (SSR)**

## ✨ Key Features

### 🏢 Admin Dashboard
- **Comprehensive Analytics**: Real-time KPIs and system metrics
- **Patient Management**: Complete patient registration, profile management, and medical history
- **Doctor Management**: Doctor profiles, specializations, availability scheduling
- **Appointment Management**: View, manage, and track all appointments
- **Receptionist Management**: Manage reception staff and their assignments
- **System Logs**: Monitor system activities and audit trails
- **Role-Based Access Control**: Fine-grained permission management

### 👨‍⚕️ Doctor Dashboard
- **Appointment Schedule**: View upcoming appointments with patient details
- **Patient Directory**: Access complete patient information and medical records
- **Availability Management**: Set and manage consultation availability
- **Daily Summary**: View daily appointment summaries and metrics
- **Patient Search**: Advanced search functionality for patient lookup

### 🎫 Receptionist Dashboard
- **Appointment Booking**: Easy appointment scheduling interface
- **Patient Check-in**: Manage patient arrivals and check-ins
- **Availability Viewing**: Check doctor availability in real-time
- **Appointment Tracking**: Monitor appointment status
- **Quick Actions**: Fast access to common tasks

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: Multiple user roles (Super Admin, Admin, Doctor, Receptionist)
- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Secure session handling with Jose
- **Protected Routes**: Server-side and client-side route protection

### 🎨 User Experience
- **Dark Mode**: System-wide dark/light mode with persistent preferences
- **Real-time Updates**: Pusher integration for live notifications
- **Modern UI/UX**: Clean, intuitive interface with Material Design icons
- **Smooth Navigation**: Optimized page transitions and loading states
- **Form Validation**: Client-side and server-side validation with Zod

## 🛠️ Tech Stack

### Frontend
| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **Runtime** | React 19 |
| **Language** | JavaScript (JS) |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React, Material Design Symbols |
| **Calendar** | React Calendar |
| **Real-time** | Pusher.js |
| **Theme Management** | Next Themes |
| **Image Upload** | Cloudinary |

### Backend
| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (Server Actions, API Routes) |
| **Runtime** | Node.js |
| **Database** | PostgreSQL (hosted on Supabase) |
| **ORM** | Prisma |
| **Authentication** | JWT (jose), bcrypt |
| **Real-time** | Pusher |
| **Validation** | Zod |

### Deployment & Hosting
| Service | Platform |
|---------|----------|
| **Frontend & Backend** | Vercel (Free Tier) |
| **Database** | Supabase PostgreSQL (Free Tier) |
| **Real-time** | Pusher (Free Plan) |
| **Image Storage** | Cloudinary |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control
- **PostgreSQL** (v14 or higher) OR Supabase account for cloud database

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/woafi/hospital-management-system.git
cd hospital-management-system
```

### 2. Setup PostgreSQL Database

You can use either a local PostgreSQL installation or Supabase (cloud-hosted PostgreSQL):

#### Option A: Local PostgreSQL

```bash
# Open PostgreSQL prompt
psql -U postgres

# Create the database
CREATE DATABASE hospital_management_db;

# Exit PostgreSQL prompt
\q
```

#### Option B: Supabase (Recommended for Production)

1. Create a free account at [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Project Settings → Database
4. Copy the connection string (format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)

### 3. Environment Setup

Create a `.env.local` file in the root directory:

#### For Local PostgreSQL:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/hospital_management_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3000"
PUSHER_APP_ID="your-pusher-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="mt1"
PUSHER_SECRET="your-pusher-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

#### For Supabase (Production):
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXT_PUBLIC_API_URL="https://hospital-management-system-ruby-eight.vercel.app"
PUSHER_APP_ID="your-pusher-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="mt1"
PUSHER_SECRET="your-pusher-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

### 4. Install Dependencies

```bash
npm install
# or
yarn install
```

### 5. Setup Prisma & Database

```bash
# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Optional: Seed the database with demo data
npx prisma db seed
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 🧪 Demo Credentials

After setting up the database, use these demo credentials to login:

**Admin Account**
- Email: admin@hospital.com
- Password: Admin123!

**Doctor Account**
- Email: doctor@hospital.com
- Password: Doctor123!

**Receptionist Account**
- Email: receptionist@hospital.com
- Password: Receptionist123!

Or create a new account using the signup page.

## 📁 Project Structure

```
hospital-management-system/
├── app/
│   ├── actions/                         # Server Actions
│   │   ├── appointmentActions.js        # Appointment operations
│   │   ├── availabilityActions.js       # Doctor availability management
│   │   ├── directorySearchAction.js     # Doctor directory search
│   │   ├── doctorFormsubmissionAction.js # Doctor form submission
│   │   ├── loginAction.js               # Authentication
│   │   ├── logoutAction.js              # Logout
│   │   ├── patientEditFormsubmissionAction.js # Patient profile updates
│   │   ├── patientFormsubmissionAction.js # Patient registration
│   │   └── receptionistFormsubmissionAction.js # Receptionist management
│   ├── api/                             # API Routes
│   │   ├── admindashboard/              # Admin dashboard endpoints
│   │   ├── doctordashboard/             # Doctor dashboard endpoints
│   │   ├── doctors/                     # Doctor management endpoints
│   │   └── receptiondashboard/          # Reception dashboard endpoints
│   ├── dashboard/                       # Dashboard pages
│   │   ├── layout.js                    # Dashboard layout wrapper
│   │   ├── page.js                      # Main dashboard page
│   │   └── (list)/                      # Dashboard sub-pages
│   ├── doctor/                          # Doctor pages
│   │   ├── layout.js                    # Doctor layout
│   │   └── [doctorId]/                  # Dynamic doctor profile
│   ├── receptionist/                    # Receptionist pages
│   │   ├── layout.js                    # Receptionist layout
│   │   └── [receptionistId]/            # Dynamic receptionist profile
│   ├── settings/                        # Settings pages
│   │   └── page.js                      # User settings
│   ├── globals.css                      # Global styles
│   ├── layout.js                        # Root layout
│   ├── not-found.js                     # 404 page
│   └── page.js                          # Home page
│
├── components/                          # Reusable Components
│   ├── AdminDashboard.js                # Admin dashboard layout
│   ├── AdminSideNav.js                  # Admin navigation
│   ├── AppointmentButton.js             # Appointment action button
│   ├── AppointmentCalender.js           # Appointment calendar
│   ├── AppointmentSearchBar.js          # Appointment search
│   ├── BookAppointment.js               # Appointment booking
│   ├── BookAppointmentModal.js          # Appointment modal
│   ├── DoctorDashboard.js               # Doctor dashboard layout
│   ├── DoctorSideNav.js                 # Doctor navigation
│   ├── DailySummaryMetrics.js           # Daily KPI metrics
│   ├── KPICard.js                       # KPI card component
│   ├── TypeaheadSearch.js               # Doctor search with autocomplete
│   ├── WeeklyAvailability.js            # Weekly schedule display
│   ├── patient/                         # Patient components
│   │   ├── PatientFormUI.js             # Patient form
│   │   ├── EditPatientModal.js          # Patient edit modal
│   │   └── EditPatientTrigger.js        # Edit trigger button
│   └── ...                              # Other UI components
│
├── Design/                              # Design references and prototypes
│   ├── executive_management_dashboard/  # Dashboard design
│   ├── doctor_consultation_workspace/   # Doctor workspace design
│   ├── comprehensive_patient_profile/   # Patient profile design
│   └── ...                              # Other design assets
│
├── lib/                                 # Utility functions
│   ├── auth.js                          # Authentication utilities
│   ├── dashboardLog.js                  # Dashboard logging
│   ├── getRoleHome.js                   # Role-based home routing
│   ├── patientFormHelpers.js            # Form helpers
│   ├── prisma.js                        # Prisma client instance
│   ├── pusher.js                        # Pusher configuration
│   └── timeFormat.js                    # Time formatting utilities
│
├── prisma/
│   ├── schema.prisma                    # Database schema
│   ├── seed.js                          # Database seeding script
│   └── migrations/                      # Migration history
│
├── public/                              # Static assets
│
├── next.config.mjs                      # Next.js configuration
├── tailwind.config.js                   # Tailwind CSS configuration
├── postcss.config.mjs                   # PostCSS configuration
├── eslint.config.mjs                    # ESLint configuration
├── jsconfig.json                        # JavaScript config
├── package.json                         # Project dependencies
└── README.md                            # Project documentation
```

## 🏗️ Database Schema

### User Roles
- **SUPER_ADMIN**: Full system access
- **ADMIN**: Hospital administration and management
- **DOCTOR**: Medical staff with patient appointments
- **RECEPTIONIST**: Front desk operations

### Key Models
- **User**: Authentication and role management
- **Doctor**: Doctor profiles and specializations
- **Patient**: Patient information and medical records
- **Appointment**: Appointment bookings and tracking
- **Availability**: Doctor consultation availability
- **Receptionist**: Reception staff management

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/login` | Login with credentials |
| `POST` | `/api/logout` | Logout user |
| `POST` | `/api/register` | Register new account |

### Admin Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admindashboard` | Get admin dashboard data |
| `GET` | `/api/admindashboard/metrics` | Get system metrics |
| `GET` | `/api/admindashboard/logs` | Get system logs |

### Doctor Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/doctors` | List all doctors |
| `GET` | `/api/doctors/:id` | Get doctor details |
| `POST` | `/api/doctors` | Create new doctor |
| `PUT` | `/api/doctors/:id` | Update doctor profile |
| `GET` | `/api/doctors/:id/availability` | Get doctor availability |

### Doctor Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/doctordashboard` | Get doctor dashboard |
| `GET` | `/api/doctordashboard/appointments` | Get doctor's appointments |
| `GET` | `/api/doctordashboard/patients` | Get doctor's patients |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/appointments/book` | Book new appointment |
| `GET` | `/api/appointments/:id` | Get appointment details |
| `PUT` | `/api/appointments/:id` | Update appointment |
| `DELETE` | `/api/appointments/:id` | Cancel appointment |

### Reception Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/receptiondashboard` | Get reception dashboard |
| `POST` | `/api/receptiondashboard/checkin` | Patient check-in |

## 🚀 Deployment

This application is deployed on **Vercel** with a **free tier** hosting plan:

### Live Demo
🌐 **[https://hospital-management-system-ruby-eight.vercel.app](https://hospital-management-system-ruby-eight.vercel.app/)**

### Deployment Architecture

- **Frontend & Backend**: Deployed on [Vercel](https://vercel.com/) as a Next.js application
- **Server-Side Rendering**: Most pages use SSR for optimal performance and SEO
- **Database**: PostgreSQL hosted on [Supabase](https://supabase.com/) (Free Tier)
- **Real-time Updates**: [Pusher](https://pusher.com/) for live notifications

### Performance Considerations

⚠️ **Note on Free Tier Performance**: The application uses **server-side rendering extensively** to demonstrate modern server-side development patterns and best practices. This architectural choice, combined with Vercel's free tier, may result in slightly slower initial page loads during peak usage. This is intentional to showcase:

- Server-side data fetching patterns
- Server Actions for form submissions
- Optimized rendering strategies
- Real-world performance trade-offs

For production deployment with consistent performance, consider upgrading to Vercel Pro or using a dedicated database instance.

### Deployment Setup

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository
2. **Connect to Vercel**: 
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Select your GitHub repository
3. **Set Environment Variables**:
   - Add `DATABASE_URL`, `JWT_SECRET`, and other required variables in Vercel project settings
4. **Deploy**: Click "Deploy" - Vercel will automatically build and deploy your application
5. **Database**: Setup Supabase PostgreSQL connection string in environment variables

## 📊 System Highlights

- **Server-Side Rendering**: Optimized performance with Next.js 13+ Server Components
- **Real-time Notifications**: Live updates using Pusher integration
- **Multi-Role System**: Comprehensive RBAC for different user types
- **Form Validation**: Both client and server-side validation with Zod
- **Responsive Design**: Mobile-first approach with Tailwind CSS v4
- **Dark Mode**: System-wide theme support with persistence
- **Security**: JWT authentication with bcrypt password hashing
- **Modern Architecture**: Next.js App Router with Server Actions
- **Calendar Integration**: React Calendar for appointment scheduling
- **Search Functionality**: Advanced search with typeahead autocomplete

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes and Server Actions
- ✅ Input validation with Zod
- ✅ Secure session management
- ✅ Environment variables for sensitive data
- ✅ CORS and security headers configuration

## 📦 Environment Variables

### .env.local (Development)

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/hospital_management_db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-here"

# Application
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Real-time Updates (Pusher)
PUSHER_APP_ID="your-pusher-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="mt1"
PUSHER_SECRET="your-pusher-secret"

# Image Upload (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

### .env.production (Deployment)

```env
# Use Supabase PostgreSQL connection string
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Same as development but with production values
JWT_SECRET="your-production-jwt-secret"
NEXT_PUBLIC_API_URL="https://hospital-management-system-ruby-eight.vercel.app"

# Pusher production configuration
PUSHER_APP_ID="your-production-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-production-key"
NEXT_PUBLIC_PUSHER_CLUSTER="mt1"
PUSHER_SECRET="your-production-secret"

# Cloudinary production configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

## 🧪 Testing

1. **Setup**: Follow the installation steps above
2. **Run Development Server**: `npm run dev`
3. **Access Application**: Open `http://localhost:3000`
4. **Login**: Use demo credentials provided above
5. **Test Features**:
   - Admin dashboard and management
   - Doctor profile and availability
   - Appointment booking and management
   - Patient profile management
   - Real-time updates

## 📝 License

This project is open source.

## 👨‍💻 Author

Built as a professional full-stack healthcare management application demonstrating modern web development practices with Next.js 16, server-side rendering, and comprehensive full-stack architecture.

---

<div align="center">

**Built⚙️ with Next.js 16 & Server-Side Rendering**

⭐ Star this repo if you find it helpful!

**[🌐 Live Demo](https://hospital-management-system-ruby-eight.vercel.app/) | [📚 GitHub](https://github.com/woafi/hospital-management-system)**

</div>
