import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

import { Role } from "./Role";
import { Sale } from "./Sale";

@Entity({ name: "users" })
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50 })
  name!: string;

  @Column({ type: "varchar", length: 50 })
  email!: string;

  @Column({ type: "varchar", length: 100, select: false })
  password!: string;

  @ManyToOne(() => Role, (role: Role) => role.users, { eager: true, nullable: false })
  @JoinColumn({ name: "role_id" })
  role!: Role;

  @OneToMany(() => Sale, (sale: Sale) => sale.createdBy)
  createdSales!: Sale[];

  @OneToMany(() => Sale, (sale: Sale) => sale.updatedBy)
  updatedSales!: Sale[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
