import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  AppBar,
  Toolbar,
  Paper,
} from '@mui/material'
import {
  Hotel,
  Users,
  Target,
  Award,
  TrendingUp,
  Globe,
  Shield,
  Clock,
  ArrowLeft,
} from 'lucide-react'

const About = () => {
  const { t } = useTranslation()

  const stats = [
    { number: '500+', label: 'Hotels Managed', icon: Hotel },
    { number: '50K+', label: 'Happy Guests', icon: Users },
    { number: '99.9%', label: 'Uptime', icon: TrendingUp },
    { number: '24/7', label: 'Support', icon: Clock },
  ]

  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'We continuously innovate to provide cutting-edge solutions that meet evolving industry needs.'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Your data security is our priority with enterprise-grade protection and compliance standards.'
    },
    {
      icon: Users,
      title: 'Customer Success',
      description: 'We measure our success by your success, providing dedicated support every step of the way.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Supporting hotels worldwide with multi-language capabilities and local compliance.'
    }
  ]

  const team = [
    {
      name: 'Alex Rodriguez',
      role: 'CEO & Founder',
      bio: '15+ years in hospitality technology',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      name: 'Sarah Kim',
      role: 'CTO',
      bio: 'Former hotel operations manager turned tech leader',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      name: 'David Thompson',
      role: 'Head of Product',
      bio: 'Hospitality industry veteran with passion for innovation',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ]

  return (
    <Box>
      {/* Navigation */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'grey.900' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Hotel size={32} color="#3b82f6" />
              <Typography variant="h6" sx={{ 
                ml: 1, 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Hotel Management System
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                component={Link}
                to="/"
                startIcon={<ArrowLeft size={20} />}
                sx={{ textTransform: 'none', color: 'grey.700' }}
              >
                Back to Home
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ textTransform: 'none' }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                sx={{ textTransform: 'none' }}
              >
                Get Started
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 12,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
              About Our Platform
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              We're revolutionizing hotel management with innovative technology 
              that empowers hospitality professionals worldwide.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', py: 3 }}>
                <CardContent>
                  <stat.icon size={32} color="#3b82f6" style={{ marginBottom: 16 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Us Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                About Us
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                Founded in 2020 by hospitality industry veterans, our mission is to simplify 
                hotel operations through innovative technology. We understand the unique challenges 
                faced by hotel professionals because we've been there ourselves.
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                Our platform was born from the frustration of using multiple disconnected systems 
                to manage hotel operations. We envisioned a single, comprehensive solution that 
                would handle everything from reservations to revenue management.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                Today, we're proud to serve hotels of all sizes, from boutique properties to 
                large chains, helping them deliver exceptional guest experiences while 
                optimizing their operations.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <img
                src="https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Hotel Team"
                style={{
                  width: '100%',
                  borderRadius: 16,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* About the App Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            About the Application
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Our Hotel Management System is a comprehensive platform designed to handle 
            every aspect of hotel operations with efficiency and precision.
          </Typography>
        </Box>

        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Core Features
              </Typography>
              <Box sx={{ space: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • <strong>Reservation Management:</strong> Complete booking system with real-time availability
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • <strong>Guest Profiles:</strong> Comprehensive customer relationship management
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • <strong>Room Management:</strong> Inventory tracking with maintenance scheduling
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • <strong>Billing & Invoicing:</strong> Automated invoice generation and payment processing
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • <strong>Food Service:</strong> Restaurant and room service order management
                </Typography>
                <Typography variant="body1">
                  • <strong>Analytics:</strong> Detailed reporting and business intelligence
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Technical Excellence
              </Typography>
              <Box sx={{ space: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • <strong>Cloud-Based:</strong> Access from anywhere with reliable uptime
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • <strong>Mobile Responsive:</strong> Works seamlessly on all devices
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • <strong>Multi-Language:</strong> Support for English and French
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • <strong>Role-Based Access:</strong> Granular permission management
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  • <strong>Real-Time Updates:</strong> Live synchronization across all users
                </Typography>
                <Typography variant="body1">
                  • <strong>Data Security:</strong> Enterprise-grade encryption and backup
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Our Values Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
              Our Values
            </Typography>
            <Typography variant="h6" color="text.secondary">
              The principles that guide everything we do
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <value.icon size={32} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Meet Our Team
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Experienced professionals dedicated to your success
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ textAlign: 'center' }}>
                <CardContent sx={{ p: 4 }}>
                  <Avatar
                    src={member.avatar}
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 3 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary.main" sx={{ mb: 2 }}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8,
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Ready to Transform Your Hotel?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join the growing community of hotel professionals who trust our platform.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Start Free Trial
            </Button>
            <Button
              component={Link}
              to="/"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Hotel size={24} color="#3b82f6" />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
                Hotel MS
              </Typography>
            </Box>
            <Typography variant="body2" color="grey.400">
              © 2024 Hotel Management System. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default About