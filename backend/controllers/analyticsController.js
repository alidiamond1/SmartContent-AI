import Blog from '../models/Blog.js';
import SocialPost from '../models/SocialPost.js';
import Email from '../models/Email.js';
import User from '../models/User.js';

// @desc    Get high-level analytics overview for the current user
// @route   GET /api/analytics/overview
// @access  Private
export const getOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    const [blogCount, socialCount, emailCount, user] = await Promise.all([
      Blog.countDocuments({ user: userId }),
      SocialPost.countDocuments({ user: userId }),
      Email.countDocuments({ user: userId }),
      User.findById(userId),
    ]);

    const lastBlog = await Blog.findOne({ user: userId }).sort({ createdAt: -1 }).select('createdAt');
    const lastSocial = await SocialPost.findOne({ user: userId }).sort({ createdAt: -1 }).select('createdAt');
    const lastEmail = await Email.findOne({ user: userId }).sort({ createdAt: -1 }).select('createdAt');

    const lastActivityDate = [lastBlog?.createdAt, lastSocial?.createdAt, lastEmail?.createdAt]
      .filter(Boolean)
      .sort((a, b) => b - a)[0] || null;

    return res.status(200).json({
      success: true,
      totals: {
        blogs: blogCount,
        socialPosts: socialCount,
        emails: emailCount,
        totalContent: blogCount + socialCount + emailCount,
      },
      credits: {
        remaining: user?.credits ?? 0,
        used: user?.totalCreditsUsed ?? 0,
      },
      lastActivityDate,
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching analytics overview',
      error: error.message,
    });
  }
};

// Build daily series for the last N days
export const getActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days, 10) || 30;

    const now = new Date();
    const from = new Date();
    from.setDate(now.getDate() - (days - 1));

    const matchStage = {
      $match: {
        user: userId,
        createdAt: { $gte: from },
      },
    };

    const groupStage = {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    };

    const sortStage = {
      $sort: { _id: 1 },
    };

    const [blogStats, socialStats, emailStats] = await Promise.all([
      Blog.aggregate([matchStage, groupStage, sortStage]),
      SocialPost.aggregate([matchStage, groupStage, sortStage]),
      Email.aggregate([matchStage, groupStage, sortStage]),
    ]);

    const toMap = (arr) => {
      const map = {};
      arr.forEach((item) => {
        map[item._id] = item.count;
      });
      return map;
    };

    const blogMap = toMap(blogStats);
    const socialMap = toMap(socialStats);
    const emailMap = toMap(emailStats);

    const daily = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(from);
      d.setDate(from.getDate() + i);
      const key = d.toISOString().slice(0, 10);

      daily.push({
        date: key,
        blogs: blogMap[key] || 0,
        socialPosts: socialMap[key] || 0,
        emails: emailMap[key] || 0,
      });
    }

    return res.status(200).json({
      success: true,
      range: {
        from,
        to: now,
        days,
      },
      daily,
    });
  } catch (error) {
    console.error('Analytics activity error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching analytics activity',
      error: error.message,
    });
  }
};
