import { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, Tabs, Tab, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState(0);
  const [userProjects, setUserProjects] = useState([]);
  const [savedNews, setSavedNews] = useState([]);
  const { user } = useAuth();

  const fetchUserProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.get(`${API_URL}/projects/user/${user._id}`, config);
      setUserProjects(res.data);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  }, [user?._id]);

  const fetchSavedNews = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.get(`${API_URL}/news/saved`, config);
      setSavedNews(res.data);
    } catch (error) {
      console.error('Error fetching saved news:', error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserProjects();
      fetchSavedNews();
    }
  }, [user, fetchUserProjects, fetchSavedNews]);

  const handleDeleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`${API_URL}/projects/${projectId}`, config);
      fetchUserProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleUnsaveNews = async (newsId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.put(`${API_URL}/news/${newsId}/save`, {}, config);
      fetchSavedNews();
    } catch (error) {
      console.error('Error unsaving news:', error);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">
              <strong>Name:</strong> {user.name}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Email:</strong> {user.email}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">
              <strong>College:</strong> {user.college || 'Not specified'}
            </Typography>
            {user.githubUsername && (
              <Typography variant="subtitle1">
                <strong>GitHub:</strong>{' '}
                <a 
                  href={`https://github.com/${user.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.githubUsername}
                </a>
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="My Projects" />
          <Tab label="Saved News" />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={0}>
        <Grid container spacing={4}>
          {userProjects.map((project) => (
            <Grid item xs={12} md={6} key={project._id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {project.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {project.description}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      href={`/projects/${project._id}/edit`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Grid container spacing={4}>
          {savedNews.map((article) => (
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
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    {article.externalLink && (
                      <Button
                        href={article.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                      >
                        Read More
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleUnsaveNews(article._id)}
                    >
                      Unsave
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Container>
  );
}

export default Dashboard; 