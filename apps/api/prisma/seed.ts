import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding products...');

  const products = [
    {
      sku: 'UT-H1-001',
      name: 'Unitree H1',
      slug: 'unitree-h1',
      shortDescription: 'Robot humanoïde full-size pour la recherche et l\'industrie.',
      description: `Le H1 est le robot humanoïde le plus avancé d'Unitree. Avec 43 degrés de liberté, une vitesse de marche de 3,3 m/s et une capacité de charge de 30 kg, il est conçu pour opérer dans des environnements industriels complexes et mener des recherches robotiques de pointe.`,
      category: 'HUMANOID_ROBOT' as const,
      basePrice: 90000,
      leasePriceMonth: 2800,
      requiresQuote: true,
      isFeatured: true,
      isActive: true,
      specifications: {
        height: '1.8 m',
        weight: '47 kg',
        payload: '30 kg',
        speed: '3.3 m/s',
        battery: '2h+',
        dof: '43 DoF',
        processor: 'NVIDIA Jetson + Intel NUC',
        sensors: 'LiDAR 3D, RGB-D, IMU 9-axis',
      },
      images: {
        create: [
          {
            url: 'https://www.unitree.com/images/fdff7695f62b42b89b2459a3a4405118_400x400.png',
            altText: 'Unitree H1 Robot humanoïde',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://www.unitree.com/images/d01aae29f6ed4165b0b2e01c811fb3b8_1419x852.png',
            altText: 'Unitree H1 — vue de détail',
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
      tags: {
        create: [
          { tag: 'humanoïde' },
          { tag: 'recherche' },
          { tag: 'industrie' },
        ],
      },
    },
    {
      sku: 'UT-G1-001',
      name: 'Unitree G1',
      slug: 'unitree-g1',
      shortDescription: 'Plateforme de recherche humanoïde compacte et accessible.',
      description: `Le G1 est la plateforme de recherche humanoïde d'entrée de gamme d'Unitree. Compact, robuste et abordable, il offre 23 degrés de liberté et une vitesse de 2 m/s pour les équipes de recherche universitaire et industrielle.`,
      category: 'HUMANOID_ROBOT' as const,
      basePrice: 16000,
      leasePriceMonth: 550,
      requiresQuote: true,
      isFeatured: true,
      isActive: true,
      specifications: {
        height: '1.27 m',
        weight: '35 kg',
        payload: '3 kg',
        speed: '2 m/s',
        battery: '2h',
        dof: '23 DoF',
        processor: 'NVIDIA Orin NX',
        sensors: 'Caméra RGB-D, IMU',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/1_968fd08b-9aaf-4f32-b895-5c786285ee52.jpg?v=1717575256',
            altText: 'Unitree G1 Robot humanoïde compact',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://www.unitree.com/images/9698385312f84cfcaca4fcc6a58e4ae3_2740x1720.jpg',
            altText: 'Unitree G1 — en action',
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
      tags: {
        create: [
          { tag: 'humanoïde' },
          { tag: 'recherche' },
          { tag: 'université' },
        ],
      },
    },
    {
      sku: 'UT-B2-001',
      name: 'Unitree B2',
      slug: 'unitree-b2',
      shortDescription: 'Robot quadrupède industriel haute performance.',
      description: `Le B2 est le robot quadrupède industriel d'Unitree, capable d'atteindre 6 m/s et de porter 40 kg de charge utile. Imperméable IP67, il opère en extérieur dans des conditions difficiles pour l'inspection, la sécurité et la logistique.`,
      category: 'QUADRUPED_ROBOT' as const,
      basePrice: 35000,
      leasePriceMonth: 1100,
      requiresQuote: true,
      isFeatured: true,
      isActive: true,
      specifications: {
        height: '0.65 m',
        weight: '60 kg',
        payload: '40 kg',
        speed: '6 m/s',
        battery: '4h',
        dof: '12 DoF',
        protection: 'IP67',
        sensors: 'LiDAR, Caméra 360°, IMU',
      },
      images: {
        create: [
          {
            url: 'https://www.unitree.com/images/dd1fc7c2cc4d45518a38a04b84a46e8d_1529x883.png',
            altText: 'Unitree B2 Robot quadrupède industriel',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://www.unitree.com/images/0f744c68717d4b21a874f0983f0e40db_1708x866.png',
            altText: 'Unitree B2 — inspection terrain',
            isPrimary: false,
            sortOrder: 1,
          },
          {
            url: 'https://oss-global-cdn.unitree.com/static/ce6a0559ecd94008b120f15032dd9bf9_941x498.jpg',
            altText: 'Unitree B2 — vue latérale',
            isPrimary: false,
            sortOrder: 2,
          },
        ],
      },
      tags: {
        create: [
          { tag: 'quadrupède' },
          { tag: 'inspection' },
          { tag: 'extérieur' },
          { tag: 'IP67' },
        ],
      },
    },
    {
      sku: 'UT-GO2-001',
      name: 'Unitree Go2',
      slug: 'unitree-go2',
      shortDescription: 'Robot quadrupède éducatif et de recherche.',
      description: `Le Go2 est le robot quadrupède polyvalent d'Unitree, idéal pour l'éducation, la recherche et les applications légères. Léger, agile et doté d'une IA embarquée, il est le point d'entrée parfait dans l'univers de la robotique.`,
      category: 'QUADRUPED_ROBOT' as const,
      basePrice: 1600,
      compareAtPrice: 2000,
      leasePriceMonth: 65,
      requiresQuote: false,
      isFeatured: true,
      isActive: true,
      specifications: {
        height: '0.28 m',
        weight: '15 kg',
        payload: '3 kg',
        speed: '3.5 m/s',
        battery: '1-4h',
        dof: '12 DoF',
        ai: 'GPT-4V intégré',
      },
      images: {
        create: [
          {
            url: 'https://oss-global-cdn.unitree.com/static/3f119f752fdf41b0a70544dbe06e31f6_2606x1376.png',
            altText: 'Unitree Go2 Robot quadrupède éducatif',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://oss-global-cdn.unitree.com/static/870d4ddd10d741e6b79e456982e3aa28_2606x1376.png',
            altText: 'Unitree Go2 — vue arrière',
            isPrimary: false,
            sortOrder: 1,
          },
          {
            url: 'https://oss-global-cdn.unitree.com/static/320b50c0880d4466bca8beb56aa73abd_1620x816.png',
            altText: 'Unitree Go2 — spécifications',
            isPrimary: false,
            sortOrder: 2,
          },
        ],
      },
      tags: {
        create: [
          { tag: 'quadrupède' },
          { tag: 'éducation' },
          { tag: 'IA' },
        ],
      },
    },
    {
      sku: 'UT-Z1-001',
      name: 'Unitree Z1 Pro',
      slug: 'unitree-z1-pro',
      shortDescription: 'Bras robotique 6 axes haute précision.',
      description: `Le Z1 Pro est le bras robotique 6 axes d'Unitree, conçu pour la manipulation précise d'objets et l'intégration sur les robots mobiles. Charge utile 2 kg, portée 700 mm, précision répétable ±0.1 mm.`,
      category: 'ROBOTIC_ARM' as const,
      basePrice: 8500,
      leasePriceMonth: 280,
      requiresQuote: false,
      isFeatured: false,
      isActive: true,
      specifications: {
        dof: '6 DoF',
        payload: '2 kg',
        reach: '700 mm',
        precision: '±0.1 mm',
        weight: '4.5 kg',
        interface: 'Ethernet, CAN',
      },
      images: {
        create: [
          {
            url: 'https://oss-global-cdn.unitree.com/static/2897c79a27ff4e0984f8cc3ea0448af6_1920x1097.png',
            altText: 'Unitree Z1 Pro Bras robotique 6 axes',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      tags: {
        create: [
          { tag: 'bras robotique' },
          { tag: 'manipulation' },
          { tag: '6 axes' },
        ],
      },
    },
    {
      sku: 'UT-LIDAR-001',
      name: 'Kit LiDAR L1',
      slug: 'kit-lidar-l1',
      shortDescription: 'Module LiDAR 360° compatible tous robots Unitree.',
      description: `Kit d'extension LiDAR 360° pour robots Unitree. Portée 30m, 100 000 points/s, compatible ROS2. Plug-and-play sur Go2, B2 et H1. Inclut le câble de connexion et le logiciel de configuration.`,
      category: 'ACCESSORY' as const,
      basePrice: 1200,
      requiresQuote: false,
      isFeatured: false,
      isActive: true,
      specifications: {
        range: '30 m',
        pointRate: '100 000 pts/s',
        fov: '360°',
        interface: 'Ethernet',
        compatibility: 'Go2, B2, H1, G1',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/4_2d908cf1-3a7c-4a5a-95d4-e46f46a8a5fd.jpg?v=1687230151',
            altText: 'Kit LiDAR L1 pour robots Unitree',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/1_15075c4f-a64a-4ef0-a2df-bbbf6ab46f06.jpg?v=1687230151',
            altText: 'Kit LiDAR L1 — vue de côté',
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
      tags: {
        create: [
          { tag: 'lidar' },
          { tag: 'capteur' },
          { tag: 'ROS2' },
        ],
      },
    },
  ];

  for (const product of products) {
    const { images, tags, ...fields } = product as any;

    const record = await prisma.product.upsert({
      where: { sku: product.sku },
      update: { ...fields },
      create: product as any,
    });

    // Always replace images so re-seeding picks up URL changes
    await prisma.productImage.deleteMany({ where: { productId: record.id } });
    for (const img of images.create) {
      await prisma.productImage.create({ data: { ...img, productId: record.id } });
    }

    console.log(`  ✓ ${product.name}`);
  }

  console.log(`\nSeeded ${products.length} products successfully.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
