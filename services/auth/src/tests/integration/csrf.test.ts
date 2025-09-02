import { describe } from "vitest";
import { buildApp } from "../app";
import { beforeAll, afterAll, it, expect } from "vitest";

describe('CSRF', () => {
    let app: ReturnType<typeof buildApp>;

    beforeAll(async () => {
        app = buildApp();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should return a csrf token and set it in a cookie', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/csrf'
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body).toHaveProperty('token');
        expect(body.status).toBe(1);
        
        const csrfCookie = response.cookies.find(cookie => cookie.name === 'csrf')?.value as string;
        expect(csrfCookie).toBe(body.token);
    });

});
    
