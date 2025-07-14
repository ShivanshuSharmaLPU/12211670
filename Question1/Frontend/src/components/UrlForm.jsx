import { useState } from 'react';
import axios from 'axios';
import {
  Container, Grid, TextField, Button, Typography, Card,
  CardContent, Box, Divider, Alert
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import AddLinkIcon from '@mui/icons-material/AddLink';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function UrlForm() {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const addField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const handleSubmit = async () => {
    const responses = [];

    for (let u of urls) {
      if (!u.url.trim()) continue;

      try {
        const res = await axios.post('http://localhost:8000/shorturls', {
          url: u.url,
          validity: u.validity ? parseInt(u.validity) : undefined,
          shortcode: u.shortcode || undefined
        });

        responses.push({
          original: u.url,
          shortLink: res.data.shortLink,
          expiry: res.data.expiry
        });
      } catch (err) {
        responses.push({
          original: u.url,
          error: err.response?.data?.error || 'Something went wrong'
        });
      }
    }

    setResults(responses);
  };

  return (
    <Container maxWidth="md" sx={{ pt: 5 }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        <LinkIcon sx={{ mb: '-6px', mr: '6px' }} />
        Shorten URLs
      </Typography>

      {urls.map((u, i) => (
        <Card
          key={i}
          variant="outlined"
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: '#f5faff',
            borderColor: '#90caf9',
            borderRadius: 2
          }}
        >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Long URL"
                  variant="outlined"
                  fullWidth
                  value={u.url}
                  onChange={(e) => handleChange(i, 'url', e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Validity (min)"
                  type="number"
                  fullWidth
                  value={u.validity}
                  onChange={(e) => handleChange(i, 'validity', e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Custom Shortcode"
                  fullWidth
                  value={u.shortcode}
                  onChange={(e) => handleChange(i, 'shortcode', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Box display="flex" gap={2} justifyContent="center" mb={4}>
        <Button variant="outlined" onClick={addField} disabled={urls.length >= 5}>
          + Add More
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} startIcon={<AddLinkIcon />}>
          Shorten URLs
        </Button>
      </Box>

      {results.length > 0 && (
        <Box>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h5" color="secondary" mb={2}>
            <CheckCircleIcon sx={{ mb: '-5px', mr: 1 }} />
            Results
          </Typography>

          {results.map((r, idx) => (
            <Card
              key={idx}
              sx={{
                mb: 2,
                backgroundColor: r.error ? '#ffebee' : '#e3f2fd',
                borderRadius: 2,
                p: 2
              }}
            >
              <CardContent>
                <Typography variant="body1"><strong>Original:</strong> {r.original}</Typography>
                {r.shortLink ? (
                  <>
                    <Typography variant="body1" mt={1}>
                      <strong>Short Link:</strong>{' '}
                      <a
                        href={r.shortLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1976d2' }}
                      >
                        {r.shortLink}
                      </a>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Expires At:</strong> {new Date(r.expiry).toLocaleString()}
                    </Typography>
                  </>
                ) : (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Error: {r.error}
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}
