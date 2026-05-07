import Lead from '../models/Lead.js';

export const getStats = async (req, res) => {
  try {
    // Total leads for this user
    const totalLeads = await Lead.countDocuments({ owner: req.user._id });

    // Counts by status for this user
    const statusCounts = await Lead.aggregate([
      { $match: { owner: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format status counts into a cleaner object
    const statusMap = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      'Proposal Sent': 0,
      Won: 0,
      Lost: 0,
    };
    statusCounts.forEach((item) => {
      if (statusMap.hasOwnProperty(item._id)) {
        statusMap[item._id] = item.count;
      }
    });

    // Value calculations for this user
    const valueStats = await Lead.aggregate([
      { $match: { owner: req.user._id } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$value' },
          wonValue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Won'] }, '$value', 0],
            },
          },
        },
      },
    ]);

    const stats = {
      totalLeads,
      statusCounts: statusMap,
      totalValue: valueStats[0]?.totalValue || 0,
      wonValue: valueStats[0]?.wonValue || 0,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
