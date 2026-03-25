// Captcha verification helpers
export async function verifyHCaptcha(token: string): Promise<boolean> {
    const secret = process.env.HCAPTCHA_SECRET;

    if (!secret || !token) {
        return false;
    }

    try {
        const response = await fetch('https://hcaptcha.com/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                response: token,
                secret: secret
            })
        });

        const data = (await response.json()) as any;
        return data.success === true;
    } catch {
        console.error('Captcha verification error');
        return false;
    }
}

export async function verifyRecaptchaV3(token: string): Promise<boolean> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;

    if (!secret || !token) {
        return false;
    }

    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                secret: secret,
                response: token
            })
        });

        const data = (await response.json()) as any;
        // For v3, check score > 0.5
        return data.success === true && (data.score || 0) > 0.5;
    } catch {
        console.error('reCAPTCHA verification error');
        return false;
    }
}
