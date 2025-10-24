import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "./User";
import { decimalTransformer } from "../utils/transformers";

export enum ProductType {
  CONSUMER_CREDIT = "Credito de Consumo",
  PAYROLL_LOAN = "Libranza Libre Inversión",
  CREDIT_CARD = "Tarjeta de Credito",
}

export enum FranchiseType {
  AMEX = "AMEX",
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
}

export enum SaleStatus {
  OPEN = "Abierto",
  IN_PROGRESS = "En Proceso",
  CLOSED = "Finalizado",
}

@Entity({ name: "sales" })
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "enum", enum: ProductType })
  product!: ProductType;

  @Column({ type: "enum", enum: SaleStatus, default: SaleStatus.OPEN })
  status!: SaleStatus;

  @Column({ name: "requested_amount", type: "numeric", precision: 15, scale: 2, transformer: decimalTransformer })
  requestedAmount!: number;

  @Column({ type: "enum", enum: FranchiseType, nullable: true })
  franchise?: FranchiseType | null;

  @Column({ name: "rate", type: "numeric", precision: 5, scale: 2, nullable: true, transformer: decimalTransformer })
  rate?: number | null;

  @ManyToOne(() => User, (user) => user.createdSales, { eager: true, nullable: false })
  @JoinColumn({ name: "created_by" })
  createdBy!: User;

  @ManyToOne(() => User, (user) => user.updatedSales, { nullable: true })
  @JoinColumn({ name: "updated_by" })
  updatedBy?: User | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
