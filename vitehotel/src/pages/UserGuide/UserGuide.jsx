import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Grid,
  Paper,
  Chip,
} from '@mui/material'
import {
  HelpCircle,
  ChevronDown,
  BookOpen,
  Navigation,
  Settings,
  AlertTriangle,
  Phone,
  Play,
  Users,
  Hotel,
  Key,
  Calendar,
  FileText,
  UtensilsCrossed,
} from 'lucide-react'

const UserGuide = () => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState('getting-started')

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const guideSection = [
    {
      id: 'getting-started',
      title: t('user_guide.getting_started'),
      icon: Play,
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Welcome to the Hotel Management System! This guide will help you get started with managing your hotel operations efficiently.
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            First Steps:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Hotel size={20} /></ListItemIcon>
              <ListItemText primary="Set up your hotel properties" secondary="Add your hotels with basic information, location, and ownership details" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Key size={20} /></ListItemIcon>
              <ListItemText primary="Configure room categories and inventory" secondary="Define room types, pricing, and add individual rooms to your system" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Users size={20} /></ListItemIcon>
              <ListItemText primary="Invite team members" secondary="Add staff members with appropriate roles and permissions" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Calendar size={20} /></ListItemIcon>
              <ListItemText primary="Start managing bookings" secondary="Begin accepting reservations and managing guest stays" />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      id: 'navigation',
      title: t('user_guide.navigation'),
      icon: Navigation,
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            The system uses a sidebar navigation for easy access to all features. Here's what each section contains:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Core Management
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Dashboard" secondary="Overview and quick stats" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Hotels" secondary="Manage hotel properties" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Rooms" secondary="Room inventory and status" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Clients" secondary="Guest information" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Operations
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Stays" secondary="Booking management" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Invoices" secondary="Billing and payments" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Food Items" secondary="Restaurant menu" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Orders" secondary="Food service orders" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      id: 'features',
      title: t('user_guide.features'),
      icon: BookOpen,
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Explore the key features that make hotel management efficient:
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              🏨 Hotel Management
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • Multi-property support with individual ownership
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • Location-based organization (Country → Region → City → Zone)
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • Staff assignment and role management
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              🛏️ Room Operations
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • Real-time room availability tracking
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • Maintenance scheduling and status updates
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • Dynamic pricing with seasonal adjustments
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              💰 Financial Management
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • Automated invoice generation
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • Multiple payment method support
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • Comprehensive financial reporting
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      id: 'troubleshooting',
      title: t('user_guide.troubleshooting'),
      icon: AlertTriangle,
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Common issues and their solutions:
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Login Problems
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Verify your email address and password
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Use "Forgot Password" if needed
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Contact administrator if account is blocked
              </Typography>
              <Typography variant="body2">
                • Clear browser cache and cookies
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Booking Conflicts
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Check room availability calendar
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Verify dates are correct
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Look for maintenance schedules
              </Typography>
              <Typography variant="body2">
                • Consider alternative rooms
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Performance Issues
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Check internet connection speed
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Close unnecessary browser tabs
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Clear browser cache
              </Typography>
              <Typography variant="body2">
                • Try different browser
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )
    },
    {
      id: 'contact',
      title: t('user_guide.contact_support'),
      icon: Phone,
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Need additional help? Our support team is here to assist you.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Phone size={32} color="#3b82f6" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Phone Support
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Available during business hours
                </Typography>
                <Button variant="outlined" sx={{ textTransform: 'none' }}>
                  Call Support
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <HelpCircle size={32} color="#10b981" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Live Chat
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get instant help with urgent issues
                </Typography>
                <Button variant="outlined" sx={{ textTransform: 'none' }}>
                  Start Chat
                </Button>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Training Resources
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><Play size={20} /></ListItemIcon>
                <ListItemText primary="Video Tutorials" secondary="Step-by-step feature demonstrations" />
              </ListItem>
              <ListItem>
                <ListItemIcon><BookOpen size={20} /></ListItemIcon>
                <ListItemText primary="Documentation" secondary="Comprehensive guides and manuals" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Users size={20} /></ListItemIcon>
                <ListItemText primary="Training Sessions" secondary="Schedule personalized training" />
              </ListItem>
            </List>
          </Box>
        </Box>
      )
    }
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t('user_guide.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('user_guide.welcome_description')}
        </Typography>
      </Box>

      {/* Quick Start Card */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            {t('user_guide.welcome_title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            This comprehensive guide will help you navigate and use all features of the hotel management system effectively.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="Multi-language Support" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label="Role-based Access" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label="Real-time Updates" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label="Mobile Responsive" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          </Box>
        </CardContent>
      </Card>

      {/* Guide Sections */}
      <Card>
        <CardContent>
          {guideSection.map((section) => (
            <Accordion
              key={section.id}
              expanded={expanded === section.id}
              onChange={handleChange(section.id)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown />}
                sx={{ 
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <section.icon size={24} style={{ marginRight: 16 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {section.content}
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Quick Links
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Hotel size={20} />}
                onClick={() => window.open('/hotels', '_blank')}
                sx={{ textTransform: 'none', py: 2 }}
              >
                Manage Hotels
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Key size={20} />}
                onClick={() => window.open('/rooms', '_blank')}
                sx={{ textTransform: 'none', py: 2 }}
              >
                Room Management
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Calendar size={20} />}
                onClick={() => window.open('/stays', '_blank')}
                sx={{ textTransform: 'none', py: 2 }}
              >
                Booking System
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FileText size={20} />}
                onClick={() => window.open('/reports', '_blank')}
                sx={{ textTransform: 'none', py: 2 }}
              >
                View Reports
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserGuide