const Invoice = require('../models/Invoice.model');
const Stay = require('../models/Stay.model');
const { createLog, logAction } = require('../services/logService');
const permissions = require('../constants/permissions.constants');

exports.createInvoice = [
  async (req, res) => {
    try {
      const { stay, totalAmount, paymentStatus, payments } = req.body;
      const creator = req.user;
      
      // Validate stay
      const stayExists = await Stay.findById(stay);
      if (!stayExists || stayExists.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0010', message: 'Stay not found' });
      }
      
      // Validate payments
      if (payments && payments.length > 0) {
        for (const payment of payments) {
          if (!payment.amountPaid || !payment.datePaid || !payment.method) {
            return res.status(400).json({ 
              messageCode: 'MSG_0011', message: 'Each payment must have amountPaid, datePaid, and method' 
            });
          }
        }
      }
      
      const newInvoice = new Invoice({
        stay,
        totalAmount,
        paymentStatus: paymentStatus || 'pending',
        payments: payments || [],
        createdBy: creator._id
      });
      
      await newInvoice.save();
      
      // Store ID for logging middleware
      res.locals.newId = newInvoice._id;
      
      res.status(201).json({ 
        messageCode: 'MSG_0012', message: 'Invoice created successfully',
        invoice: newInvoice
      });
    } catch (error) {
      console.error('Create Invoice Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('CREATE_INVOICE', 'Invoice')
];

exports.updateInvoice = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updater = req.user;
      const updateData = req.body;
      
      const invoice = await Invoice.findById(id);
      if (!invoice || invoice.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0013', message: 'Invoice not found' });
      }
      
      // Update basic info
      if (updateData.totalAmount !== undefined) {
        invoice.totalAmount = updateData.totalAmount;
      }
      
      if (updateData.paymentStatus) {
        const validStatuses = ['pending', 'paid', 'partially_paid'];
        if (!validStatuses.includes(updateData.paymentStatus)) {
          return res.status(400).json({ 
            messageCode: 'MSG_0014', message: 'Invalid payment status' 
          });
        }
        invoice.paymentStatus = updateData.paymentStatus;
      }
      
      // Update payments
      if (updateData.payments) {
        for (const payment of updateData.payments) {
          if (!payment.amountPaid || !payment.datePaid || !payment.method) {
            return res.status(400).json({ 
              messageCode: 'MSG_0011', message: 'Each payment must have amountPaid, datePaid, and method' 
            });
          }
        }
        invoice.payments = updateData.payments;
      }
      
      await invoice.save();
      
      res.json({ 
        messageCode: 'MSG_0015', message: 'Invoice updated successfully',
        invoice
      });
    } catch (error) {
      console.error('Update Invoice Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('UPDATE_INVOICE', 'Invoice')
];

exports.deleteInvoice = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleter = req.user;
      
      const invoice = await Invoice.findById(id);
      if (!invoice || invoice.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0013', message: 'Invoice not found' });
      }
      
      invoice.deleted = true;
      await invoice.save();
      
      res.json({ 
        messageCode: 'MSG_0016', message: 'Invoice deleted successfully'
      });
    } catch (error) {
      console.error('Delete Invoice Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('DELETE_INVOICE', 'Invoice')
];

exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await Invoice.findById(id)
      .populate('stay', 'startDate endDate')
      .populate('createdBy', 'firstName lastName');
    
    if (!invoice || invoice.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0013', message: 'Invoice not found' });
    }
    
    res.json({ 
      messageCode: 'MSG_0003',  
      invoice
    });
  } catch (error) {
    console.error('Get Invoice Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      stay,
      paymentStatus,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      sort = '-issueDate',
      order = 'desc'
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { deleted: false };
    
    // Stay filter
    if (stay) query.stay = stay;
    
    // Payment status filter
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    // Amount range filter
    if (minAmount || maxAmount) {
      query.totalAmount = {};
      if (minAmount) query.totalAmount.$gte = Number(minAmount);
      if (maxAmount) query.totalAmount.$lte = Number(maxAmount);
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.issueDate = {};
      if (startDate) query.issueDate.$gte = new Date(startDate);
      if (endDate) query.issueDate.$lte = new Date(endDate);
    }
    
    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate({
            path: 'stay', 
            // select: 'startDate endDate room',
            populate: [{
              path: 'client',
            },{
              path: 'room',
              populate: [{
                path: 'hotel',
                populate: {
                  path: 'owners'
                }
              },{
                path: 'category'
              }]
            }
          ],
          }
        )
        .populate('createdBy', 'firstName lastName'),
      
      Invoice.countDocuments(query)
    ]);
    
    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      invoices
    });
  } catch (error) {
    console.error('Get Invoices Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};