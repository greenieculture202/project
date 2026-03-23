const axios = require('axios');

async function testReminder() {
    try {
        console.log('Testing /api/admin/reminders...');
        const response = await axios.post('http://localhost:5000/api/admin/reminders', {
            plantName: "Test Plant",
            problemType: "Test Problem"
        }, {
            headers: { 'x-auth-token': 'admin-special-id' } // Try with special admin ID
        });
        
        console.log('Status:', response.status);
        console.log('Response JSON:', JSON.stringify(response.data, null, 2));
        
        if (response.data.reminders && response.data.reminders.length === 4) {
            console.log('SUCCESS: 4 reminders created!');
        } else {
            console.log('WARNING: Expected 4 reminders, but got:', response.data.reminders?.length);
        }
    } catch (error) {
        console.error('Error testing reminder:', error.message);
        if (error.response) {
            console.log('Response Error:', error.response.status, error.response.data);
        }
    }
}

testReminder();
