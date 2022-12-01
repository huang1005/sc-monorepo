export interface BaseEntity<K> {
  id?: K;

  createdBy?: string;
  createdAt?: Date;
  lastUpdatedBy?: string;
  lastUpdatedAt?: Date;
}
