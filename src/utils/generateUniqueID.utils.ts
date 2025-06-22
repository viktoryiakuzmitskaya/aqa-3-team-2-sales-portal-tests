import { ObjectId } from 'bson';

export function generateUniqueId(): string {
  const newId = new ObjectId();
  return newId.toHexString();
}
