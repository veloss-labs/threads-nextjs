## 1. Run PostgreSQL Server with docker compose

```bash
docker-compose up -d
```

## 2. Run Bash

```bash
docker exec -it postgres bash
```

## 3. login as postgres

```bash
su - postgres
```

## 4. Run following statements

```sql
CREATE DATABASE sstNextApp ENCODING 'UTF8';
CREATE USER sstNextApp WITH ENCRYPTED PASSWORD 'sstnextapp';
GRANT ALL PRIVILEGES ON DATABASE sstNextApp to sstNextApp;
ALTER USER sstNextApp CREATEDB;
```
