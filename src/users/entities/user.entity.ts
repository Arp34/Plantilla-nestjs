import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../common/entities/base.entity.js';
import { Role } from '../../common/enums/role.enum.js';

@Entity('users')
export class User extends AppBaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  // select: false -> the hash is never returned unless explicitly requested (login)
  // select: false -> el hash nunca se devuelve salvo que se pida explícitamente (login)
  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.TECHNICIAN })
  role: Role;
}
