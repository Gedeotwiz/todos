import { Table, Column, Model, DataType,HasMany} from "sequelize-typescript";
import { UserRole } from "src/--share--/dto/enum/user-role-enum";
import { Todos } from "src/todos/todos.model";


@Table({
  tableName: "users",
  timestamps: false,
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
   declare id: string; 

   @Column({
    type: DataType.STRING,
    allowNull: false,
  })
   names: string;

   @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
   email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
   phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
   password: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.USER,
  })
   role: UserRole;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
   refreshToken: string;

  @HasMany(() => Todos)  
  todos: Todos[];

  @Column({
    type: DataType.DATE,
    allowNull: true,

  })
   verifiedAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
   activated: boolean;
}
