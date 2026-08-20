const reportService = require("../services/adminReportService");

const getAdminReports = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "from and to dates are required",
      });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (Number.isNaN(fromDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid from date",
      });
    }

    if (Number.isNaN(toDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid to date",
      });
    }

    if (fromDate > toDate) {
      return res.status(400).json({
        success: false,
        message: "from date cannot be greater than to date",
      });
    }

    const reports = await reportService.getAdminReports({
      from,
      to,
    });

    return res.status(200).json({
      success: true,
      result: reports,
    });
  } catch (error) {
    console.error("Admin reports error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to generate reports",
    });
  }
};

module.exports = {
  getAdminReports,
};
