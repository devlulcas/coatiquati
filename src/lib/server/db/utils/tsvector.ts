import type { ColumnBuilderConfig, ColumnConfig } from 'drizzle-orm';
import {
	PgColumn,
	PgColumnBuilder,
	type AnyPgTable,
	type PgColumnBuilderHKT,
	type PgColumnHKT
} from 'drizzle-orm/pg-core';

type PgTSVectorBuilderConfig = {
	sources: string[] | undefined;
	weighted?: boolean;
	pg_catalog?: 'english' | 'portuguese';
};

export interface PgTSVectorConfig {
	sources?: PgTSVectorBuilderConfig['sources'];
	weighted?: PgTSVectorBuilderConfig['weighted'];
	pg_catalog?: PgTSVectorBuilderConfig['pg_catalog'];
}

function generateTsvectorColumn(input: string[], pg_catalog = 'english') {
	const columnExpressions = input.map((column, index) => {
		const weight = String.fromCharCode(index + 65);
		return `setweight(to_tsvector('${pg_catalog}', coalesce(${column}, '')), '${weight}')`;
	});

	const tsvectorColumn = `tsvector GENERATED ALWAYS AS (${columnExpressions.join(' || ')}) STORED`;

	return tsvectorColumn;
}

export class PgTSVectorBuilder<TData extends string = string> extends PgColumnBuilder<
	PgColumnBuilderHKT,
	ColumnBuilderConfig<{ data: TData; driverParam: string }>,
	PgTSVectorBuilderConfig
> {
	protected $pgColumnBuilderBrand = 'PgTSVectorBuilder';

	constructor(name: string, config: PgTSVectorConfig) {
		super(name);
		this.config.sources = config.sources;
		this.config.weighted = config.weighted;
		this.config.pg_catalog = config.pg_catalog;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTSVector<TTableName, TData> {
		const xyz = new PgTSVector(table, this.config);
		console.log(xyz);
		return xyz;
	}
}

export class PgTSVector<TTableName extends string, TData extends string> extends PgColumn<
	PgColumnHKT,
	ColumnConfig<{ tableName: TTableName; data: TData; driverParam: string }>,
	PgTSVectorBuilderConfig
> {
	constructor(table: AnyPgTable<{ name: TTableName }>, builder: PgTSVectorBuilder<TData>['config']) {
		super(table, builder);
	}

	getSQLType(): string {
		const catalog = this.config.pg_catalog === 'english' ? 'english' : 'pg_catalog.' + this.config.pg_catalog;

		return this.config.sources === undefined
			? `tsvector`
			: this.config.weighted
			? generateTsvectorColumn(this.config.sources, catalog)
			: `tsvector generated always as (to_tsvector('${catalog}', ${this.config.sources.join(" || ' ' || ")})) stored`;
	}
}

/**
 * Warning: This is a custom implementation of a tsvector column.
 * Warning: Essa é uma implementação customizada de uma coluna tsvector.
 * @see https://github.com/drizzle-team/drizzle-orm/issues/247
 * @see https://gist.github.com/tmcw/9f0327c74e914524eed997131b96e66e
 * @see https://orm.drizzle.team/docs/sql#sql-in-where
 * @see https://www.postgresql.org/docs/12/functions-textsearch.html
 */
export function tsvector<TName extends string>(name: string, config: PgTSVectorConfig = {}): PgTSVectorBuilder<TName> {
	return new PgTSVectorBuilder(name, config);
}
