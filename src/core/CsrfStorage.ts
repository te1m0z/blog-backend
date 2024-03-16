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

interface ICSRF {
  readonly storage: TCsrfItem[];
  isValid(csrfToken: string): boolean;
  generate(): TCsrfItem;
  delete(csrfToken: string): void;
  deleteAllExpired(): void;
}

class CSRF implements ICSRF {
  
  readonly storage: TCsrfItem[] = []

  generate(): TCsrfItem {
    const csrfData: TCsrfItem = {
      token: uuid(),
      expires: Date.now() + 60 * 60 * 1000,
    }

    this.storage.push(csrfData)
    
    return csrfData
  }

  delete(csrfToken: string) {
    const csrfDeleteIndex = this.storage.findIndex(({ token }) => token === csrfToken)
    //
    if (csrfDeleteIndex === -1) return
    //
    this.storage.splice(csrfDeleteIndex, 1)
  }

  deleteAllExpired() {
    this.storage.forEach((tokenData, index) => {
      if (tokenData.expires < Date.now()) {
        this.storage.splice(index, 1)
      }
    })
  }

  isValid(csrfToken: string) {
    const csrfIsValidData = this.storage.find(({ token }) => token === csrfToken)
    //
    if (!csrfIsValidData) return false
    //
    return csrfIsValidData.expires >= Date.now()
  }
}

const CsrfStorage = new CSRF()

export { CsrfStorage }

