import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../common/entities/base.entity.js';

@Entity('workshops')
export class Workshop extends AppBaseEntity {
  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ length: 200 })
  address: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
