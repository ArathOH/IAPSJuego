// src/utils/iapsLoader.ts
type Categoria = 'EXTREMAS' | 'MEDIAS' | 'NEUTRAS';
type IapsDictionary = Record<Categoria, string[]>;

const imagenes: IapsDictionary = {
  EXTREMAS: Object.values(
    import.meta.glob('../Imagenes/extremas/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
      eager: true,
      as: 'url',
    }),
  ) as string[],
  MEDIAS: Object.values(
    import.meta.glob('../Imagenes/medias/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
      eager: true,
      as: 'url',
    }),
  ) as string[],
  NEUTRAS: Object.values(
    import.meta.glob('../Imagenes/neutras/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
      eager: true,
      as: 'url',
    }),
  ) as string[],
};

export function getRandomIaps(cat: Categoria): string {
  const lista = imagenes[cat];
  if (lista.length === 0) {
    console.error(`⚠️  No se encontraron imágenes para ${cat}`);
    return '/imagenes/error.jpg';
  }
  return lista[Math.floor(Math.random() * lista.length)];
}

export function categoriaPorEmocion(
  emocion: 'negativa' | 'positiva' | 'neutral',
): Categoria {
  switch (emocion) {
    case 'negativa':
      return 'EXTREMAS';
    case 'positiva':
      return 'MEDIAS';
    default:
      return 'NEUTRAS';
  }
}
