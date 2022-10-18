import { AdvancedCriteria } from '../query/Criteria';
export interface UpdateItem<E> {
  /**
   * 需要修改的对象
   */
  item: E;

  /**
   * 指定要修改的字段列表
   */
  fields?: string[];
}

export interface UpdateItems<E> {
  /**
   * 需要修改的对象集合
   */
  items: E[];

  /**
   * 指定要修改的字段列表
   */
  fields?: string[];
}

export interface MergeItems<E> {
  /**
   * 需要修改的对象集合
   */
  items: E[];

  /**
   * 指定要修改的字段列表
   */
  fields?: string[];

  /**
   * 合并范围
   */
  range: AdvancedCriteria;
}
