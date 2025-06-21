export enum ESortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ESortProductsFields {
  NAME = 'name',
  PRICE = 'price',
  MANUFACTURER = 'manufacturer',
  CREATED_ON = 'createdOn',
}

export function getRandromEnumValue<T extends object>(enumObject: T): T[keyof T] {
  const values = Object.values(enumObject);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}
