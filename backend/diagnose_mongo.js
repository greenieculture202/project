const dns = require('dns').promises;
const mongoose = require('mongoose');
require('dotenv').config();

async function diagnose() {
    const srvRecord = '_mongodb._tcp.cluster1.bqxczz3.mongodb.net';
    console.log(`--- Diagnosing DNS for ${srvRecord} ---`);
    
    try {
        const addresses = await dns.resolveSrv(srvRecord);
        console.log('✅ SRV Lookup successful:');
        console.log(JSON.stringify(addresses, null, 2));
        
        for (const addr of addresses) {
            try {
                const ips = await dns.resolve4(addr.name);
                console.log(`  - ${addr.name} resolves to: ${ips.join(', ')}`);
            } catch (e) {
                console.log(`  - ❌ Failed to resolve ${addr.name}: ${e.message}`);
            }
        }
    } catch (err) {
        console.error(`❌ SRV Lookup failed: ${err.message}`);
        if (err.code === 'ECONNREFUSED') {
            console.log('TIP: This often means your DNS server is refusing SRV queries. Try switching to Google DNS (8.8.8.8).');
        }
    }

    console.log('\n--- Testing Mongoose Connection ---');
    const uri = process.env.MONGODB_URI;
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Mongoose connected successfully!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Mongoose connection failed:');
        console.error(err.message);
    }
}

diagnose();
