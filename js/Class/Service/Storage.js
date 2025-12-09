/**
 * Klasa do zarządzania danymi w przeglądarce:
 *  localStorage, sessionStorage i cookies.
 */

export class Storage {
    
    /** Ustawia wartość w localStorage 
     * @param {string} key klucz
     * @param {string} value wartość
    */
    static setLocalItem(key, value) {
        localStorage.setItem(key, value);
    }
    /** Pobiera wartość z localStorage
     * @param {string} key klucz
     * @returns {string|null} wartość lub null jeśli nie istnieje
    */
    static getLocalItem(key) {
        return localStorage.getItem(key);
    }
    /** Usuwa wartość z localStorage
     * @param {string} key klucz
    */
    static removeLocalItem(key) {
        localStorage.removeItem(key);
    }
    /** Ustawia wartość w sessionStorage
     * @param {string} key klucz
     * @param {string} value wartość
    */
    static setSessionItem(key, value) {
        sessionStorage.setItem(key, value);
    }
    /** Pobiera wartość z sessionStorage
     * @param {string} key klucz
     * @returns {string|null} wartość lub null jeśli nie istnieje
    */
    static getSessionItem(key) {
        return sessionStorage.getItem(key);
    }
    /** Usuwa wartość z sessionStorage
     * @param {string} key klucz
    */
    static removeSessionItem(key) {
        sessionStorage.removeItem(key);
    }
    /** Ustawia wartość w cookies
     * @param {string} name nazwa ciasteczka
     * @param {string} value wartość
     * @param {number} days liczba dni ważności
    */
    static setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    /** Pobiera wartość z cookies
     * @param {string} name nazwa ciasteczka
     * @returns {string|null} wartość lub null jeśli nie istnieje
    */
    static getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    /** Usuwa wartość z cookies
     * @param {string} name nazwa ciasteczka
    */
    static eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }

}