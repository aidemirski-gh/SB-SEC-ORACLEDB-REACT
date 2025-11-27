# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack CRM application with Spring Boot backend and React frontend. The frontend communicates with the backend via REST API.

**Tech Stack:**
- Backend: Spring Boot 4.0.0, Java 21
- Frontend: React 19, TypeScript, Vite, Tailwind CSS 4
- Database: Oracle (ojdbc11)
- Security: Spring Security
- Data: Spring Data JPA
- Validation: Bean Validation
- Build Tools: Maven (backend), npm (frontend)
- Utilities: Lombok, MapStruct 1.6.3

## Project Structure

```
SB-SEC-ORACLEDB-REACT/
├── backend/              # Spring Boot application (port 8080)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/dev/crm/
│   │   │   │   ├── CrmApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── CorsConfig.java          # CORS configuration
│   │   │   │   │   └── SecurityConfig.java      # Security configuration
│   │   │   │   ├── controller/
│   │   │   │   │   ├── HealthController.java    # Health check endpoints
│   │   │   │   │   └── CustomerController.java  # Customer CRUD endpoints
│   │   │   │   ├── dto/
│   │   │   │   │   ├── CustomerDTO.java         # Customer response DTO
│   │   │   │   │   ├── CustomerCreateDTO.java   # Customer creation DTO
│   │   │   │   │   └── CustomerUpdateDTO.java   # Customer update DTO
│   │   │   │   ├── entity/
│   │   │   │   │   └── Customer.java            # Customer JPA entity
│   │   │   │   ├── mapper/
│   │   │   │   │   └── CustomerMapper.java      # MapStruct mapper
│   │   │   │   ├── repository/
│   │   │   │   │   └── CustomerRepository.java  # Spring Data JPA repo
│   │   │   │   └── service/
│   │   │   │       └── CustomerService.java     # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   │       └── java/com/dev/crm/
│   │           └── CrmApplicationTests.java
│   ├── pom.xml
│   └── mvnw, mvnw.cmd   # Maven wrapper
└── frontend/            # React + Vite application (port 5173)
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── index.css        # Tailwind imports
    │   └── services/
    │       └── api.ts       # API service for backend communication
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts       # Includes proxy configuration
    ├── tailwind.config.js
    └── postcss.config.js
```

## Running the Application

### Full Stack Development

To run both frontend and backend together:

1. **Terminal 1 - Start Backend:**
```bash
cd backend
./mvnw spring-boot:run
```
Backend will run on http://localhost:8080

2. **Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173

The frontend is configured with a Vite proxy that forwards `/api` requests to the backend at `http://localhost:8080`.

## Development Commands

### Backend

All Maven commands should be run from the `backend/` directory.

**Build:**
```bash
cd backend
./mvnw clean install
```

**Run Application:**
```bash
cd backend
./mvnw spring-boot:run
```

**Run Tests:**
```bash
cd backend
./mvnw test
```

**Run Single Test:**
```bash
cd backend
./mvnw test -Dtest=ClassName#methodName
```

**Package:**
```bash
cd backend
./mvnw package
```

### Frontend

All npm commands should be run from the `frontend/` directory.

**Install Dependencies:**
```bash
cd frontend
npm install
```

**Run Development Server:**
```bash
cd frontend
npm run dev
```

**Build for Production:**
```bash
cd frontend
npm run build
```

**Preview Production Build:**
```bash
cd frontend
npm run preview
```

**Lint:**
```bash
cd frontend
npm run lint
```

## Architecture Notes

### Backend Architecture

The project follows standard Spring Boot layered architecture with MapStruct for entity-DTO conversions:

- **Application Layer**: Entry point (CrmApplication.java)
- **Configuration Layer**:
  - CorsConfig: CORS configuration allowing requests from http://localhost:5173
  - SecurityConfig: Spring Security configuration (currently permits all requests)
- **Controller Layer**: REST API endpoints
  - HealthController: Health check and info endpoints
  - CustomerController: Customer CRUD operations (demonstrates MapStruct usage)
- **Service Layer**: Business logic
  - CustomerService: Customer business logic with MapStruct integration
- **Repository Layer**: Data access (Spring Data JPA)
  - CustomerRepository: Customer database operations
- **Entity Layer**: JPA entities
  - Customer: Customer entity with validation and lifecycle hooks
- **DTO Layer**: Data transfer objects
  - CustomerDTO: Response DTO (full customer data)
  - CustomerCreateDTO: Creation DTO (no ID, timestamps)
  - CustomerUpdateDTO: Update DTO (partial updates allowed)
- **Mapper Layer**: MapStruct mappers
  - CustomerMapper: Entity-DTO conversions with custom mappings

### Frontend Architecture

- **Vite**: Fast build tool and dev server with HMR (Hot Module Replacement)
  - Configured with proxy to forward `/api/*` requests to backend
- **React 19**: UI component library
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Services Layer**:
  - api.ts: API service class for backend communication with TypeScript interfaces
- **Expected Structure** (to be implemented):
  - Components: Reusable UI components
  - Pages: Route-based page components
  - Types: TypeScript type definitions
  - Hooks: Custom React hooks
  - Utils: Utility functions

### API Communication

- **Backend Base URL**: http://localhost:8080
- **Frontend Dev Server**: http://localhost:5173
- **API Proxy**: Vite proxies `/api` requests to backend
- **CORS**: Configured to allow frontend origin
- **Available Endpoints**:
  - **Public** (no authentication required):
    - GET `/api/health` - Backend health check
    - GET `/api/info` - Application information
    - POST `/api/auth/login` - User login
    - POST `/api/auth/register` - User registration
  - **Protected** (JWT token required):
    - GET `/api/customers` - Get all customers
    - GET `/api/customers/{id}` - Get customer by ID
    - POST `/api/customers` - Create new customer
    - PUT `/api/customers/{id}` - Update customer (full)
    - PATCH `/api/customers/{id}` - Partial update customer
    - DELETE `/api/customers/{id}` - Delete customer

### JWT Authentication

**JWT (JSON Web Token)** is implemented for stateless authentication:

**Backend Components:**
- **JwtTokenProvider**: Generates and validates JWT tokens
  - Token expiration: 24 hours (configurable via `app.jwt.expiration`)
  - Secret key: Configured in `application.properties`
  - Uses JJWT 0.12.6 library with HS256 algorithm
- **JwtAuthenticationFilter**: Intercepts requests and validates JWT tokens
  - Extracts token from `Authorization: Bearer <token>` header
  - Sets authentication in SecurityContext
- **CustomUserDetailsService**: Loads user details from database
- **AuthService**: Handles login and registration logic
- **SecurityConfig**: Configures Spring Security with JWT
  - Stateless session management
  - Public endpoints: `/api/auth/**`, `/api/health`, `/api/info`
  - Protected endpoints: `/api/customers/**`
  - Password encoding with BCrypt

**Frontend Components:**
- **AuthContext**: React context for managing authentication state
- **API Service**: Automatically includes JWT token in request headers
- **Login/Register Pages**: User authentication UI
- **ProtectedRoute**: Route guard for authenticated-only pages
- **Token Storage**: JWT token stored in localStorage

**Authentication Flow:**
1. User submits login credentials
2. Backend validates credentials and generates JWT token
3. Frontend stores token in localStorage
4. Subsequent requests include token in Authorization header
5. Backend validates token on each request
6. On 401 response, user is redirected to login

**Configuration:**
```properties
app.jwt.secret=<your-secret-key>
app.jwt.expiration=86400000  # 24 hours in milliseconds
```

**Security Notes:**
- Passwords are hashed using BCrypt
- JWT secret should be changed in production
- Tokens expire after 24 hours
- CSRF protection disabled (stateless JWT approach)

### Database Configuration

- Oracle Database connectivity via ojdbc11 driver
- JPA/Hibernate for ORM
- Database connection properties should be configured in `application.properties`:
  ```properties
  spring.datasource.url=jdbc:oracle:thin:@localhost:1521:orcl
  spring.datasource.username=...
  spring.datasource.password=...
  spring.jpa.hibernate.ddl-auto=update
  ```

### MapStruct Integration

**MapStruct** is a compile-time code generator that simplifies entity-DTO conversions. It's integrated with Lombok via `lombok-mapstruct-binding`.

**Key Annotations:**
- `@Mapper(componentModel = "spring")` - Creates Spring bean
- `@Mapping(target = "...", ignore = true)` - Ignore specific fields
- `@MappingTarget` - Update existing entity in-place
- `NullValuePropertyMappingStrategy.IGNORE` - Skip null fields in updates

**Common Patterns:**
```java
// Entity to DTO
CustomerDTO dto = customerMapper.toDTO(customer);

// List conversion
List<CustomerDTO> dtos = customerMapper.toDTOList(customers);

// DTO to Entity (create)
Customer customer = customerMapper.toEntity(createDTO);

// Update existing entity
customerMapper.updateEntityFromDTO(updateDTO, existingCustomer);

// Partial update (null fields ignored)
customerMapper.partialUpdate(updateDTO, existingCustomer);
```

**Build Process:**
- MapStruct generates implementation classes at compile time
- Generated classes are in `target/generated-sources/annotations`
- Lombok processes annotations first, then MapStruct uses the generated code
- Both processors configured in `maven-compiler-plugin`

### Maven Configuration

- Java 21 target
- Lombok annotation processing configured in maven-compiler-plugin
- MapStruct annotation processing with Lombok binding
- Spring Boot Maven plugin configured to exclude Lombok from final JAR

## Key Dependencies

### Backend
- **spring-boot-starter-data-jpa**: Database operations
- **spring-boot-starter-security**: Authentication/authorization
- **spring-boot-starter-validation**: Bean validation
- **spring-boot-starter-webmvc**: REST API
- **ojdbc11**: Oracle JDBC driver
- **lombok**: Reduce boilerplate code (getters, setters, constructors)
- **mapstruct**: Entity-DTO mapping with compile-time code generation
- **lombok-mapstruct-binding**: Integration between Lombok and MapStruct
- **jjwt-api, jjwt-impl, jjwt-jackson**: JWT token generation and validation

### Frontend
- **react**: UI library
- **react-dom**: React DOM renderer
- **react-router-dom**: Client-side routing
- **vite**: Build tool and dev server
- **typescript**: Type system
- **tailwindcss**: Utility-first CSS
- **@vitejs/plugin-react**: Vite React plugin with Fast Refresh

## Testing

Test dependencies include:
- spring-boot-starter-data-jpa-test
- spring-boot-starter-security-test
- spring-boot-starter-validation-test
- spring-boot-starter-webmvc-test
