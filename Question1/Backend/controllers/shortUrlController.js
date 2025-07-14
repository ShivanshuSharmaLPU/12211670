const Url = require('../models/Url');
const generateShortCode = require('../utils/generateShortCode');
const geoip = require('geoip-lite');

exports.createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    const expiry = new Date(Date.now() + validity * 60 * 1000);
    let code = shortcode || generateShortCode();

    // Check uniqueness
    const exists = await Url.findOne({ shortCode: code });
    if (exists) return res.status(400).json({ error: 'Shortcode already taken' });

    const newUrl = await Url.create({
      originalUrl: url,
      shortCode: code,
      expiry
    });

    return res.status(201).json({
      shortLink: `http://localhost:8000/${code}`,
      expiry: expiry.toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.redirectUrl = async (req, res) => {
  const code = req.params.code;

  try {
    const data = await Url.findOne({ shortCode: code });
    if (!data) return res.status(404).json({ error: 'Shortcode not found' });

    if (new Date() > data.expiry) return res.status(410).json({ error: 'Shortcode expired' });

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    const referrer = req.get('Referrer') || 'direct';

    data.clicks.push({
      referrer,
      location: geo?.city || 'Unknown'
    });
    await data.save();

    return res.redirect(data.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Error redirecting' });
  }
};

exports.getStats = async (req, res) => {
  const code = req.params.code;

  try {
    const data = await Url.findOne({ shortCode: code });
    if (!data) return res.status(404).json({ error: 'Shortcode not found' });

    return res.json({
      originalUrl: data.originalUrl,
      createdAt: data.createdAt,
      expiry: data.expiry,
      totalClicks: data.clicks.length,
      clicks: data.clicks
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
};
