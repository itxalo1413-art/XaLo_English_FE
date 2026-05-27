import mongoose from 'mongoose';

const settingSchema = mongoose.Schema(
    {
        phone_number: { type: String },
        email_address: { type: String },
        facebook_link: { type: String },
        meta_title_home: { type: String },
        meta_description_home: { type: String },
        meta_title_news: { type: String },
        meta_description_news: { type: String },
        header_script: { type: String },
        body_script: { type: String },
    },
    {
        timestamps: true,
    }
);

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
