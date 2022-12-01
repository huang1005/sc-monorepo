import {
  CriteriaMatcher,
  FieldCriteria,
  MustCriteria,
  OrCriteria,
  RCriteria,
} from './Criteria';

export function or(criteria: RCriteria): OrCriteria {
  return new OrCriteria().or(criteria);
}

export function must(criteria: RCriteria): MustCriteria {
  return new MustCriteria().must(criteria);
}

/**
 * 构建完整匹配查询条件的静态工厂方法
 *
 * @param <T>   参数value的泛型， 目前只支持基本数据类型，和java.sql.Timestamp
 * @param field 数据库列名
 * @param value 检索该字段的匹配值
 * @return 完整匹配查询条件对象
 */
export function eq(field: string, value): FieldCriteria {
  return new FieldCriteria(field, [value], CriteriaMatcher.EQ);
}

/**
 * 构建不等于查询条件的静态工厂方法
 *
 * @param <T>   参数value的泛型， 目前只支持基本数据类型，和java.sql.Timestamp
 * @param field 数据库列名
 * @param value 检索该字段的匹配值
 * @return 完整匹配查询条件对象
 */
export function neq(field, value) {
  return new FieldCriteria(field, [value], CriteriaMatcher.NOT_EQ);
}

/**
 * 构建大于查询条件的静态工厂方法
 *
 * @param <T>   参数value的泛型， 目前只支持基本数据类型，和java.sql.Timestamp
 * @param field 数据库列名
 * @param value 检索该字段的匹配值
 * @return 完整匹配查询条件对象
 */
export function gt(field, value) {
  return new FieldCriteria(field, [value], CriteriaMatcher.GT);
}

/**
 * 构建小于查询条件的静态工厂方法
 *
 * @param <T>   参数value的泛型， 目前只支持基本数据类型，和java.sql.Timestamp
 * @param field 数据库列名
 * @param value 检索该字段的匹配值
 * @return 完整匹配查询条件对象
 */
export function lt(field, value) {
  return new FieldCriteria(field, [value], CriteriaMatcher.LT);
}

/**
 * 构建大于或等于查询条件的静态工厂方法
 *
 * @param <T>   参数value的泛型， 目前只支持基本数据类型，和java.sql.Timestamp
 * @param field 数据库列名
 * @param value 检索该字段的匹配值
 * @return 完整匹配查询条件对象
 */
export function ge(field, value) {
  return new FieldCriteria(field, [value], CriteriaMatcher.GE);
}

/**
 * 构建小于或等于查询条件的静态工厂方法
 *
 * @param <T>   参数value的泛型， 目前只支持基本数据类型，和java.sql.Timestamp
 * @param field 数据库列名
 * @param value 检索该字段的匹配值
 * @return 完整匹配查询条件对象
 */
export function le(field, value) {
  return new FieldCriteria(field, [value], CriteriaMatcher.LE);
}

/**
 * 构建前缀查找检索条件的静态工厂方法
 *
 * @param field  数据库列名
 * @param inputs 检索该字段的匹配值
 * @return 查询条件对象
 */
export function prefixLike(field, ...inputs: string[]) {
  return new FieldCriteria(field, inputs, CriteriaMatcher.PREFIX_LIKE);
}

/**
 * 构建后缀匹配查找检索条件的静态工厂方法
 *
 * @param field  数据库列名
 * @param inputs 检索该字段的匹配值
 * @return 查询条件对象
 */
export function suffixLike(field, ...inputs: string[]) {
  return new FieldCriteria(field, inputs, CriteriaMatcher.SUFFIX_LIKE);
}

/**
 * 构建模糊查找检索条件的静态工厂方法
 *
 * @param field  数据库列名
 * @param inputs 检索该字段的匹配值
 * @return 查询条件对象
 */
export function fuzzyLike(field, ...inputs: string[]) {
  return new FieldCriteria(field, inputs, CriteriaMatcher.LIKE);
}

/**
 * 构建范围检索条件的静态工厂方法
 *
 * @param <T>   参数value的泛型， 目前只支持基本数据类型，和java.sql.Timestamp
 * @param field 数据库列名
 * @param from  检索区间的最小值，属于闭区间内
 * @param to    检索区间的最大值，属于闭区间内
 * @return 查询条件对象
 */
export function range(field, from, to) {
  return new FieldCriteria(field, [from, to], CriteriaMatcher.BETWEEN);
}

/**
 * 构建field in检索条件的静态工厂方法
 *
 * @param field  数据库列名
 * @param values 匹配值域
 * @return 查询条件对象
 */
export function inValues(field, values: any[]) {
  return new FieldCriteria(field, values, CriteriaMatcher.IN);
}
