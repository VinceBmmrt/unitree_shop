import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding products...');

  const products = [
    {
      sku: 'UT-H1-001',
      name: 'Unitree H1',
      slug: 'unitree-h1',
      shortDescription: "Robot humanoïde full-size pour la recherche et l'industrie.",
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
        create: [{ tag: 'humanoïde' }, { tag: 'recherche' }, { tag: 'industrie' }],
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
        create: [{ tag: 'humanoïde' }, { tag: 'recherche' }, { tag: 'université' }],
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
        create: [{ tag: 'quadrupède' }, { tag: 'éducation' }, { tag: 'IA' }],
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
        create: [{ tag: 'bras robotique' }, { tag: 'manipulation' }, { tag: '6 axes' }],
      },
    },
    {
      sku: 'UT-GO2-PRO-001',
      name: 'Unitree Go2 Pro',
      slug: 'unitree-go2-pro',
      shortDescription:
        'Robot quadrupède éducatif et de recherche — édition Pro avec 4G/LTE et IA avancée.',
      description: `Le Go2 Pro est la version premium du Go2 d'Unitree. Il ajoute la connectivité 4G/LTE embarquée, une caméra avant 4K, et un traitement IA amélioré pour des applications autonomes avancées. Parfait pour les équipes qui ont besoin d'une connectivité permanente sur le terrain.`,
      category: 'QUADRUPED_ROBOT' as const,
      basePrice: 2800,
      compareAtPrice: 3200,
      leasePriceMonth: 110,
      requiresQuote: false,
      isFeatured: true,
      isActive: true,
      specifications: {
        height: '0.28 m',
        weight: '15 kg',
        payload: '3 kg',
        speed: '3.7 m/s',
        battery: '1-4h',
        dof: '12 DoF',
        connectivity: '4G/LTE intégré',
        camera: '4K avant + RGB-D',
        ai: 'GPT-4V + navigation autonome',
      },
      images: {
        create: [
          {
            url: 'https://oss-global-cdn.unitree.com/static/3f119f752fdf41b0a70544dbe06e31f6_2606x1376.png',
            altText: 'Unitree Go2 Pro — vue principale',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://oss-global-cdn.unitree.com/static/870d4ddd10d741e6b79e456982e3aa28_2606x1376.png',
            altText: 'Unitree Go2 Pro — vue arrière',
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
      tags: {
        create: [{ tag: 'quadrupède' }, { tag: '4G/LTE' }, { tag: 'IA' }, { tag: 'pro' }],
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
            altText: 'Unitree 4D LiDAR L1 — vue principale',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/2_089bc6e9-77bf-4427-860c-cff9d8414e2e.jpg?v=1687230151',
            altText: 'Unitree 4D LiDAR L1 — vue de côté',
            isPrimary: false,
            sortOrder: 1,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/3_82f76f3f-b175-4392-86e1-db9a87594402.jpg?v=1687230151',
            altText: 'Unitree 4D LiDAR L1 — détail connectique',
            isPrimary: false,
            sortOrder: 2,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/1_15075c4f-a64a-4ef0-a2df-bbbf6ab46f06.jpg?v=1687230151',
            altText: 'Unitree 4D LiDAR L1 — vue arrière',
            isPrimary: false,
            sortOrder: 3,
          },
        ],
      },
      tags: {
        create: [{ tag: 'lidar' }, { tag: 'capteur' }, { tag: 'ROS2' }],
      },
    },
    {
      sku: 'UT-BAT-GO2-001',
      name: 'Batterie longue durée Go2',
      slug: 'batterie-longue-duree-go2',
      shortDescription:
        'Batterie de remplacement haute capacité pour Unitree Go2 / Go2 Pro — autonomie 4h.',
      description: `Batterie officielle haute capacité pour les robots Unitree Go2 et Go2 Pro. Double l'autonomie standard à 4 heures en usage continu. Chargeur inclus. Remplacement en 30 secondes sans outil.`,
      category: 'ACCESSORY' as const,
      basePrice: 320,
      compareAtPrice: 380,
      requiresQuote: false,
      isFeatured: false,
      isActive: true,
      specifications: {
        capacity: '15 000 mAh',
        voltage: '29.4 V',
        autonomy: '~4h',
        weight: '1.2 kg',
        compatibility: 'Go2, Go2 Pro',
        chargeTime: '2h30',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/168.jpg?v=1702375329',
            altText: 'Batterie longue durée Unitree Go2 — vue principale',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/169_c6ad4b4c-1d1a-4169-9691-4d377fbeaba9.jpg?v=1702375329',
            altText: 'Batterie longue durée Unitree Go2 — vue de côté',
            isPrimary: false,
            sortOrder: 1,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/170_5ee6504e-0174-47e4-b8e2-d5c8103c40a7.jpg?v=1702375328',
            altText: 'Batterie longue durée Unitree Go2 — connecteur',
            isPrimary: false,
            sortOrder: 2,
          },
        ],
      },
      tags: {
        create: [{ tag: 'batterie' }, { tag: 'Go2' }, { tag: 'accessoire' }],
      },
    },
    {
      sku: 'UT-CAM-REALSENSE-001',
      name: 'Module caméra Intel RealSense D435i',
      slug: 'module-camera-realsense-d435i',
      shortDescription: 'Caméra de profondeur RGB-D pour perception 3D avancée sur robots Unitree.',
      description: `Le module Intel RealSense D435i est la caméra de profondeur de référence pour la perception 3D sur robots mobiles. Champ de vision 86°, portée 10m, données IMU intégrées. Compatible ROS2, OpenCV et SDK Unitree. Idéal pour la navigation autonome, la manipulation et le mapping 3D.`,
      category: 'ACCESSORY' as const,
      basePrice: 340,
      requiresQuote: false,
      isFeatured: true,
      isActive: true,
      specifications: {
        type: 'RGB-D stéréo',
        range: '0.1 – 10 m',
        fov: '86° × 57°',
        resolution: '1280×720 @ 90fps',
        imu: 'BMI055 6-axis',
        interface: 'USB 3.1',
        compatibility: 'Go2, B2, H1, G1',
      },
      images: {
        create: [
          {
            url: 'https://www.realsenseai.com/wp-content/uploads/2025/07/D435i.png',
            altText: 'Intel RealSense D435i — caméra de profondeur RGB-D',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      tags: {
        create: [{ tag: 'caméra' }, { tag: 'RGB-D' }, { tag: 'perception' }, { tag: 'ROS2' }],
      },
    },
    {
      sku: 'UT-CASE-GO2-001',
      name: 'Housse de transport rigide Go2',
      slug: 'housse-transport-rigide-go2',
      shortDescription:
        'Valise rigide IP67 avec mousse sur-mesure pour le transport du Unitree Go2.',
      description: `Valise de transport rigide certifiée IP67 spécialement conçue pour le Unitree Go2 et Go2 Pro. Mousse PE sur-mesure, verrous à combinaison TSA, poignées renforcées et roulettes tout-terrain. Protège efficacement le robot lors des déplacements terrain.`,
      category: 'ACCESSORY' as const,
      basePrice: 190,
      requiresQuote: false,
      isFeatured: false,
      isActive: true,
      specifications: {
        dimensions: '60 × 45 × 35 cm',
        weight: '3.5 kg',
        protection: 'IP67',
        lock: 'TSA combinaison',
        foam: 'PE sur-mesure Go2',
        wheels: 'Tout-terrain 360°',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/150.jpg?v=1702375597',
            altText: 'Housse de transport rigide Unitree Go2 — vue fermée',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/151_def9c78e-d9a4-4b36-bdf6-d2c256ceba0d.jpg?v=1702375597',
            altText: 'Housse de transport rigide Unitree Go2 — intérieur mousse',
            isPrimary: false,
            sortOrder: 1,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/152_2c52c2a2-98ba-4a23-bdb7-ce416cd52c9b.jpg?v=1702375596',
            altText: 'Housse de transport rigide Unitree Go2 — détail verrou',
            isPrimary: false,
            sortOrder: 2,
          },
        ],
      },
      tags: {
        create: [{ tag: 'transport' }, { tag: 'valise' }, { tag: 'Go2' }, { tag: 'IP67' }],
      },
    },
    {
      sku: 'UT-CHARGER-FAST-001',
      name: 'Chargeur rapide universel Unitree',
      slug: 'chargeur-rapide-universel',
      shortDescription: 'Chargeur rapide 220V compatible Go2, B2 et Z1 Pro — charge en 2h.',
      description: `Chargeur rapide officiel Unitree compatible avec les robots Go2, Go2 Pro, B2 et le bras Z1 Pro. Technologie GaN 220W, charge complète en 2h. Cordon EU inclus, certifié CE. Protection contre la surcharge, la surtension et la surchauffe.`,
      category: 'ACCESSORY' as const,
      basePrice: 89,
      compareAtPrice: 110,
      requiresQuote: false,
      isFeatured: false,
      isActive: true,
      specifications: {
        power: '220 W',
        input: '100-240V AC',
        output: '29.4V / 7.5A',
        chargeTime: '~2h',
        certification: 'CE, RoHS',
        compatibility: 'Go2, Go2 Pro, B2, Z1 Pro',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/145.jpg?v=1702435004',
            altText: 'Chargeur rapide Unitree — vue principale',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/146.jpg?v=1702435004',
            altText: 'Chargeur rapide Unitree — vue câble',
            isPrimary: false,
            sortOrder: 1,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/147.jpg?v=1702435005',
            altText: 'Chargeur rapide Unitree — connecteur',
            isPrimary: false,
            sortOrder: 2,
          },
        ],
      },
      tags: {
        create: [{ tag: 'chargeur' }, { tag: 'GaN' }, { tag: 'accessoire' }],
      },
    },
    {
      sku: 'UT-SDK-SUPPORT-001',
      name: 'Plan de support développeur — 1 an',
      slug: 'plan-support-developpeur-1-an',
      shortDescription:
        'Accès prioritaire au support technique Unitree, mises à jour SDK et webinaires mensuels.',
      description: `Le plan de support développeur vous donne accès à un canal technique prioritaire, aux mises à jour SDK avant leur publication officielle, à la documentation avancée (ROS2, API bas niveau) et à des webinaires mensuels animés par l'équipe d'ingénieurs Unitree. Valable 12 mois, pour 1 robot.`,
      category: 'ACCESSORY' as const,
      basePrice: 990,
      requiresQuote: false,
      isFeatured: true,
      isActive: true,
      specifications: {
        duration: '12 mois',
        support: 'Ticket prioritaire < 4h (jours ouvrés)',
        sdk: 'Accès preview SDK',
        webinars: '1 par mois',
        robots: '1 robot inclus',
        renewal: 'Auto-renouvellement annulable',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/5_46eb6952-db91-4878-b6e5-1749ea14135d.jpg?v=1732264669',
            altText: 'Plan support développeur Unitree SDK',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/2_fae5c893-a636-4708-89fc-3b4aa78b6d81.jpg?v=1732264752',
            altText: 'Plan support développeur — accès documentation avancée',
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
      tags: {
        create: [{ tag: 'support' }, { tag: 'SDK' }, { tag: 'développeur' }, { tag: 'service' }],
      },
    },
  ];

  // Ensure a default warehouse exists
  const warehouse = await prisma.warehouse.upsert({
    where: { code: 'FR-PARIS-01' },
    update: {},
    create: {
      name: 'Entrepôt Paris',
      code: 'FR-PARIS-01',
      address: { street: '1 Rue de la Robotique', city: 'Paris', postalCode: '75001', country: 'FR' },
      isActive: true,
    },
  });

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

    // Seed inventory — robots get 3 units, accessories get 50
    const qty = product.category === 'ACCESSORY' ? 50 : 3;
    const existing = await prisma.inventoryItem.findFirst({
      where: { productId: record.id, variantId: null, warehouseId: warehouse.id },
    });
    if (existing) {
      await prisma.inventoryItem.update({ where: { id: existing.id }, data: { quantityOnHand: qty } });
    } else {
      await prisma.inventoryItem.create({
        data: { productId: record.id, warehouseId: warehouse.id, quantityOnHand: qty, quantityReserved: 0 },
      });
    }

    console.log(`  ✓ ${product.name}`);
  }

  const robots = products.filter((p) => p.category !== 'ACCESSORY').length;
  const accessories = products.filter((p) => p.category === 'ACCESSORY').length;
  console.log(
    `\nSeeded ${products.length} products (${robots} robots, ${accessories} accessories).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
