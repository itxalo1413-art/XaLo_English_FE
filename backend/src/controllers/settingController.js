import asyncHandler from 'express-async-handler';
import Setting from '../models/settingModel.js';

// @desc    Get settings
// @route   GET /api/v1/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
    const settings = await Setting.findOne();
    if (settings) {
        res.json(settings);
    } else {
        // Return empty object or default settings if not found
        res.json({});
    }
});

// @desc    Update settings
// @route   PUT /api/v1/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
    const {
        phone_number,
        email_address,
        facebook_link,
        meta_title_home,
        meta_description_home,
        meta_title_news,
        meta_description_news,
        header_script,
        body_script,
    } = req.body;

    let settings = await Setting.findOne();

    if (settings) {
        settings.phone_number = phone_number || settings.phone_number;
        settings.email_address = email_address || settings.email_address;
        settings.facebook_link = facebook_link || settings.facebook_link;
        settings.meta_title_home = meta_title_home || settings.meta_title_home;
        settings.meta_description_home =
            meta_description_home || settings.meta_description_home;
        settings.meta_title_news = meta_title_news ?? settings.meta_title_news;
        settings.meta_description_news =
            meta_description_news ?? settings.meta_description_news;
        settings.header_script = header_script || settings.header_script;
        settings.body_script = body_script || settings.body_script;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } else {
        const newSettings = new Setting({
            phone_number,
            email_address,
            facebook_link,
            meta_title_home,
            meta_description_home,
            meta_title_news,
            meta_description_news,
            header_script,
            body_script,
        });
        const createdSettings = await newSettings.save();
        res.status(201).json(createdSettings);
    }
});

export { getSettings, updateSettings };
