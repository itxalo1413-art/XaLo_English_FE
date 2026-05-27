import 'dotenv/config';
import mongoose from 'mongoose';
import ProgramGroup from './src/models/programGroup.js';
import ProgramTrack from './src/models/programTrack.js';

/** Chuẩn hóa tên lớp để khớp linh hoạt (PRE-IELTS, PRE - IELTS, ...) */
function normalizeCourseName(name) {
    return String(name || '')
        .toUpperCase()
        .replace(/\s*-\s*/g, ' - ')
        .replace(/\s+/g, ' ')
        .trim();
}

const GROUPS = [
    { name: 'IELTS ONLINE', slug: 'ielts-online', order: 1 },
    { name: 'IELTS OFFLINE', slug: 'ielts-offline', order: 2 },
];

/** Đầu vào / đầu ra theo bảng chương trình (ảnh tham chiếu) */
const COURSE_SPECS = {
    online: [
        {
            name: 'PRE - IELTS',
            slug: 'pre-ielts',
            order: 1,
            entryBandText: 'Mất gốc',
            exitBandText: 'Kiến thức nền tảng',
        },
        {
            name: 'PRE - CORE',
            slug: 'pre-core',
            order: 2,
            entryBandText: '0 - 2.5',
            exitBandText: '4.0 - 4.5',
        },
        {
            name: 'CORE',
            slug: 'core',
            order: 3,
            entryBandText: '3.0 - 4.0',
            exitBandText: '4.0 - 4.5',
        },
        {
            name: 'UPSTREAM',
            slug: 'upstream',
            order: 4,
            entryBandText: '4.5 - 5.5',
            exitBandText: '6+',
        },
        {
            name: 'SOAR',
            slug: 'soar',
            order: 5,
            entryBandText: '6.0+',
            exitBandText: '7',
        },
    ],
    offline: [
        {
            name: 'FOUNDATION',
            slug: 'foundation',
            order: 1,
            entryBandText: '0 - 4.0',
            exitBandText: '4.0 - 4.5',
        },
        {
            name: 'MOMENTUM',
            slug: 'momentum',
            order: 2,
            entryBandText: '4.5 - 5.5',
            exitBandText: '6',
        },
        {
            name: 'ADVANCED',
            slug: 'advanced',
            order: 3,
            entryBandText: '6.0+',
            exitBandText: '7',
        },
    ],
};

function isOnlineGroup(group) {
    const text = `${group?.name || ''} ${group?.slug || ''}`.toLowerCase();
    return text.includes('online');
}

function isOfflineGroup(group) {
    const text = `${group?.name || ''} ${group?.slug || ''}`.toLowerCase();
    return text.includes('offline');
}

function findSpecForTrack(track, populatedGroup) {
    const group = populatedGroup || track.group;
    const bucket = isOnlineGroup(group) ? 'online' : isOfflineGroup(group) ? 'offline' : null;
    if (!bucket) return null;

    const normalized = normalizeCourseName(track.name);
    const specs = COURSE_SPECS[bucket];

    // Khớp chính xác trước
    let spec = specs.find((s) => normalizeCourseName(s.name) === normalized);
    if (spec) return spec;

    // Khớp mờ: slug hoặc tên chứa (tránh CORE nhầm PRE - CORE)
    spec = specs.find((s) => {
        const specNorm = normalizeCourseName(s.name);
        if (specNorm === 'CORE' && normalized.includes('PRE')) return false;
        return (
            track.slug === s.slug ||
            normalized === specNorm ||
            normalized.includes(specNorm)
        );
    });

    return spec || null;
}

async function ensureGroups() {
    const result = {};
    for (const g of GROUPS) {
        let group = await ProgramGroup.findOne({ slug: g.slug });
        if (!group) {
            group = await ProgramGroup.create(g);
            console.log(`Created group: ${g.name}`);
        } else {
            group.name = g.name;
            group.order = g.order;
            await group.save();
        }
        result[g.slug] = group;
    }
    return result;
}

async function upsertTrack(group, spec) {
    const normalizedSpecName = normalizeCourseName(spec.name);
    let track =
        (await ProgramTrack.findOne({ group: group._id, slug: spec.slug })) ||
        (await ProgramTrack.findOne({
            group: group._id,
            name: new RegExp(`^${spec.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        }));

    if (!track) {
        const allInGroup = await ProgramTrack.find({ group: group._id });
        track = allInGroup.find((t) => normalizeCourseName(t.name) === normalizedSpecName);
    }

    if (track) {
        track.name = spec.name;
        track.slug = spec.slug;
        track.order = spec.order;
        track.entryBandText = spec.entryBandText;
        track.exitBandText = spec.exitBandText;
        track.formats = [group.slug.includes('online') ? 'Online' : 'Offline'];
        await track.save();
        console.log(`Updated: [${group.name}] ${spec.name}`);
        return track;
    }

    track = await ProgramTrack.create({
        group: group._id,
        name: spec.name,
        slug: spec.slug,
        order: spec.order,
        entryBandText: spec.entryBandText,
        exitBandText: spec.exitBandText,
        formats: [group.slug.includes('online') ? 'Online' : 'Offline'],
    });
    console.log(`Created: [${group.name}] ${spec.name}`);
    return track;
}

const getMongoUri = () =>
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/xalo';

const seedProgramTracks = async () => {
    const uri = getMongoUri();
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected:', mongoose.connection.host);

        const groups = await ensureGroups();

        for (const spec of COURSE_SPECS.online) {
            await upsertTrack(groups['ielts-online'], spec);
        }
        for (const spec of COURSE_SPECS.offline) {
            await upsertTrack(groups['ielts-offline'], spec);
        }

        // Cập nhật các track đã có sẵn (tên khác slug) theo nhóm
        const tracks = await ProgramTrack.find({}).populate('group');
        let synced = 0;
        for (const track of tracks) {
            const spec = findSpecForTrack(track, track.group);
            if (!spec) continue;
            track.entryBandText = spec.entryBandText;
            track.exitBandText = spec.exitBandText;
            if (!track.order) track.order = spec.order;
            await track.save();
            synced += 1;
            console.log(`Synced bands: [${track.group?.name}] ${track.name}`);
        }

        console.log(`Done. Synced ${synced} existing track(s) by name.`);
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error.message);
        if (error.name === 'MongooseServerSelectionError') {
            console.error('\nKhông kết nối được MongoDB. Kiểm tra:');
            console.error('  1. File backend/.env có MONGO_URI (cùng chuỗi khi chạy npm run dev)');
            console.error('  2. Hoặc bật MongoDB local: brew services start mongodb-community');
            console.error(`  3. URI đang dùng: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')}`);
        }
        process.exit(1);
    }
};

seedProgramTracks();
