const StructureMySqlRepository = require('../repositories/StructureMySqlRepository');

class StructureService {
  constructor() {
    this.repository = new StructureMySqlRepository();
  }

  /**
   * List structures as full paths (e.g., "Electrónica/Computadoras/Laptops")
   * Only returns leaf nodes (structures without children)
   * @param {Object} params
   * @param {number} params.page - Page number (1-based)
   * @param {number} params.size - Page size
   * @param {Object} params.filter - Filter options
   * @param {string} [params.filter.name] - Filter by path (LIKE %name%)
   * @returns {Promise<{data: Array<string>, total: number, page: number, size: number}>}
   */
  async listStructures({ page = 1, size = 10, filter = {} } = {}) {
    return this.repository.findPaths({ page, size, filter });
  }
}

module.exports = StructureService;

