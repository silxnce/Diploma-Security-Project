import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('security_events')
export class SecurityEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string;

  @Column()
  ip!: string;

  @Column()
  method!: string;

  @Column()
  url!: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @Column({ type: 'text', nullable: true })
  payload?: string;

  @Column({ default: false })
  blocked!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
