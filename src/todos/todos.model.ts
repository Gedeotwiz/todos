import { Table, Column, Model, DataType } from "sequelize-typescript";

import { TaskStatus } from 'src/--share--/dto/enum/task-enum';

@Table({
   tableName: "todos",
  timestamps: false,
})
export class Todos extends Model<Todos>{
    @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    })
    declare id: string; 


  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare title: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare description: string;
  

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare time: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare createdAt: Date;

  
   @Column({
      type: DataType.ENUM(...Object.values(TaskStatus)),
      defaultValue: TaskStatus,
    })
    declare status: TaskStatus;
  
}