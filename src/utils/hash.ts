// src/common/utils/hash.util.ts
import * as bcrypt from 'bcrypt';

export class HashUtil {
  /**
   * 生成哈希密码
   * @param password 明文密码
   * @param saltRounds 盐值轮次 (默认 10)
   */
  static async hashPassword(
    password: string,
    saltRounds = 10
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  /**
   * 验证密码是否匹配
   * @param password 明文密码
   * @param hashedPassword 已哈希的密码
   */
  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}