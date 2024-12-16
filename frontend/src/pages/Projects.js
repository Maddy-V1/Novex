import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, TextField, Chip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_URL, axiosConfig } from '../config';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubLink: '',
    linkedinLink: '',
    tags: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = axiosConfig(token);

      const projectData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim())
      };

      await axios.post(`${API_URL}/projects`, projectData, config);
      setFormData({
        title: '',
        description: '',
        githubLink: '',
        linkedinLink: '',
        tags: ''
      });
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        {user && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Project'}
          </Button>
        )}
      </Box>

      {showForm && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Create New Project
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
                label="GitHub Link"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="LinkedIn Link"
                name="linkedinLink"
                value={formData.linkedinLink}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                margin="normal"
                helperText="Enter tags separated by commas"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Create Project
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={4}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} key={project._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {project.title}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {project.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {project.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Posted by: {project.author.name}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {project.githubLink && (
                    <Button
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      GitHub
                    </Button>
                  )}
                  {project.linkedinLink && (
                    <Button
                      href={project.linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      LinkedIn
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Projects; 