import type { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
    return knex.schema
        .createTable(ETableNames.watchlist, (table) => {
            table.bigIncrements('id').primary().index();
            table
                .bigInteger('perfilId')
                .index()
                .notNullable()
                .references('id')
                .inTable(ETableNames.perfil)
                .onUpdate('CASCADE')
                .onDelete('RESTRICT');
            table.bigInteger('filmeId').notNullable();
            table.boolean('assistido').defaultTo(false);
            table.unique(['perfilId', 'filmeId']);
            table.comment(
                'Tabela usada para armazenar filmes para assistir no sistema'
            );
        })
        .then(() => {
            console.log(`# Created table ${ETableNames.watchlist}`);
        });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(ETableNames.watchlist).then(() => {
        console.log(`# Dropped table ${ETableNames.watchlist}`);
    });
}
