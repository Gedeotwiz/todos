import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn} from 'typeorm';

 enum TaskStatus {
    ON_TRACK = 'ON-TRACK',
    DONE = 'DONE',
    OFF_TRACK = 'OFF-TRACK',
  }

@Entity()
export class Todos{
     @PrimaryGeneratedColumn()
  id: number;


  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  time: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum:TaskStatus,
    default: 'ON-TRACK',
  })
  status: string;
}