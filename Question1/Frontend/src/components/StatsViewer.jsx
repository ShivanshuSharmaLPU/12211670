import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';

export default function StatsViewer() {
  const [code, setCode] = useState('');
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    const res = await axios.get(`http://localhost:8000/shorturls/${code}`);
    setStats(res.data);
  };

  return (
    <div>
      <Typography variant="h4">URL Stats</Typography>
      <TextField label="Shortcode" value={code} onChange={(e) => setCode(e.target.value)} />
      <Button onClick={fetchStats}>Get Stats</Button>

      {stats && (
        <div>
          <p>Original URL: {stats.originalUrl}</p>
          <p>Created At: {stats.createdAt}</p>
          <p>Expires At: {stats.expiry}</p>
          <p>Total Clicks: {stats.totalClicks}</p>
          {stats.clicks.map((click, i) => (
            <div key={i}>
              <p>{click.timestamp} | {click.referrer} | {click.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
