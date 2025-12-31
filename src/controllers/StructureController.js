const StructureService = require('../services/StructureService');

class StructureController {
  constructor() {
    this.service = new StructureService();
  }

  /**
   * List structures as paths
   * GET /structures/paths
   */
  listPaths = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;
      const filter = {};

      if (req.query.name) {
        filter.name = req.query.name;
      }

      const result = await this.service.listStructures({ page, size, filter });
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  /**
   * Get structure by ID with descendants
   * GET /structures/:id/tree
   */
  getTree = async (req, res) => {
    try {
      const structure = await this.service.getTree(req.params.id);
      if (!structure) {
        return res
          .status(404)
          .json({ success: false, error: 'Structure not found' });
      }
      res.json({ success: true, data: structure });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}

module.exports = StructureController;
