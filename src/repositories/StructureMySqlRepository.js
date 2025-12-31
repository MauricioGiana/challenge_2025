const db = require('../config/database');

class StructureMySqlRepository {
  constructor() {
    this.tableName = 'structures';
  }

  /**
   * Get a structure by ID with all descendants (max 10 levels)
   * @param {string} id - UUID of the structure
   * @returns {Promise<Object|null>}
   */
  async getByIdWithDescendants(id) {
    const query = `
      WITH RECURSIVE structure_tree AS (
        SELECT id, name, fk_parent_id, created_at, updated_at, 1 AS level
        FROM ${this.tableName}
        WHERE id = ?
        
        UNION ALL
        
        SELECT s.id, s.name, s.fk_parent_id, s.created_at, s.updated_at, st.level + 1
        FROM ${this.tableName} s
        INNER JOIN structure_tree st ON s.fk_parent_id = st.id
        WHERE st.level < 10
      )
      SELECT * FROM structure_tree ORDER BY level, name
    `;

    const [rows] = await db.raw(query, [id]);

    if (rows.length === 0) {
      return null;
    }

    return this.#buildTree(rows);
  }

  /**
   * Find structures as paths with pagination and filtering
   * @param {Object} params
   * @param {number} params.page - Page number (1-based)
   * @param {number} params.size - Page size
   * @param {Object} params.filter - Filter options
   * @param {string} [params.filter.name] - Filter by name (LIKE %name%)
   * @returns {Promise<{data: Array<string>, total: number, page: number, size: number}>}
   */
  async findPaths({ page = 1, size = 10, filter = {} }) {
    const params = [];

    let havingClause = '';
    if (filter.name) {
      havingClause = 'HAVING path LIKE ?';
      params.push(`%${filter.name}%`);
    }

    const baseQuery = `
      WITH RECURSIVE structure_paths AS (
        SELECT id, name, fk_parent_id, CAST(name AS CHAR(1000)) AS path
        FROM ${this.tableName}
        WHERE fk_parent_id IS NULL

        UNION ALL

        SELECT s.id, s.name, s.fk_parent_id, CONCAT(sp.path, '/', s.name)
        FROM ${this.tableName} s
        INNER JOIN structure_paths sp ON s.fk_parent_id = sp.id
      )
      SELECT id, path FROM structure_paths
      WHERE id NOT IN (SELECT DISTINCT fk_parent_id FROM ${this.tableName} WHERE fk_parent_id IS NOT NULL)
      ${havingClause}
      ORDER BY path
    `;

    const countQuery = `SELECT COUNT(*) as total FROM (${baseQuery}) as paths`;
    const dataQuery = `${baseQuery} LIMIT ? OFFSET ?`;

    const offset = (page - 1) * size;

    const [countResult, dataResult] = await Promise.all([
      db.raw(countQuery, params),
      db.raw(dataQuery, [...params, size, offset]),
    ]);

    return {
      data: dataResult[0].map((row) => row.path),
      total: countResult[0][0].total,
      page,
      size,
    };
  }

  /**
   * Build hierarchical tree from flat array
   * @param {Array} items - Flat array of structures with level
   * @returns {Object} - Root structure with nested subcategories
   */
  #buildTree(items) {
    const map = new Map();

    items.forEach((item) => {
      map.set(item.id, { ...item, subcategories: [] });
    });

    let root = null;

    items.forEach((item) => {
      const node = map.get(item.id);
      if (item.fk_parent_id && map.has(item.fk_parent_id)) {
        map.get(item.fk_parent_id).subcategories.push(node);
      } else {
        root = node;
      }
    });

    return root;
  }
}

module.exports = StructureMySqlRepository;
