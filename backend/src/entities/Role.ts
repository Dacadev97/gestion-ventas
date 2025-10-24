import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { User } from "./User";

export enum RoleName {
  ADMIN = "Administrador",
  ADVISOR = "Asesor",
}

@Entity({ name: "roles" })
@Unique(["name"])
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "enum", enum: RoleName })
  name!: RoleName;

  @OneToMany(() => User, (user: User) => user.role)
  users!: User[];
}
