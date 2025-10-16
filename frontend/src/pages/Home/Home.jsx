import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  Rating,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Divider,
} from '@mui/material'
import {
  Hotel,
  Users,
  BarChart3,
  Shield,
  Star,
  Phone,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Languages,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import { contactAPI } from '../../services/api'
import { toast } from 'react-toastify'

const Home = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [contactLoading, setContactLoading] = useState(false)

  const features = [
    {
      icon: Hotel,
      title: 'Multi-Hotel Management',
      description: 'Manage multiple hotel properties from a single dashboard with comprehensive oversight.',
      color: '#3b82f6'
    },
    {
      icon: Users,
      title: 'Guest Management',
      description: 'Complete guest profiles, booking history, and personalized service tracking.',
      color: '#10b981'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Detailed insights into occupancy, revenue, and operational performance.',
      color: '#8b5cf6'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access control and data protection.',
      color: '#f59e0b'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Hotel Manager',
      hotel: 'Grand Palace Hotel',
      rating: 5,
      comment: 'This system has revolutionized our hotel operations. The booking management is seamless and the reporting features are incredibly detailed.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Michael Chen',
      role: 'Owner',
      hotel: 'Seaside Resort',
      rating: 5,
      comment: 'Outstanding platform! The multi-property management feature allows me to oversee all my hotels efficiently. Highly recommended.',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Emma Davis',
      role: 'Restaurant Manager',
      hotel: 'Mountain View Lodge',
      rating: 5,
      comment: 'The food service integration is perfect. We can track orders, manage inventory, and process payments all in one place.',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ]

  const whyChooseUs = [
    {
      title: 'Comprehensive Solution',
      description: 'All-in-one platform covering every aspect of hotel management from bookings to billing.'
    },
    {
      title: 'User-Friendly Interface',
      description: 'Intuitive design that requires minimal training for your staff to get started.'
    },
    {
      title: 'Scalable Architecture',
      description: 'Grows with your business, from single property to large hotel chains.'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support to ensure your operations never stop.'
    },
    {
      title: 'Mobile Responsive',
      description: 'Access your hotel management system from any device, anywhere.'
    },
    {
      title: 'Regular Updates',
      description: 'Continuous improvements and new features based on industry needs.'
    }
  ]

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng)
    setLanguageMenuAnchor(null)
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all fields')
      return
    }

    setContactLoading(true)
    try {
      await contactAPI.sendMessage(contactForm)
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setContactForm({ name: '', email: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setContactLoading(false)
    }
  }

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
                to="/about"
                sx={{ textTransform: 'none', color: 'grey.700' }}
              >
                About
              </Button>
              <Button
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                sx={{ textTransform: 'none', color: 'grey.700' }}
              >
                Contact
              </Button>
              
              <IconButton
                onClick={(e) => setLanguageMenuAnchor(e.currentTarget)}
                sx={{ color: 'grey.700' }}
              >
                <Languages size={20} />
              </IconButton>

              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ textTransform: 'none', mr: 1 }}
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

        {/* Language Menu */}
        <Menu
          anchorEl={languageMenuAnchor}
          open={Boolean(languageMenuAnchor)}
          onClose={() => setLanguageMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleLanguageChange('en')}>
            <Typography>English</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('fr')}>
            <Typography>Français</Typography>
          </MenuItem>
        </Menu>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 12,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
                Streamline Your Hotel Operations
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
                Complete hotel management solution with booking system, guest management, 
                billing, and comprehensive reporting - all in one powerful platform.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                >
                  Start Free Trial
                  <ArrowRight size={20} style={{ marginLeft: 8 }} />
                </Button>
                <Button
                  component={Link}
                  to="/about"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Hotel Management"
                  style={{
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 16,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Everything You Need to Manage Your Hotel
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Powerful features designed specifically for hotel operations, 
            from small boutique properties to large hotel chains.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${feature.color}20`,
                      color: feature.color,
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <feature.icon size={32} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why Choose Us Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
              Why Choose Our Platform?
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Built by hotel industry experts for hotel professionals
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {whyChooseUs.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box 
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CheckCircle size={24} color="#10b981" style={{ marginTop: 4, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            What Our Customers Say
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Trusted by hotel professionals worldwide
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role} at {testimonial.hotel}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "{testimonial.comment}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Section */}
      <Box id="contact" sx={{ bgcolor: 'grey.50', py: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                Get in Touch
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Ready to transform your hotel operations? Contact us today for a personalized demo.
              </Typography>

              <Box sx={{ space: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                    <Phone size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Phone Support
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +1 (555) 123-4567
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                    <Mail size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Email Support
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      support@hotelmanagement.com
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                    <MapPin size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Office Location
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      123 Business Ave, Suite 100<br />
                      New York, NY 10001
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Send us a Message
                  </Typography>
                  <form onSubmit={handleContactSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          label="Full Name"
                          fullWidth
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email Address"
                          type="email"
                          fullWidth
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Message"
                          multiline
                          rows={4}
                          fullWidth
                          value={contactForm.message}
                          onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          size="large"
                          disabled={contactLoading}
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          {contactLoading ? <CircularProgress size={24} /> : 'Send Message'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8,
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of hotel professionals who trust our platform for their daily operations.
          </Typography>
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
              px: 6,
              py: 2,
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Start Your Free Trial Today
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Hotel size={32} color="#3b82f6" />
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
                  Hotel MS
                </Typography>
              </Box>
              <Typography variant="body2" color="grey.400" sx={{ mb: 3 }}>
                The most comprehensive hotel management system designed to streamline 
                your operations and enhance guest satisfaction.
              </Typography>
              <Typography variant="body2" color="grey.400">
                © 2024 Hotel Management System. All rights reserved.
              </Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Product
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button component={Link} to="/about" sx={{ justifyContent: 'flex-start', color: 'grey.400', textTransform: 'none' }}>
                  Features
                </Button>
                <Button component={Link} to="/about" sx={{ justifyContent: 'flex-start', color: 'grey.400', textTransform: 'none' }}>
                  Pricing
                </Button>
                <Button component={Link} to="/about" sx={{ justifyContent: 'flex-start', color: 'grey.400', textTransform: 'none' }}>
                  Security
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button sx={{ justifyContent: 'flex-start', color: 'grey.400', textTransform: 'none' }}>
                  Help Center
                </Button>
                <Button sx={{ justifyContent: 'flex-start', color: 'grey.400', textTransform: 'none' }}>
                  Documentation
                </Button>
                <Button sx={{ justifyContent: 'flex-start', color: 'grey.400', textTransform: 'none' }}>
                  Contact Support
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Company
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button component={Link} to="/about" sx={{ justifyContent: 'flex-start', color: 'grey.400', textTransform: 'none' }}>
                  About Us
                </Button>
                <Button sx={{ justifyContent: 'flex-start', color: 'grey.400', textTransform: 'none' }}>
                  Privacy Policy
                </Button>
                <Button sx={{ justifyContent: 'flex-start', color: 'grey.400', textTransform: 'none' }}>
                  Terms of Service
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default Home