import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'UNKNOWN' })
  creator: string;

  @Column({ default: 0 })
  voted: number;
}
