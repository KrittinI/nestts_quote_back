import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'UNKNOWN' })
  author: string;

  @Column()
  creator: number;

  @Column({ default: 0 })
  voted: number;
}
