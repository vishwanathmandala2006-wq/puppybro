const db = require('./config/database');

// Test the database connection and query
const testQuery = async () => {
    try {
        console.log('\n=== Testing adoption applications query ===');
        
        // Test the exact query from the controller
        const result = await db.promisify.all(
            `SELECT aa.*, al.dog_name, al.breed, al.image_url as dog_image,
            u.name as applicant_user_name, u.email as applicant_user_email
            FROM adoption_applications aa
            LEFT JOIN adoption_listings al ON aa.listing_id = al.id
            LEFT JOIN users u ON aa.user_id = u.id
            ORDER BY aa.created_at DESC`,
            []
        );
        console.log('Full query result:', result);
        console.log('Query succeeded!');
        
    } catch (error) {
        console.error('ERROR:', error?.message || error);
        if (error.stack) console.error('STACK:', error.stack);
    } finally {
        process.exit(0);
    }
};

// Wait a moment for DB to initialize
setTimeout(testQuery, 1500);
