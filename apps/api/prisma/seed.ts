import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding products...');

  const products = [
    // Prices converted from official USD shop prices at 1 USD ≈ 0.93 EUR
    {
      sku: 'UT-H1-001',
      name: 'Unitree H1',
      slug: 'unitree-h1',
      shortDescription: "Robot humanoïde full-size — 47 kg, 3,3 m/s, 360 N·m de couple.",
      description: `Le H1 est le robot humanoïde bipède d'Unitree. Avec 19 degrés de liberté actifs, une vitesse de marche record de 3,3 m/s et un couple articulaire de 360 N·m, il est conçu pour opérer dans des environnements industriels réels. Batterie de 864 Wh, hauteur 1,80 m.`,
      category: 'HUMANOID_ROBOT' as const,
      basePrice: 84000,
      leasePriceMonth: 2600,
      requiresQuote: true,
      isFeatured: true,
      isActive: true,
      specifications: {
        height: '1,80 m',
        weight: '47 kg',
        dof: '19 DoF',
        speed: '3,3 m/s',
        torque: '360 N·m',
        battery: '864 Wh',
        protection: 'IP54',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/1_deeaa3cc-08f5-454f-bfcb-1a477b30adb4.jpg?v=1718359355',
            altText: 'Unitree H1 Robot humanoïde',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/2_fa366397-5fe1-488b-89e1-d3ca3fb0e754.jpg?v=1718359355',
            altText: 'Unitree H1 — vue de profil',
            isPrimary: false,
            sortOrder: 1,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/3_0241c65b-f618-4547-b0bf-ee05501922ae.jpg?v=1718359355',
            altText: 'Unitree H1 — détail articulaire',
            isPrimary: false,
            sortOrder: 2,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/4_e96adb7a-0b0c-4748-935c-f67469ea892c.jpg?v=1718359355',
            altText: 'Unitree H1 — vue arrière',
            isPrimary: false,
            sortOrder: 3,
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
      shortDescription: 'Humanoïde compact de recherche — 35 kg, 23-43 DoF, IA unifiée.',
      description: `Le G1 est le robot humanoïde compact d'Unitree, point d'entrée idéal pour les équipes de recherche et les universités. Il offre 23 à 43 degrés de liberté selon la configuration, une vitesse de 2 m/s et est alimenté par UnifoLM, le modèle unifié d'Unitree. La version EDU+ ouvre l'API pour le développement avancé.`,
      category: 'HUMANOID_ROBOT' as const,
      basePrice: 12600,
      leasePriceMonth: 420,
      requiresQuote: true,
      isFeatured: true,
      isActive: true,
      specifications: {
        height: '1,32 m',
        weight: '35 kg',
        dof: '23-43 DoF',
        speed: '2 m/s',
        battery: '9 000 mAh / 2h',
        ai: 'UnifoLM (Unitree Unified Large Model)',
        control: 'Force-position hybride',
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
            url: 'https://shop.unitree.com/cdn/shop/files/2_3769ceea-b323-4ebc-a1f4-e27a9624706b.jpg?v=1717575246',
            altText: 'Unitree G1 — vue de face',
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
      shortDescription: 'Quadrupède industriel — 60 kg, 6 m/s, 360 N·m, 5h d\'autonomie.',
      description: `Le B2 est le robot quadrupède industriel de référence d'Unitree. Avec un couple de 360 N·m par articulation (170 % de plus que la génération précédente), une vitesse de pointe de 6 m/s et une autonomie de plus de 5 heures (20+ km), il est conçu pour l'inspection industrielle, la surveillance de périmètre et la logistique en environnement difficile. Franchissement d'obstacle de 40 cm, escaliers en continu.`,
      category: 'QUADRUPED_ROBOT' as const,
      basePrice: 93000,
      leasePriceMonth: 2900,
      requiresQuote: true,
      isFeatured: true,
      isActive: true,
      specifications: {
        weight: '60 kg',
        payload: '40 kg (marche) / 120 kg (arrêt)',
        speed: '6 m/s',
        dof: '12 DoF',
        torque: '360 N·m',
        battery: '5h+ (non chargé) / 20+ km',
        obstacle: '40 cm',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/1_e701c6a6-1448-4504-a895-385a64140740.jpg?v=1718359410',
            altText: 'Unitree B2 Robot quadrupède industriel',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/2_3c98c0ec-fbb1-4537-9318-bf094eb4baff.jpg?v=1718359410',
            altText: 'Unitree B2 — inspection terrain',
            isPrimary: false,
            sortOrder: 1,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/3_0624501f-36fd-4b9a-8ea9-11a0a0eb7676.jpg?v=1718359411',
            altText: 'Unitree B2 — vue latérale',
            isPrimary: false,
            sortOrder: 2,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/4_bfae60ee-6862-466b-9cb5-142ba16027f6.jpg?v=1718359411',
            altText: 'Unitree B2 — vue arrière',
            isPrimary: false,
            sortOrder: 3,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/5_a20f8dec-d53d-4413-abe7-24af46d15f05.jpg?v=1718359410',
            altText: 'Unitree B2 — traversée d\'obstacle',
            isPrimary: false,
            sortOrder: 4,
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
      shortDescription: 'Quadrupède éducatif et de recherche — 15 kg, LiDAR 4D, IA embarquée.',
      description: `Le Go2 est le robot quadrupède polyvalent d'Unitree, équipé d'un LiDAR 4D L2, d'une navigation autonome ISS 2.0 et d'une reconnaissance hémisphérique 360°×96°. Batterie standard 8 000 mAh (en option 15 000 mAh pour 4h d'autonomie). Idéal pour la recherche, l'éducation et les démos terrain.`,
      category: 'QUADRUPED_ROBOT' as const,
      basePrice: 2600,
      leasePriceMonth: 90,
      requiresQuote: false,
      isFeatured: true,
      isActive: true,
      specifications: {
        height: '0,28 m (debout)',
        weight: '15 kg',
        payload: '7 kg',
        speed: '3,5 m/s',
        battery: '8 000 mAh / 1-2h (15 000 mAh optionnel)',
        dof: '12 DoF',
        lidar: 'Unitree 4D LiDAR L2',
        torque: '45 N·m',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/df9f333424ff6cc6164ce421b019fb94_a6f832b0-479e-4294-ac75-6516208b91f4.png?v=1718274082',
            altText: 'Unitree Go2 Robot quadrupède',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/21.png?v=1718274083',
            altText: 'Unitree Go2 — vue de face',
            isPrimary: false,
            sortOrder: 1,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/22.png?v=1718274083',
            altText: 'Unitree Go2 — navigation autonome',
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
      shortDescription: 'Bras robotique 6 axes — 740 mm de portée, précision ±0,1 mm.',
      description: `Le Z1 Pro est le bras robotique 6 axes d'Unitree, conçu pour la manipulation précise sur plateformes mobiles et postes fixes. Portée de 740 mm, charge utile de 2 à 5 kg, précision répétable de ±0,1 mm et précision de couple de ±0,2 N·m. Vitesse articulaire max 180°/s. Compatible avec les robots quadrupèdes Unitree.`,
      category: 'ROBOTIC_ARM' as const,
      basePrice: 14900,
      leasePriceMonth: 490,
      requiresQuote: false,
      isFeatured: false,
      isActive: true,
      specifications: {
        dof: '6 axes',
        payload: '2-5 kg',
        reach: '740 mm',
        precision: '±0,1 mm',
        torquePrecision: '±0,2 N·m',
        speed: '180°/s (max)',
        weight: '4,3 kg',
        interface: 'Ethernet / CAN',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/1_d81a16db-058a-44b2-b691-90a5280a4dfa.jpg?v=1718274550',
            altText: 'Unitree Z1 Pro Bras robotique 6 axes',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/2_f96c33bf-b39b-48fb-b93e-90ba78e92dea.jpg?v=1718274550',
            altText: 'Unitree Z1 Pro — vue latérale',
            isPrimary: false,
            sortOrder: 1,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/3_e795751c-68d0-4c55-ace1-6aeeb565a06d.jpg?v=1718274550',
            altText: 'Unitree Z1 Pro — détail articulaire',
            isPrimary: false,
            sortOrder: 2,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/4_9f33e402-28cf-41b3-b66e-009351d3983a.jpg?v=1718274550',
            altText: 'Unitree Z1 Pro — montage sur Go2',
            isPrimary: false,
            sortOrder: 3,
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
      shortDescription: 'Go2 version Pro — 4G/LTE, caméra 4K, navigation autonome avancée.',
      description: `Le Go2 Pro ajoute au Go2 standard la connectivité 4G/LTE embarquée, une caméra avant 4K et un traitement IA amélioré pour des missions autonomes en terrain extérieur. Parfait pour la télésurveillance, l'inspection à distance et les équipes terrain nécessitant une connexion permanente.`,
      category: 'QUADRUPED_ROBOT' as const,
      basePrice: 2600,
      leasePriceMonth: 90,
      requiresQuote: false,
      isFeatured: true,
      isActive: true,
      specifications: {
        height: '0,28 m (debout)',
        weight: '15 kg',
        payload: '7 kg',
        speed: '3,5 m/s',
        battery: '8 000 mAh / 1-2h',
        dof: '12 DoF',
        connectivity: '4G/LTE intégré',
        camera: '4K avant + LiDAR 4D L2',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/df9f333424ff6cc6164ce421b019fb94_a6f832b0-479e-4294-ac75-6516208b91f4.png?v=1718274082',
            altText: 'Unitree Go2 Pro — vue principale',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/23.png?v=1718274083',
            altText: 'Unitree Go2 Pro — en action',
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
      sku: 'UT-H1-2-001',
      name: 'Unitree H1-2',
      slug: 'unitree-h1-2',
      shortDescription: 'Humanoïde H1 génération 2 — mains Dex3-1, 27 DoF, manipulation bimanuelle.',
      description: `L'H1-2 est la version améliorée du H1, intégrant les mains dextres Dex3-1 (7 DoF par main) et 27 degrés de liberté totaux. Conçu pour la manipulation bimanuelle en environnement industriel : assemblage, tri, opérations en milieu contraint. Batterie de 864 Wh échangeable, couple max 360 N·m sur les jambes.`,
      category: 'HUMANOID_ROBOT' as const,
      basePrice: 120000,
      leasePriceMonth: 3700,
      requiresQuote: true,
      isFeatured: true,
      isActive: true,
      specifications: {
        height: '1,80 m',
        weight: '73 kg',
        dof: '27 DoF (7 par bras + 6 par jambe)',
        speed: '2 m/s',
        torque: '360 N·m (jambes) / 120 N·m (bras)',
        battery: '864 Wh (échangeable)',
        hands: 'Dex3-1 (7 DoF, capteurs tactiles)',
        payload: '10 kg (manipulation)',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/1_deeaa3cc-08f5-454f-bfcb-1a477b30adb4.jpg?v=1718359355',
            altText: 'Unitree H1-2 Robot humanoïde nouvelle génération',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/3_0241c65b-f618-4547-b0bf-ee05501922ae.jpg?v=1718359355',
            altText: 'Unitree H1-2 — manipulation bimanuelle',
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
      tags: {
        create: [{ tag: 'humanoïde' }, { tag: 'manipulation' }, { tag: 'industrie' }, { tag: 'nouvelle génération' }],
      },
    },
    {
      sku: 'UT-B2W-001',
      name: 'Unitree B2-W',
      slug: 'unitree-b2-w',
      shortDescription: 'B2 hybride pattes + roues — 75 kg, 6 m/s pattes / haute vitesse roues.',
      description: `Le B2-W est la version hybride du B2 industriel, combinant locomotion quadrupède et roues motorisées pour des missions mixtes. Il alterne entre pattes pour les terrains accidentés et roues pour les longues distances sur terrain plat. Batterie 2 250 Wh (45 Ah), charge utile 40 kg, certifié IP67.`,
      category: 'QUADRUPED_ROBOT' as const,
      basePrice: 93000,
      leasePriceMonth: 2900,
      requiresQuote: true,
      isFeatured: true,
      isActive: true,
      specifications: {
        weight: '75 kg',
        payload: '40 kg',
        speedLegs: '6 m/s (pattes)',
        dof: '12 DoF + 4 roues motorisées',
        battery: '2 250 Wh (45 Ah)',
        protection: 'IP67',
        locomotion: 'Hybride quadrupède + roues',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/1_8046f099-5c7f-48b9-bf2a-a9738b5e7adf.jpg?v=1718273940',
            altText: 'Unitree B2-W Robot hybride pattes et roues',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      tags: {
        create: [{ tag: 'quadrupède' }, { tag: 'roues' }, { tag: 'hybride' }, { tag: 'IP67' }, { tag: 'inspection' }],
      },
    },
    {
      sku: 'UT-GO2-AIR-001',
      name: 'Unitree Go2 Air',
      slug: 'unitree-go2-air',
      shortDescription: 'Go2 version Air — entrée de gamme, 15 kg, Wi-Fi, application mobile.',
      description: `Le Go2 Air est la version d'entrée de gamme du Go2, idéale pour les démonstrations, l'éducation et les premiers projets en robotique quadrupède. Il conserve les 12 degrés de liberté et la robustesse mécanique de la gamme Go2, avec une connectivité Wi-Fi et une application mobile iOS/Android incluse.`,
      category: 'QUADRUPED_ROBOT' as const,
      basePrice: 1490,
      leasePriceMonth: 55,
      requiresQuote: false,
      isFeatured: false,
      isActive: true,
      specifications: {
        height: '0,28 m (debout)',
        weight: '15 kg',
        payload: '3 kg',
        speed: '2,5 m/s',
        battery: '8 000 mAh / 1-2h',
        dof: '12 DoF',
        connectivity: 'Wi-Fi + Bluetooth',
        app: 'iOS / Android',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/df9f333424ff6cc6164ce421b019fb94_a6f832b0-479e-4294-ac75-6516208b91f4.png?v=1718274082',
            altText: 'Unitree Go2 Air — robot quadrupède entrée de gamme',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            url: 'https://shop.unitree.com/cdn/shop/files/24.png?v=1718274083',
            altText: 'Unitree Go2 Air — en action',
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
      tags: {
        create: [{ tag: 'quadrupède' }, { tag: 'éducation' }, { tag: 'débutant' }],
      },
    },
    {
      sku: 'UT-A1-001',
      name: 'Unitree A1',
      slug: 'unitree-a1',
      shortDescription: 'Quadrupède de recherche — 12 kg, 3,3 m/s, SDK ROS/ROS2 ouvert.',
      description: `L'A1 est la plateforme de recherche quadrupède d'Unitree, déployée dans plus de 50 pays dans des universités et laboratoires. 12 kg, 12 degrés de liberté, 3,3 m/s de vitesse max, couple de 33,5 N·m par articulation. API bas niveau ouverte, SDK ROS/ROS2 complet, ordinateur embarqué Intel NUC. Référence mondiale pour la recherche en locomotion et apprentissage par renforcement.`,
      category: 'QUADRUPED_ROBOT' as const,
      basePrice: 8400,
      leasePriceMonth: 290,
      requiresQuote: false,
      isFeatured: false,
      isActive: true,
      specifications: {
        height: '0,40 m (debout)',
        weight: '12 kg',
        payload: '5 kg',
        speed: '3,3 m/s',
        battery: '1-2,5h',
        dof: '12 DoF',
        torque: '33,5 N·m',
        processor: 'Intel NUC i5 embarqué',
        sdk: 'ROS / ROS2, Python, C++',
      },
      images: {
        create: [
          {
            url: 'https://oss-global-cdn.unitree.com/static/3f119f752fdf41b0a70544dbe06e31f6_2606x1376.png',
            altText: 'Unitree A1 — robot quadrupède de recherche',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      tags: {
        create: [{ tag: 'quadrupède' }, { tag: 'recherche' }, { tag: 'ROS2' }, { tag: 'laboratoire' }],
      },
    },
    {
      sku: 'UT-DEX3-001',
      name: 'Unitree Dex3-1',
      slug: 'unitree-dex3-1',
      shortDescription: 'Main robotique dextre — 7 DoF, 33 capteurs tactiles, 710 g.',
      description: `La Dex3-1 est la main robotique dextre d'Unitree conçue pour la manipulation fine. Elle intègre 7 degrés de liberté (3 pouce, 2 index, 2 majeur), 33 capteurs de pression tactile (version tactile) et une commande en couple et position. Vendue à l'unité. Compatible G1 EDU+ et H1-2 en configuration bimanuelle.`,
      category: 'ROBOTIC_ARM' as const,
      basePrice: 6050,
      leasePriceMonth: 200,
      requiresQuote: false,
      isFeatured: false,
      isActive: true,
      specifications: {
        fingers: '3 doigts (pouce, index, majeur)',
        dof: '7 DoF',
        payload: '500 g (prise)',
        tactile: '33 capteurs de pression',
        burstPower: '400 W (3s max)',
        voltage: '12-58 V',
        weight: '710 g',
        compatibility: 'G1 EDU+, H1-2',
      },
      images: {
        create: [
          {
            url: 'https://shop.unitree.com/cdn/shop/files/1_968fd08b-9aaf-4f32-b895-5c786285ee52.jpg?v=1717575256',
            altText: 'Unitree Dex3-1 — main robotique dextre sur G1',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      tags: {
        create: [{ tag: 'main robotique' }, { tag: 'manipulation' }, { tag: 'tactile' }, { tag: 'G1' }],
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

    // Seed inventory — accessories get 50 units, everything else (robots, arms) get 3
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
