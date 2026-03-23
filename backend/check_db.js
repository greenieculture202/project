❯ Building...
[BACKEND] ✅ MongoDB connected successfully
[BACKEND] 📊 Active Database: mejor
[BACKEND] 🔄 Starting data seeding...
[BACKEND] ✅ Seeding completed
[BACKEND] 🚀 Server is running on port 5000 at http://127.0.0.1:5000
[FRONTEND] ✔ Building...
[FRONTEND] Application bundle generation failed. [37.640 seconds] - 2026-03-19T09:33:04.511Z
[FRONTEND]
[FRONTEND] X [ERROR] TS2532: Object is possibly 'undefined'. [plugin angular-compiler]
[FRONTEND]
[FRONTEND]     src/app/ai-analytics-panel/ai-analytics-panel.html:265:109:
[FRONTEND]       265 │ ...te.topProducts?.length || (selectedState.priceRange?.high > 0))">
[FRONTEND]           ╵                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
[FRONTEND]
[FRONTEND]   Error occurs in the template of component AiAnalyticsPanelComponent.
[FRONTEND]
[FRONTEND]     src/app/ai-analytics-panel/ai-analytics-panel.ts:28:15:
[FRONTEND]       28 │   templateUrl: './ai-analytics-panel.html',
[FRONTEND]          ╵                ~~~~~~~~~~~~~~~~~~~~~~~~~~~
[FRONTEND]
[FRONTEND]
[FRONTEND] X [ERROR] TS2345: Argument of type 'number' is not assignable to parameter of type 'string'. [plugin angular-compiler]
[FRONTEND]
[FRONTEND]     src/app/bogo-offer/bogo-offer.ts:24:60:
[FRONTEND]       24 │ ...Service.getProducts('G-BOGO-6-SECTION', 4).subscribe(products => {
[FRONTEND]          ╵                                            ^
[FRONTEND]
[FRONTEND]
[FRONTEND] X [ERROR] TS2345: Argument of type 'number' is not assignable to parameter of type 'string'. [plugin angular-compiler]
[FRONTEND]
[FRONTEND]     src/app/flowering-offer/flowering-offer.ts:24:58:
[FRONTEND]       24 │ ...ctService.getProducts('G-FLOWER-6-SEC', 6).subscribe(products => {
[FRONTEND]          ╵                                            ^
[FRONTEND]
[FRONTEND]
[FRONTEND] X [ERROR] TS2345: Argument of type 'number' is not assignable to parameter of type 'string'. [plugin angular-compiler]
[FRONTEND]
[FRONTEND]     src/app/garden-offer/garden-offer.ts:24:58:
[FRONTEND]       24 │ ...ctService.getProducts('G-GARDEN-6-SEC', 6).subscribe(products => {
[FRONTEND]          ╵                                            ^
[FRONTEND]
[FRONTEND]
[FRONTEND] X [ERROR] TS2345: Argument of type 'number' is not assignable to parameter of type 'string'. [plugin angular-compiler]
[FRONTEND]
[FRONTEND]     src/app/indoor-offer/indoor-offer.ts:24:58:
[FRONTEND]       24 │ ...ctService.getProducts('G-INDOOR-6-SEC', 6).subscribe(products => {
[FRONTEND]          ╵                                            ^
[FRONTEND]
[FRONTEND]
[FRONTEND] X [ERROR] TS2345: Argument of type 'number' is not assignable to parameter of type 'string'. [plugin angular-compiler]
[FRONTEND]
[FRONTEND]     src/app/product-tabs/product-tabs.ts:43:56:
[FRONTEND]       43 │ ...ductService.getProducts(this.activeTab, 6).subscribe(products => {
[FRONTEND]          ╵                                            ^
[FRONTEND]
[FRONTEND]
[FRONTEND] Watch mode enabled. Watching for file changes...
const mongoose = require('mongoose');
const Settlement = require('./models/Settlement');
require('dotenv').config();

async function run() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenieculture');
    const ss = await Settlement.find();
    console.log(JSON.stringify(ss, null, 2));
    process.exit(0);
}
run();
