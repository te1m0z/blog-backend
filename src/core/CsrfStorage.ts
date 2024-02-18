import { v4 as uuid } from 'uuid'

/**
 * CSRF Tokens Storage stucture:
 * "SESSION_ID": [
 *    {
 *      "token": "CSRF_TOKEN_ID",
 *      "expires": Date.now() + 60 * 60 * 1000
 *    }
 * ]
 */

type TCsrfItem = {
  token: string;
  expires: number;
};

type TCsrfStorage = {
  [key: string]: TCsrfItem[];
};

interface ICSRF {
  readonly storage: TCsrfStorage;
  isValid(userSessionId: string, csrfToken: string): boolean;
  get(userSessionId: string): TCsrfItem[];
  generate(userSessionId: string): TCsrfItem;
  delete(userSessionId: string, csrfToken: string): void;
  deleteAllExpired(): void;
}

class CSRF implements ICSRF {
  //
  readonly storage: TCsrfStorage = {}

  /**
   * Вернуть набор CSRF токенов юзера по его Session ID
   * в противном случае пустой массив
   * @param {string} userSessionId - ID сессии
   * @returns {TCsrfItem[]}
   */
  get(userSessionId: string): TCsrfItem[] {
    //
    if (!this.storage[userSessionId]) {
      this.storage[userSessionId] = []
    }
    //
    return this.storage[userSessionId]
  }

  /**
   * Сгенерировать уникальный CSRF токен
   * @param {string} userSessionId - ID сессии
   * @returns {TCsrfItem}
   */
  generate(userSessionId: string): TCsrfItem {
    //
    const userCsrfTokens = this.get(userSessionId)
    //
    const csrfData: TCsrfItem = {
      token: uuid(),
      expires: Date.now() + 60 * 60 * 1000,
    }
    //
    userCsrfTokens.push(csrfData)
    //
    return csrfData
  }

  delete(userSessionId: string, csrfToken: string) {
    //
    const userCsrfTokens = this.get(userSessionId)
    //
    if (userCsrfTokens.length === 0) return
    // find
    const csrfDeleteIndex = userCsrfTokens.findIndex(({ token }) => token === csrfToken)
    //
    if (csrfDeleteIndex === -1) return
    //
    userCsrfTokens.splice(csrfDeleteIndex, 1)
  }

  deleteAllExpired() {
    for (const userCsrfTokens of Object.values(this.storage)) {
      //
      const filteredTokens = userCsrfTokens.filter(
        ({ expires }) => expires < Date.now(),
      )
      //
      userCsrfTokens.splice(0, userCsrfTokens.length, ...filteredTokens)
    }
  }

  isValid(userSessionId: string, csrfToken: string) {
    //
    const userCsrfTokens = this.get(userSessionId)
    //
    if (!userCsrfTokens.length) return false
    // find
    const csrfIsValidData = userCsrfTokens.find(
      ({ token }) => token === csrfToken,
    )
    //
    if (!csrfIsValidData) return false
    //
    return csrfIsValidData.expires >= Date.now()
  }
}

const CsrfStorage = new CSRF()

export { CsrfStorage }

