const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const wallpapersDir = path.join(publicDir, 'wallpapers');
const dbPath = path.join(__dirname, '../db.json');

// Define Categories
const categories = [
  {
    "id": "cat-asuna",
    "name": "Asuna Solo",
    "description": "Hình nền đơn độc lập, chân dung và các khoảnh khắc xinh đẹp của Asuna Yuuki."
  },
  {
    "id": "cat-kirito",
    "name": "Kirito Solo",
    "description": "Hắc kiếm sĩ Kirigaya Kazuto trong các tư thế chiến đấu và chân dung solo cực ngầu."
  },
  {
    "id": "cat-sao-love",
    "name": "Kirito & Asuna (Love)",
    "description": "Những hình ảnh tình yêu lãng mạn, ngọt ngào và các matching icons của cặp đôi huyền thoại."
  },
  {
    "id": "cat-yui",
    "name": "Yui Yuigahama",
    "description": "Hình nền cực kỳ đáng yêu, năng động của cô nàng Yui Yuigahama từ Oregairu."
  },
  {
    "id": "cat-yukino",
    "name": "Yukino Yukinoshita",
    "description": "Hình nền thanh tao, cá tính và lạnh lùng của Yukino Yukinoshita từ Oregairu."
  },
  {
    "id": "cat-yugioh",
    "name": "Yu-Gi-Oh! Branded",
    "description": "Lịch sử cuộc chiến và số phận đầy trắc trở của Albaz & Ecclesia."
  },
  {
    "id": "cat-kashtira",
    "name": "Yu-Gi-Oh! Kashtira",
    "description": "Binh đoàn Kashtira xâm lược từ ngoài không gian với phong cách cơ giáp đỏ ấn tượng."
  }
];

// Helper to recursively get all files
function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, fileList);
    } else {
      fileList.push(name);
    }
  }
  return fileList;
}

function cleanTitle(filename) {
  let title = filename.substring(0, filename.lastIndexOf('.'));
  
  // Clean brackets and special strings
  title = title.replace(/\[.*?\]/g, '');
  title = title.replace(/\(.*?\)/g, '');
  
  // Clean special characters
  title = title.replace(/[_-]/g, ' ');
  title = title.replace(/[?]/g, '');
  
  // Remove multiple spaces
  title = title.replace(/\s+/g, ' ').trim();
  
  // Capitalize
  return title.replace(/\b\w/g, c => c.toUpperCase());
}

function run() {
  console.log("Scanning wallpapers folder...");
  const allFiles = getFiles(wallpapersDir);
  const wallpapers = [];
  
  let idCounter = 1;

  for (const filePath of allFiles) {
    const relativePath = filePath.replace(publicDir, '').replace(/\\/g, '/');
    const filename = path.basename(filePath);
    
    // Skip system files
    if (filename.startsWith('.') || filename === 'Thumbs.db') continue;

    // Determine Anime, Category, and Description based on folder path
    let anime = 'Anime';
    let categoryId = 'cat-other';
    let description = '';

    if (relativePath.includes('/Sword Art Online/Asuna/')) {
      anime = 'Sword Art Online';
      categoryId = 'cat-asuna';
      description = `Hình nền tuyệt đẹp của Asuna Yuuki trong bộ phim Sword Art Online.`;
    } else if (relativePath.includes('/Sword Art Online/Kirito/')) {
      anime = 'Sword Art Online';
      categoryId = 'cat-kirito';
      description = `Hình nền cực ngầu của Kirito (Kirigaya Kazuto) trong bộ phim Sword Art Online.`;
    } else if (relativePath.includes('/Love/Couple/Kirito x Asuna/')) {
      anime = 'Sword Art Online';
      categoryId = 'cat-sao-love';
      description = `Khoảnh khắc lãng mạn ngọt ngào của cặp đôi Kirito và Asuna.`;
    } else if (relativePath.includes('/Oregairu/Yui/')) {
      anime = 'Oregairu';
      categoryId = 'cat-yui';
      description = `Hình nền Yui Yuigahama xinh xắn, rạng rỡ trong Oregairu.`;
    } else if (relativePath.includes('/Oregairu/Yukino/')) {
      anime = 'Oregairu';
      categoryId = 'cat-yukino';
      description = `Hình nền Yukino Yukinoshita thông minh, kiêu sa trong Oregairu.`;
    } else if (relativePath.includes('/Yugioh/Kashtira/')) {
      anime = 'Yu-Gi-Oh!';
      categoryId = 'cat-kashtira';
      description = `Thẻ bài Kashtira cơ giáp đỏ chiến đấu từ vũ trụ Yu-Gi-Oh!.`;
    } else if (
      relativePath.includes('/Yugioh/Albaz/') ||
      relativePath.includes('/Yugioh/Ecclesia/') ||
      relativePath.includes('/Yugioh/Branded/')
    ) {
      anime = 'Yu-Gi-Oh! (Branded Lore)';
      categoryId = 'cat-yugioh';
      description = `Hình nền cốt truyện Dogmatika & Branded trong thẻ bài Yu-Gi-Oh!.`;
    } else {
      // Fallback or other folders
      continue;
    }

    const title = cleanTitle(filename) || `Wallpaper ${idCounter}`;
    
    // Set 3 featured wallpapers (select some high quality names)
    // Let's feature one SAO love, one Yugioh, one Oregairu
    const featured = idCounter === 1 || idCounter === 25 || idCounter === 45;

    wallpapers.push({
      id: `wp-${String(idCounter).padStart(3, '0')}`,
      title: title,
      anime: anime,
      categoryId: categoryId,
      imageUrl: relativePath,
      resolution: "1920x1080",
      orientation: "Landscape",
      downloads: Math.floor(Math.random() * 2000) + 500,
      likes: Math.floor(Math.random() * 1500) + 300,
      rating: parseFloat((Math.random() * 0.5 + 4.5).toFixed(1)),
      author: "Minh Thanh",
      description: description,
      featured: featured,
      createdAt: new Date().toISOString()
    });

    idCounter++;
  }

  // Load existing users (to preserve admin/user accounts)
  let users = [
    {
      "id": "user-admin",
      "username": "admin",
      "password": "admin123",
      "role": "admin",
      "email": "admin@animewallpaper.com"
    },
    {
      "id": "user-member",
      "username": "user",
      "password": "user123",
      "role": "user",
      "email": "user@animewallpaper.com"
    }
  ];

  try {
    if (fs.existsSync(dbPath)) {
      const oldDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (oldDb.users) users = oldDb.users;
    }
  } catch (e) {
    console.error("Preserving users failed, fallback to defaults");
  }

  const dbData = {
    categories,
    wallpapers,
    comments: [],
    users,
    "$schema": "./node_modules/json-server/schema.json"
  };

  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
  console.log(`Successfully synced ${wallpapers.length} wallpapers and ${categories.length} categories!`);
}

run();
