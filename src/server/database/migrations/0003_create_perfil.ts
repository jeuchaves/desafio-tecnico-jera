import type { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
    return knex.schema
        .createTable(ETableNames.perfil, (table) => {
            table.bigIncrements('id').primary().index();
            table.string('nome').notNullable();
            table
                .bigInteger('usuarioId')
                .index()
                .notNullable()
                .references('id')
                .inTable(ETableNames.usuario)
                .onUpdate('CASCADE')
                .onDelete('RESTRICT');
            table.comment('Tabela usada para armazenar perfis do sistema');
        })
        .then(() => {
            console.log(`# Created table ${ETableNames.perfil}`);
        });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(ETableNames.perfil).then(() => {
        console.log(`# Dropped table ${ETableNames.perfil}`);
    });
}
