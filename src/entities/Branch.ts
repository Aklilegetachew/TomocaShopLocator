import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm"

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  address!: string

  @Column("double")
  latitude!: number

  @Column("double")
  longitude!: number

  @Column({ nullable: true })
  photo?: string

  @CreateDateColumn()
  createdAt!: Date
}
