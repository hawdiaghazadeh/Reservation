import { describe } from "node:test";
import { buildApp } from "../app";
import { afterAll, beforeAll, expect, it } from "vitest";




describe('Register', () => {
    let app: ReturnType<typeof buildApp>;
    let csrf_token : string

    beforeAll(async () => {
        app = buildApp();
        await app.ready();

        const csrf_response = await app.inject({
            method: "GET",
            url: '/api/csrf'
        })

        csrf_token = csrf_response.json().token as string;
    })


    afterAll(async () => {
        app.close()
    })

    it('should register a new user', async () => {
        
        const response = await app.inject({
            method: 'POST',
            url: '/api/register',
            headers: {
                'x-csrf-token': csrf_token
            },
            cookies: { csrf: csrf_token },
            payload: {
                email: 'test2@test.com',
                password: 'test123456',
                confirmpassword: 'test123456',
            },
        });

        expect(response.statusCode).toBe(200)
        const body = response.json()
        expect(body.status).toBe(1);
        expect(body.user.email).toBe('test2@test.com')

    });

});