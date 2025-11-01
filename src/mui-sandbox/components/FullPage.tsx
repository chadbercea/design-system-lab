import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

/**
 * Full Page Layout Component
 *
 * A comprehensive dashboard layout showcasing various MUI components.
 * This serves as a canvas for theme experimentation.
 */
export const FullPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your projects today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DashboardIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="overline" color="text.secondary">
                    Total Projects
                  </Typography>
                </Box>
                <Typography variant="h4">24</Typography>
                <Chip label="+12% from last month" size="small" color="success" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="overline" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
                <Typography variant="h4">1,483</Typography>
                <Chip label="+5.2% from last week" size="small" color="success" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="overline" color="text.secondary">
                    Team Members
                  </Typography>
                </Box>
                <Typography variant="h4">87</Typography>
                <Chip label="+3 this month" size="small" color="info" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssessmentIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="overline" color="text.secondary">
                    Tasks Complete
                  </Typography>
                </Box>
                <Typography variant="h4">342</Typography>
                <Chip label="+18% from last week" size="small" color="success" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Recent Activity Card */}
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Recent Activity" />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { title: 'New design uploaded', time: '2 hours ago', status: 'success' },
                    { title: 'Team meeting scheduled', time: '4 hours ago', status: 'info' },
                    { title: 'Project milestone reached', time: '1 day ago', status: 'warning' },
                    { title: 'Code review completed', time: '2 days ago', status: 'default' },
                  ].map((activity, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={activity.status}
                        color={activity.status as any}
                        size="small"
                        sx={{ minWidth: 80 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1">{activity.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader title="Quick Actions" />
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="contained" color="primary">
                    Create Project
                  </Button>
                  <Button variant="contained" color="secondary">
                    Invite Team
                  </Button>
                  <Button variant="outlined" color="primary">
                    View Reports
                  </Button>
                  <Button variant="outlined" color="secondary">
                    Settings
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Form Card */}
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Send Message" />
              <CardContent>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    fullWidth
                  />
                  <TextField
                    label="Message"
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                  />
                  <Button variant="contained" color="primary" fullWidth>
                    Send
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                Pro Tip
              </Typography>
              <Typography variant="body2">
                Use the theme controls in Storybook to customize colors, spacing, typography, and more.
                Export your changes as JSON when you're done!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 Design System Lab. Theme Customizer Sandbox.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
