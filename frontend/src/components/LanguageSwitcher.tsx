import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { user, updateLanguagePreference } = useAuth();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);

    // If user is authenticated, update backend preference
    if (user) {
      try {
        await updateLanguagePreference(lng);
      } catch (error) {
        console.error('Failed to update language preference:', error);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{t('common.language')}:</span>
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="en">{t('common.english')}</option>
        <option value="bg">{t('common.bulgarian')}</option>
      </select>
    </div>
  );
}
