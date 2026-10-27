import { Column, Entity, JoinColumn, OneToOne, type Relation } from 'typeorm';
import { AppBaseEntity } from '../../common/entities/base.entity.js';
import type { User } from '../../users/entities/user.entity.js';

@Entity('mechanics')
export class Mechanic extends AppBaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 80 })
  specialty: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  // OneToOne + JoinColumn: the FK user_id lives in this table and TypeORM makes it unique (one login per mechanic)
  // OneToOne + JoinColumn: la FK user_id vive en esta tabla y TypeORM la hace única (un login por mecánico)
  @OneToOne('User', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User> | null;
}
