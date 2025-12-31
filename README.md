# GASPRE Backend API

Express.js API with MySQL for managing hierarchical structures.

## Requirements

- Docker & Docker Compose
- Node.js 20+ (for local development)

## Quick Start (Docker)

```bash
# 1. Clone the repository
git clone <repository-url>
cd gaspre_challenge

# 2. Create environment file
cp .env.example .env

# 3. Start services (MySQL + API)
docker compose up --build

# 4. Run seeders (in another terminal)
docker compose exec app npm run seed
```

The API will be available at `http://localhost:3000`

## Local Development (without Docker)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file and configure MySQL connection
cp .env.example .env

# 3. Run migrations
npm run migrate

# 4. Run seeders
npm run seed

# 5. Start development server
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL user | `gaspre_user` |
| `DB_PASSWORD` | MySQL password | `gaspre_password` |
| `DB_NAME` | MySQL database | `gaspre_db` |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with hot reload |
| `npm run migrate` | Run database migrations |
| `npm run migrate:rollback` | Rollback last migration |
| `npm run migrate:make <name>` | Create new migration |
| `npm run seed` | Run database seeders |
| `npm run seed:make <name>` | Create new seeder |

## API Endpoints

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-12-31T00:00:00.000Z"
}
```

### List Structure Paths

Returns all leaf structures as full paths (paginated).

```
GET /api/structures/paths
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `size` | number | 10 | Items per page |
| `name` | string | - | Filter by path (LIKE %name%) |

**Example:**
```bash
curl "http://localhost:3000/api/structures/paths?page=1&size=10"
```

**Response:**
```json
{
  "success": true,
  "data": [
    "Electrónica/Accesorios",
    "Electrónica/Celulares",
    "Electrónica/Computadoras/Desktops",
    "Electrónica/Computadoras/Laptops"
  ],
  "total": 4,
  "page": 1,
  "size": 10
}
```

**Filter Example:**
```bash
curl "http://localhost:3000/api/structures/paths?name=Computadoras"
```

**Response:**
```json
{
  "success": true,
  "data": [
    "Electrónica/Computadoras/Desktops",
    "Electrónica/Computadoras/Laptops"
  ],
  "total": 2,
  "page": 1,
  "size": 10
}
```

### Get Structure Tree

Returns a structure with all its descendants (max 10 levels).

```
GET /api/structures/:id/tree
```

**Example:**
```bash
curl "http://localhost:3000/api/structures/<uuid>/tree"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Electrónica",
    "fk_parent_id": null,
    "level": 1,
    "subcategories": [
      {
        "id": "uuid",
        "name": "Computadoras",
        "level": 2,
        "subcategories": [
          {
            "id": "uuid",
            "name": "Laptops",
            "level": 3,
            "subcategories": []
          },
          {
            "id": "uuid",
            "name": "Desktops",
            "level": 3,
            "subcategories": []
          }
        ]
      },
      {
        "id": "uuid",
        "name": "Celulares",
        "level": 2,
        "subcategories": []
      }
    ]
  }
}
```

## Database Schema

### structures

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | VARCHAR(255) | Structure name (indexed) |
| `fk_parent_id` | UUID | Foreign key to parent structure |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Project Structure

```
src/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   └── StructureController.js
├── database/
│   ├── migrations/          # Knex migrations
│   └── seeds/               # Knex seeders
├── repositories/
│   └── StructureMySqlRepository.js
├── routes/
│   ├── index.js
│   └── structures.js
├── services/
│   └── StructureService.js
└── index.js                 # App entry point
```

## Docker Services

| Service | Port | Description |
|---------|------|-------------|
| `app` | 3000 | Express.js API |
| `mysql` | 3306 | MySQL 8.0 database |

## License

ISC

