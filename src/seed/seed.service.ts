import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ItemsService } from './../items/items.service';
import { ListsService } from './../lists/lists.service';
import { ListItemService } from './../list-item/list-item.service';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { ListItem } from './../list-item/entities/list-item.entity';
import { List } from './../lists/entities/list.entity';
import { SEED_ITEMS, SEED_USERS, SEED_LISTS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,

    @InjectRepository(List)
    private readonly listRepository: Repository<List>,

    private readonly usersServices: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService
  ){
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(){
    if(this.isProd){
      throw new UnauthorizedException('We cannot run seed on Prod');
    }
    //Clean the database, delete everything
    await this.deleteDatabase();

    //Create users
    const user = await this.loadUsers();


    //Create items
    await this.loadItems(user);

    //Create List
    const list = await this.loadLists(user);

    //Create listItems
    const items = await this.itemsService.findAll(user, { limit: 15, offset: 0 }, {});
    await this.loadListItems(list,items);

    return true;
  }

  async deleteDatabase(){
    //ListItems
    await this.listItemRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();

    //Lists
    await this.listRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();

    //Delete items
    await this.itemsRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();
    //Delete users

    await this.usersRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute()
  }

  async loadUsers(): Promise<User>{
    const users = [];
    for(const user of SEED_USERS){
      users.push( await this.usersServices.create(user))
    }
    return users[0];
  }

  async loadItems(user: User): Promise<void>{
    const items = [];
    for(const item of SEED_ITEMS){
      items.push(this.itemsService.create(item, user));
    }
    await Promise.all(items)
  }

  async loadLists(user:User): Promise<List>{
    const lists = [];
    for(const list of SEED_LISTS){
      lists.push( await this.listsService.create(list,user))
    }
    return lists[0];
  }

  async loadListItems(list: List, items: Item[]){
    for(const item of items){
      this.listItemsService.create({
        quantity: Math.round(Math.random()*10),
        completed: Math.round(Math.random()*1)===0?false:true,
        listId: list.id,
        itemId: item.id
      })
    }
  }
}
