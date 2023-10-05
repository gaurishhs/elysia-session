interface SessionDataEntry {
    value: unknown;
    flash: boolean;
}

export interface SessionData {
    _data: Record<string, SessionDataEntry>;
    _expire: string | null;
    _delete: boolean;
    _accessed: string | null;
}

export class Session {
    private _cache: SessionData
    constructor() {
        this._cache = {
            _data: {},
            _expire: null,
            _delete: false,
            _accessed: null
        }
    }

    setCache(cache: SessionData) {
        this._cache = cache
    }

    getCache() {
        return this._cache
    }

    setExpire(expiration: string) {
        this._cache._expire = expiration
    }

    reUpdate(expiration?: number | null) {
        if (expiration) this.setExpire(new Date(Date.now() + expiration * 1000).toISOString())
    }

    delete() {
        this._cache._delete = true
    }

    valid() {
        return this._cache._expire === null || new Date(this._cache._expire).getTime() > Date.now()
    }

    updateAccessed() {
        this._cache._accessed = new Date().toISOString()
    }

    get(key: string) {
        const entry = this._cache._data[key]
        if (!entry) return null;
        const value = entry.value;
        if (entry.flash) delete this._cache._data[key];
        return value;
    }

    set(key: string, value: unknown) {
        this._cache._data[key] = {
            value,
            flash: false
        }
    }

    flash(key: string, value: unknown) {
        this._cache._data[key] = {
            value,
            flash: true
        }
    }
}