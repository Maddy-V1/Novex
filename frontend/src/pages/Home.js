import { Container, Typography, Button, Grid, Box, Card, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Container>
      {/* Hero Section */}
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Connect, Collaborate, Innovate
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Join TechConnect - The platform for college students and professors to share projects,
          stay updated with tech news, and build meaningful connections.
        </Typography>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Share Projects
              </Typography>
              <Typography color="text.secondary">
                Showcase your work, get feedback, and collaborate with peers.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Tech News
              </Typography>
              <Typography color="text.secondary">
                Stay updated with the latest in technology and innovation.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Connect
              </Typography>
              <Typography color="text.secondary">
                Build your network with like-minded students and professors.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home; 