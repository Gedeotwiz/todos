import { Table, Column, Model, DataType } from "sequelize-typescript";
import { UserRole } from "src/--share--/dto/enum/user-role-enum";


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
  declare names: string;

   @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.USER,
  })
  declare role: UserRole;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare refreshToken: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare verifiedAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare activated: boolean;
}
