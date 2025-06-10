import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class SnakeToCamelNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    // 表名转换（可选）
    tableName(targetName: string, userSpecifiedName: string | undefined): string {
        return userSpecifiedName || snakeCase(targetName);
    }

    // 列名转换（关键）
    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        return customName || snakeCase(propertyName);
    }

    // 外键名转换（可选）
    joinColumnName(relationName: string, referencedColumnName: string): string {
        return snakeCase(`${relationName}_${referencedColumnName}`);
    }

    // 关联表字段名转换（可选）
    joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
        return snakeCase(`${tableName}_${columnName || propertyName}`);
    }
}