import { test, expect, describe, it, beforeAll, afterAll } from "vitest";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import postgres from "postgres";

describe("testcontainers", () => {
  let pg: StartedPostgreSqlContainer;

  beforeAll(async () => {
    pg = await new PostgreSqlContainer().start();
  });

  afterAll(async () => {
    await pg.stop();
  });

  it("postgres works!", async () => {
    const sql = postgres(pg.getConnectionUri());

    await sql`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(50)
      );
    `;

    await sql`
      INSERT INTO users (first_name, last_name, email)
      VALUES ('chuck', 'noris', 'chucknoris@example.com');
    `;

    const rows = await sql`SELECT * FROM users;`;

    expect(rows).toHaveLength(1);
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          first_name: "chuck",
          last_name: "noris",
          email: "chucknoris@example.com",
        }),
      ]),
    );
  });
});
