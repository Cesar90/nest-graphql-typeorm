import { ObjectType, Field, Int, ID, Float} from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, OneToMany } from 'typeorm'
import { ListItem } from '../../list-item/entities/list-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field( () => String)
  name: string;
  
  // @Column()
  // @Field( () => Float)
  // quantity: number;

  @Column({ nullable: true })
  @Field( () => String, { nullable:true })
  quantityUnits?: string; //g, ml, kg, tsp

  //stores
  //user
  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field(() => User)
  user: User;
  
  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Field(() => [ListItem])
  listItem: ListItem[]
}
