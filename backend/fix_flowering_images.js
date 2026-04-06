const mongoose = require('mongoose');
require('dotenv').config();

const ProductSchema = new mongoose.Schema({
    name: String,
    image: String,
    hoverImage: String,
    category: String
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const floweringFixes = [
  {
    "name": "Peace Lily",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774275921/DSC00503_grande_gkw97i.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "lavender Flower",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774337167/Hd35405a66c2845eaba660f5637c9df3fI_bresdx.webp",
    "hoverImage": "https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Orchid",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774276657/orchid-new-moth-e1680517838495_p6j5ed.webp",
    "hoverImage": "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Kalanchoe",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774363619/IMG-20241218-WA0011_xgmk8g.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Begonia",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774277798/0719375caccf18c0a38766491fa6619d_hbpip9.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Geranium",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774278622/gagera061174873-2000-36620c34f09440438f3185eeb1fe8c17-71d9be1ef52b47ffb44207510df2b1b5_ibx3l6.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "African Violet",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774282809/61uAyA-0nIL._AC_UF1000_2C1000_QL80__eglpgr.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Jasmine (Indoor Variety)",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774283199/jasmine-plant-windowsill-getty-1220-2000-6508d5102dd846b48c35eaf713888064_xiy4wn.jpg",
    "hoverImage": "https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Bromeliad",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774283529/Bromeliad-in-a-pot_j4bd8o.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Amaryllis",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774284152/11120_jlgezi.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Christmas Cactus",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774332391/thanksgiving-cactus_nadezhdanesterova-ss_rrenrq.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Crown of Thorns",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774333119/OIP.Hxh9Dimla4mVXUthiN87FwHaHZ_xtrr8a.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Clivia",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774334091/23224_mrubgs.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Gloxinia",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774334546/gloxinia-kaiser-wilhelm-1_gytnin.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Dahlia",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774337485/pink-dahlias-growing-in-container-6d50f97eb9aa46cf8632559636fec153_gcd9fe.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Cyclamen",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774335030/cyclamen-pots-containers_pokifu.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Zinnia",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774366131/Zinnias-2020-2-scaled_aqtgt6.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Lipstick Plant",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774335985/51xwuPmXB5L_vcztd7.jpg",
    "hoverImage": "https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Hoya",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774336791/Hoya-obovata_vbor8c.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=1200&q=100"
  },
  {
    "name": "Anthurium Lily",
    "image": "https://res.cloudinary.com/dzuewhxxm/image/upload/v1774276266/71BJyb8Ys5L._AC_UF1000_2C1000_QL80__oita3a.jpg",
    "hoverImage": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=100"
  }
];

async function fixImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor');
        console.log('Connected to MongoDB');

        for (const fix of floweringFixes) {
            const res = await Product.updateMany(
                { name: fix.name },
                { $set: { image: fix.image, hoverImage: fix.hoverImage } }
            );
            console.log(`Updated ${fix.name}: matched ${res.matchedCount}, modified ${res.modifiedCount}`);
        }

        console.log('Done fixing flowering plant images!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixImages();
