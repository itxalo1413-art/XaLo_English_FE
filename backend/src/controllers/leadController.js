import asyncHandler from 'express-async-handler';
import Lead from '../models/leadModel.js';
import appendLeadToSheet from '../utils/googleSheets.js';

// @desc    Create a new lead
// @route   POST /api/v1/leads
// @access  Public
const createLead = asyncHandler(async (req, res) => {
    const { name, email, phone, message, goals, consultationTime } = req.body;

    const lead = new Lead({
        name,
        email,
        phone,
        message,
        goals,
        consultationTime,
    });

    const createdLead = await lead.save();

    // Append to Google Sheets
    try {
        await appendLeadToSheet(createdLead);
    } catch (error) {
        console.error('Google Sheets logging failed:', error.message);
    }

    res.status(201).json(createdLead);
});

// @desc    Get all leads
// @route   GET /api/v1/leads
// @access  Private/Admin
const getLeads = asyncHandler(async (req, res) => {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    res.json(leads);
});

// @desc    Export leads to CSV
// @route   GET /api/v1/leads/export
// @access  Private/Admin
const exportLeads = asyncHandler(async (req, res) => {
    const leads = await Lead.find({}).sort({ createdAt: -1 });

    const fields = ['Name', 'Email', 'Phone', 'Message', 'Status', 'Date'];
    const csv = leads.map((lead) => {
        return [
            lead.name,
            lead.email,
            lead.phone,
            lead.message,
            lead.status,
            lead.createdAt,
        ].join(',');
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(fields.join(',') + '\n' + csv.join('\n'));
});

// @desc    Update lead status
// @route   PUT /api/v1/leads/:id
// @access  Private/Admin
const updateLeadStatus = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
        lead.status = req.body.status || lead.status;
        const updatedLead = await lead.save();
        res.json(updatedLead);
    } else {
        res.status(404);
        throw new Error('Lead not found');
    }
});

export { createLead, getLeads, exportLeads, updateLeadStatus };
