import { mysqlTable, bigint, mediumtext, year, decimal, longtext } from "drizzle-orm/mysql-core";

export const game = mysqlTable("game", {
  appId: bigint("app_id", { mode: "bigint" }).primaryKey(),
  name: mediumtext("name").notNull(),
  releaseDate: year("release_date"),
  price: decimal("price", { precision: 9, scale: 2 }).notNull(),
  developers: longtext("developers").notNull(),
  log: longtext("log"),
});
