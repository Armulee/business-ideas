// Migration script to convert old Administration records to new format
// Run this script once to migrate existing data: node scripts/migrate-administration.js

const mongoose = require('mongoose');

// Old schema for reading existing data
const OldAdministrationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    action: String,
    reason: String,
    duration: String,
    previousRole: String,
    newRole: String,
    result: String,
    createdAt: Date,
    updatedAt: Date
});

// New schema for saving migrated data
const NewAdministrationSchema = new mongoose.Schema({
    user: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        email: String,
        avatar: String,
        profileId: Number
    },
    admin: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        email: String,
        avatar: String,
        profileId: Number
    },
    action: String,
    reason: String,
    duration: String,
    previousRole: String,
    newRole: String,
    result: String,
    createdAt: Date,
    updatedAt: Date
});

const ProfileSchema = new mongoose.Schema({
    name: String,
    email: String,
    avatar: String,
    profileId: Number
});

async function migrateAdministrationRecords() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const OldAdministration = mongoose.model('OldAdministration', OldAdministrationSchema, 'administrations');
        const NewAdministration = mongoose.model('NewAdministration', NewAdministrationSchema, 'administrations_new');
        const Profile = mongoose.model('Profile', ProfileSchema, 'profiles');

        // Find all old administration records
        const oldRecords = await OldAdministration.find().populate('user').populate('admin');
        console.log(`Found ${oldRecords.length} administration records to migrate`);

        const migratedRecords = [];

        for (const record of oldRecords) {
            try {
                const newRecord = {
                    _id: record._id,
                    user: record.user ? {
                        _id: record.user._id,
                        name: record.user.name || 'Unknown User',
                        email: record.user.email || 'unknown@example.com',
                        avatar: record.user.avatar,
                        profileId: record.user.profileId || 0
                    } : null,
                    admin: record.admin ? {
                        _id: record.admin._id,
                        name: record.admin.name || 'Unknown Admin',
                        email: record.admin.email || 'admin@example.com',
                        avatar: record.admin.avatar,
                        profileId: record.admin.profileId || 0
                    } : null,
                    action: record.action,
                    reason: record.reason,
                    duration: record.duration,
                    previousRole: record.previousRole,
                    newRole: record.newRole,
                    result: record.result,
                    createdAt: record.createdAt,
                    updatedAt: record.updatedAt
                };

                migratedRecords.push(newRecord);
            } catch (error) {
                console.error(`Error processing record ${record._id}:`, error);
            }
        }

        if (migratedRecords.length > 0) {
            // Insert migrated records into new collection
            await NewAdministration.insertMany(migratedRecords);
            console.log(`Successfully migrated ${migratedRecords.length} records`);

            // Optional: Replace old collection with new one
            // Uncomment the following lines after verifying the migration
            // await mongoose.connection.db.collection('administrations').drop();
            // await mongoose.connection.db.collection('administrations_new').rename('administrations');
            // console.log('Replaced old collection with migrated data');
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    migrateAdministrationRecords();
}

module.exports = { migrateAdministrationRecords };