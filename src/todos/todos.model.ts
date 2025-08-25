import { Table, Column, Model, DataType,BelongsTo,ForeignKey, AllowNull } from "sequelize-typescript";

import { TodoStatus } from 'src/--share--/dto/enum/task-enum';
import { User } from "src/user/user.model";

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
    type: DataType.ENUM('ON-TRACK','DONE','OFF-TRACK'),
    defaultValue: TodoStatus.ON_TRACK,
  })
  declare status: TodoStatus;

  
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;   

  @BelongsTo (() => User)  
  user: User;
  
}