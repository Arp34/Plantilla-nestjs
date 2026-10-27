import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, type Relation } from 'typeorm';
import { AppBaseEntity } from '../../common/entities/base.entity.js';
import { Role } from '../../common/enums/role.enum.js';
import type { Product } from '../../products/entities/product.entity.js';

@Entity('users')
export class User extends AppBaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  // Usa strings para la entidad destino y la propiedad inversa
  @OneToMany('Product', 'owner')
  products: Relation<Product[]>;
}