/*
 * Core Security
 * Version: 1.0
 *
 * Neutral security primitives for the generic framework.
 * No application-specific rules or domain logic are included here.
 */

(() => {
    'use strict';

    const DEFAULT_ALLOWED_ORIGINS = ['localhost', '127.0.0.1'];

    const normalizeOrigin = (origin) => {
        if (typeof origin !== 'string') {
            return '';
        }
        return origin.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '').toLowerCase();
    };

    const CoreSecurity = {
        allowedOrigins: [...DEFAULT_ALLOWED_ORIGINS],

        registerAllowedOrigin(origin) {
            const normalized = normalizeOrigin(origin);
            if (!normalized) {
                return false;
            }

            if (!this.allowedOrigins.includes(normalized)) {
                this.allowedOrigins.push(normalized);
            }
            return true;
        },

        isOriginAllowed(origin) {
            const normalized = normalizeOrigin(origin);
            if (!normalized) {
                return false;
            }
            return this.allowedOrigins.includes(normalized) || this.allowedOrigins.includes('*');
        },

        sanitizeText(value, { maxLength = 2048, trim = true } = {}) {
            if (value === null || typeof value === 'undefined') {
                return '';
            }

            let text = String(value);
            if (trim) {
                text = text.trim();
            }

            if (maxLength > 0 && text.length > maxLength) {
                text = text.slice(0, maxLength);
            }

            return text
                .replace(/<script[\s\S]*?<\/script>/gi, '')
                .replace(/<[^>]+>/g, '')
                .replace(/[\u0000-\u001F\u007F]/g, '');
        },

        generateToken(length = 32) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const bytes = new Uint8Array(length);
            if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
                crypto.getRandomValues(bytes);
            } else {
                for (let index = 0; index < length; index += 1) {
                    bytes[index] = Math.floor(Math.random() * 256);
                }
            }

            let token = '';
            for (let index = 0; index < length; index += 1) {
                token += chars[bytes[index] % chars.length];
            }
            return token;
        },

        async hash(value) {
            const input = typeof value === 'string' ? value : JSON.stringify(value);
            if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
                const encoded = new TextEncoder().encode(input);
                const digest = await crypto.subtle.digest('SHA-256', encoded);
                return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
            }

            let hash = 0;
            for (let index = 0; index < input.length; index += 1) {
                hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
            }
            return String(Math.abs(hash));
        },

        validateInput(value, { maxLength = 2048, allowEmpty = false } = {}) {
            if (value === null || typeof value === 'undefined') {
                return !allowEmpty ? '' : null;
            }

            const sanitized = this.sanitizeText(value, { maxLength, trim: true });
            if (!allowEmpty && sanitized.length === 0) {
                return '';
            }

            return sanitized;
        }
    };

    if (!window.CoreSecurity) {
        window.CoreSecurity = CoreSecurity;
    }
})();
