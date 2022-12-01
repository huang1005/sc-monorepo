import { AdvancedCriteria } from './Criteria';

export class RQuery {
  //查询规则
  criteria?: AdvancedCriteria;

  //排序规则
  sort?: SortOrder[];

  //当前页, 从0开始
  pageIndex?: number;

  //指定一页查询多少条数据
  pageSize?: number;

  //指定查询哪些字段
  fields?: string[];

  constructor(
    criteria: AdvancedCriteria,
    sort?: SortOrder[],
    pageIndex?: number,
    pageSize?: number,
    fields?: string[]
  ) {
    this.criteria = criteria;
    this.sort = sort;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.fields = fields;
  }

  static of(
    criteria: AdvancedCriteria,
    sort?: SortOrder[],
    pageIndex?: number,
    pageSize?: number
  ): RQuery {
    return new RQuery(criteria, sort, pageIndex, pageSize);
  }

  static sortBy(field: string, direction: Direction): RQuery {
    return new RQuery({} as AdvancedCriteria, Sort.by(field, direction));
  }

  sortBy(field: string, direction: Direction) {
    this.sort = this.sort || [];
    this.sort.push({ field, direction });
    return this;
  }

  paging(page: number, size: number) {
    this.pageIndex = page;
    this.pageSize = size;
    return this;
  }
}

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SortOrder {
  field?: string;
  direction?: Direction;
}

export class Sort extends Array<SortOrder> {
  static by(field: string, direction: Direction): Sort {
    const sort = new Sort();
    sort.push({ field, direction });
    return sort;
  }

  and(field: string, direction: Direction): Sort {
    this.push({ field, direction });
    return this;
  }
}
