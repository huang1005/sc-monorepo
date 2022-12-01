export enum Logic {
  OR = 'OR',
  AND = 'AND',
}

export enum CriteriaMatcher {
  /**
   * 等于null
   */
  ISNULL = 'ISNULL',

  /**
   * 不等于null
   */
  NOT_NULL = 'NOT_NULL',

  /**
   * 等于
   */
  EQ = 'EQ',

  /**
   * 不等于
   */
  NOT_EQ = 'NOT_EQ',

  /**
   * 大于 Greater Than的缩写
   */
  GT = 'GT',

  /**
   * 大于或等于 Greater Than Or Equal的缩写
   */
  GE = 'GE',

  /**
   * 小于 Less Than的缩写
   */
  LT = 'LT',

  /**
   * 小于 Less Than Or Equal的缩写
   */
  LE = 'LE',

  /**
   * 字符串包含
   */
  LIKE = 'LIKE',

  /**
   * 字符串不包含
   */
  NOT_LIKE = 'NOT_LIKE',

  /**
   * 字符串前缀匹配
   */
  PREFIX_LIKE = 'PREFIX_LIKE',

  /**
   * 字符串后缀匹配
   */
  SUFFIX_LIKE = 'SUFFIX_LIKE',

  /**
   * 介于最大值、最小值之间
   */
  BETWEEN = 'BETWEEN',

  /**
   * 不介于最大值、最小值之间
   */
  NOT_BETWEEN = 'NOT_BETWEEN',

  /**
   * 包含在集合值内
   */
  IN = 'IN',

  /**
   * 不包含在集合值内
   */
  NOT_IN = 'NOT_IN',
}

export class FieldCriteria {
  //字段名
  fieldName?: string;

  //匹配值
  values?: any[];

  //匹配条件
  matcher?: CriteriaMatcher;

  constructor(fieldName: string, values: any[], matcher: CriteriaMatcher) {
    this.fieldName = fieldName;
    this.values = values;
    this.matcher = matcher;
  }

  // static eq(field: string, value: any): FieldCriteria {
  //   const criteria = new FieldCriteria();
  //   criteria.fieldName = field;
  //   criteria.values = [value];
  //   criteria.matcher = CriteriaMatcher.EQ;
  //   return criteria;
  // }
}

export class AdvancedCriteria {
  //逻辑关系(AND|OR)
  logic?: Logic;

  //字段匹配规则
  singleCriterias?: FieldCriteria[];

  //复合匹配规则")
  boolCriterias?: AdvancedCriteria[];

  add(criteria: RCriteria) {
    if (criteria instanceof FieldCriteria) {
      this.singleCriterias = this.singleCriterias || [];
      this.singleCriterias.push(criteria as FieldCriteria);
    }

    if (criteria instanceof AdvancedCriteria) {
      this.boolCriterias = this.boolCriterias || [];
      this.boolCriterias.push(criteria as AdvancedCriteria);
    }
  }
}

export type RCriteria = AdvancedCriteria | FieldCriteria;

export class OrCriteria extends AdvancedCriteria {
  constructor() {
    super();
    this.logic = Logic.OR;
  }

  or(criteria: RCriteria) {
    this.logic = Logic.OR;
    super.add(criteria);
    return this;
  }
}

export class MustCriteria extends AdvancedCriteria {
  constructor() {
    super();
    this.logic = Logic.AND;
  }

  must(criteria: RCriteria) {
    this.logic = Logic.AND;
    super.add(criteria);
    return this;
  }
}
