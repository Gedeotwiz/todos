
import { Entity, Column,PrimaryGeneratedColumn} from "typeorm";
import { UserRole } from "src/--share--/dto/enum/user-role-enum";

/**
 * User Entity
 */
@Entity("users")
export class User  {

  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  names: string;

  @Column({ unique: true })
  email: string;
  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER }) 
  role: UserRole;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: "timestamptz", default: null, nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true, default: true })
  activated: boolean;

}

