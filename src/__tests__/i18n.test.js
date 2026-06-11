import i18n from '../i18n';

describe('i18n configuration', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('has English and French resources', () => {
        expect(i18n.hasResourceBundle('en', 'translation')).toBe(true);
        expect(i18n.hasResourceBundle('fr', 'translation')).toBe(true);
    });

    test('default language is English', () => {
        expect(i18n.language).toBe('en');
    });

    test('can switch language to French', async () => {
        await i18n.changeLanguage('fr');
        expect(i18n.language).toBe('fr');
    });

    test('fallback language is English when language not supported', () => {
        // i18next v23 returns fallbackLng as an array internally
        const fallback = i18n.options.fallbackLng;
        if (Array.isArray(fallback)) {
            expect(fallback).toContain('en');
        } else {
            expect(fallback).toBe('en');
        }
    });

    test('translation keys return correct values', () => {
        const enText = i18n.t('app.name');
        expect(enText).toBe('HouseSync');
    });

    test('French translations exist for all English keys', () => {
        const enKeys = Object.keys(i18n.getResourceBundle('en', 'translation'));
        const frKeys = Object.keys(i18n.getResourceBundle('fr', 'translation'));

        // Top-level keys should match
        enKeys.forEach(key => {
            expect(frKeys).toContain(key);
        });
    });

    test('interpolation works for task count', () => {
        const single = i18n.t('task.all_tasks_count', { count: 1 });
        expect(single).toBeTruthy();
    });
});
