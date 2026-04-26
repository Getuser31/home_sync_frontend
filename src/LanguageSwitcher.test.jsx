import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const enTranslation = {
    language_switcher: {
        en: "English",
        fr: "Français"
    }
};

const frTranslation = {
    language_switcher: {
        en: "English",
        fr: "Français"
    }
};

const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
    resources: {
        en: { translation: enTranslation },
        fr: { translation: frTranslation },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
});

beforeEach(() => {
    localStorage.clear();
    testI18n.changeLanguage('en');
});

const renderWithI18n = (component) => {
    return render(
        <I18nextProvider i18n={testI18n}>
            {component}
        </I18nextProvider>
    );
};

describe('LanguageSwitcher', () => {
    test('renders language button with current language flag', () => {
        renderWithI18n(<LanguageSwitcher />);
        const button = screen.getByLabelText('Select language');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('EN');
    });

    test('opens dropdown on click', () => {
        renderWithI18n(<LanguageSwitcher />);
        const button = screen.getByLabelText('Select language');
        fireEvent.click(button);
        expect(screen.getByText('Français')).toBeInTheDocument();
        expect(screen.getByText('English')).toBeInTheDocument();
    });

    test('switches language when clicking French option', () => {
        renderWithI18n(<LanguageSwitcher />);
        const button = screen.getByLabelText('Select language');
        fireEvent.click(button);
        fireEvent.click(screen.getByText('Français'));
        expect(testI18n.language).toBe('fr');
    });

    test('switches language when clicking English option', () => {
        testI18n.changeLanguage('fr');
        renderWithI18n(<LanguageSwitcher />);
        const button = screen.getByLabelText('Select language');
        fireEvent.click(button);
        fireEvent.click(screen.getByText('English'));
        expect(testI18n.language).toBe('en');
    });

    test('closes dropdown when clicking outside', () => {
        renderWithI18n(<LanguageSwitcher />);
        const button = screen.getByLabelText('Select language');
        fireEvent.click(button);
        expect(screen.getByText('Français')).toBeInTheDocument();

        fireEvent.mouseDown(document.body);
        expect(screen.queryByText('Français')).not.toBeInTheDocument();
    });

    test('highlights current language with checkmark', () => {
        renderWithI18n(<LanguageSwitcher />);
        fireEvent.click(screen.getByLabelText('Select language'));
        const englishButton = screen.getByText('English').closest('button');
        expect(englishButton?.querySelector('svg')).toBeInTheDocument();
    });
});
