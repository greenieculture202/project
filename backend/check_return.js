const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

mongoose.connect(MONGO_URI)
  .then(async () => {
    const db = mongoose.connection.db;
    const order = await db.collection('orders').findOne({ status: 'Return Requested' });
    if (order) {
      console.log('Order found:', order._id);
      console.log('returnDetails:', JSON.stringify({
        reason: order.returnDetails?.reason,
        additionalInfo: order.returnDetails?.additionalInfo,
        hasBillImage: !!order.returnDetails?.billImage,
        billImageLength: order.returnDetails?.billImage?.length || 0,
        hasProductImage1: !!order.returnDetails?.productImage1,
        hasProductImage2: !!order.returnDetails?.productImage2,
        submittedAt: order.returnDetails?.submittedAt
      }, null, 2));
    } else {
      console.log('No Return Requested order found');
    }
    process.exit(0);
  })
  .catch(err => { console.error('Error:', err.message); process.exit(1); });
