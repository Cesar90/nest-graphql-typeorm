import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { Repository } from 'typeorm';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { ListItem } from './entities/list-item.entity';
import { List } from '../lists/entities/list.entity';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>
  ){

  }

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const {itemId, listId, ...rest} = createListItemInput;
    console.log(itemId);
    console.log(listId);
    console.log(rest);
    const newLisItem = this.listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId }
    });
    await this.listItemRepository.save(newLisItem);
    return this.findOne(newLisItem.id);
  }

  async findAll(list: List, paginationArgs:PaginationArgs,searchArgs:SearchArgs): Promise<ListItem[]> {
      const {limit,offset} = paginationArgs;
      const {search} = searchArgs;
      const queryBuilder = this.listItemRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`,{ listId: list.id });

    if(search){
      queryBuilder.andWhere('LOWER(name) like :name',{name:`%${search.toLowerCase()}%`})
    }
    
    return queryBuilder.getMany();
  }

  async countListItemByList(list: List){
    return this.listItemRepository.count({
      where: { list: { id: list.id } }
    });
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = this.listItemRepository.findOneBy({id});
    if(!listItem){
      throw new NotFoundException(`List item with id ${id} not found`);
    }
    return listItem;
  }

  async update(
    id: string, updateListItemInput: UpdateListItemInput
  ):Promise<ListItem>{
    const {listId,itemId,...rest} = updateListItemInput;
    // console.log(rest);
    // const listItem = await this.listItemRepository.preload({
    //   ...rest,
    //   list: { id: listId },
    //   item: { id: itemId }
    // })

    // if(!listItem){
    //   throw new NotFoundException(`List item with id ${id} not found`);
    // }
    // return this.listItemRepository.save(listItem);
    const queryBuilder = this.listItemRepository.createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', {id})

    if(listId){
      queryBuilder.set({list:{id:listId}})
    }
    if(itemId){
      queryBuilder.set({list:{id:itemId}})
    }
    await queryBuilder.execute();
    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
