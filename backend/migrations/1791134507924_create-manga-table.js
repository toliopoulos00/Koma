/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('manga', {
        id: 'id',
        title: {type: 'varchar(255)', notNull: true },
        author: { type: 'varchar(255)', notNull: true },
        status: { type: 'varchar(20)', notNull: true, default: 'plan_to_read' },
        publication_status: { type: 'varchar(20)', notNull: true, default: 'ongoing' },
        volumes_read: { type: 'integer', notNull: true, default: 0 },
        total_volumes: { type: 'integer' },
        genres: { type: 'text[]', notNull: true, default: '{}' },
        rating: { type: 'smallint' },
        cover_url: { type: 'text' },
        notes: { type: 'text' },
        created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
        updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    });

    pgm.addConstraint('manga', 'manga_status_check', {
    check: "status IN ('plan_to_read', 'reading', 'completed', 'on_hold', 'dropped')",
    });
    pgm.addConstraint('manga', 'manga_publication_status_check', {
      check: "publication_status IN ('ongoing', 'finished')",
    });
    pgm.addConstraint('manga', 'manga_volumes_check', {
      check: 'volumes_read >= 0 AND (total_volumes IS NULL OR (total_volumes > 0 AND volumes_read <= total_volumes))',
    });
    pgm.addConstraint('manga', 'manga_rating_check', {
      check: "rating IS NULL OR (status = 'completed' AND rating BETWEEN 1 AND 10)",
    });
    pgm.createIndex('manga', 'status');
    pgm.createIndex('manga', 'rating');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('manga');
};
