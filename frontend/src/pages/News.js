import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, TextField, MenuItem } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';

const categories = [
  'AI',
  'Web Development',
  'Cybersecurity',
  'Data Science',
  'General Tech'
];

function News() {
  const [news, setNews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    externalLink: '',
    category: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${API_URL}/news`);
      setNews(res.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.post(`${API_URL}/news`, formData, config);
      setFormData({
        title: '',
        description: '',
        externalLink: '',
        category: ''
      });
      setShowForm(false);
      fetchNews();
    } catch (error) {
      console.error('Error creating news:', error);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Tech News
        </Typography>
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add News'}
          </Button>
        )}
      </Box>

      {showForm && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Create News Article
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
                required
              />
              <TextField
                fullWidth
                label="External Link"
                name="externalLink"
                value={formData.externalLink}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                select
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                margin="normal"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Create News Article
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={4}>
        {news.map((article) => (
          <Grid item xs={12} md={6} key={article._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {article.title}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {article.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="primary">
                    Category: {article.category}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Posted by: {article.author.name}
                </Typography>
                {article.externalLink && (
                  <Button
                    href={article.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{ mt: 2 }}
                  >
                    Read More
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default News; 