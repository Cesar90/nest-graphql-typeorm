import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { List } from '../../lists/entities/list.entity';
import { Item } from './../../items/entities/item.entity';

@Entity('listItems')
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({type: 'numeric'})
  @Field(() => Number)
  quantity: number;

  @Column({type: 'boolean'})
  @Field(() => Boolean)
  completed: boolean;

  //Relationship
  @ManyToOne(() => List, (list) => list.listItem, {lazy:true})
  @Field(() => List)
  list: List

  @ManyToOne(() => Item, (item) => item.listItem, {lazy:true})
  @Field(() => Item)
  item: Item
}
