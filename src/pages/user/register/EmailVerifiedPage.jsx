import { verifyEmail } from '@/api/authApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { ThemeSwitcher, ChristmasBackground } from '@/config/themeConfig';

// Theme-based styles
const getThemeStyles = (theme) => {
  switch (theme) {
    case 'christmas':
      return {
        bg: 'bg-transparent',
        cardBg: 'bg-white/90 backdrop-blur-sm border border-gray-200 shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
        title: 'text-[#c41e3a]',
        text: 'text-gray-600',
        button: 'bg-[#c41e3a] hover:bg-[#a51830]',
      };
    case 'dark':
      return {
        bg: 'bg-[#0B1120]',
        cardBg: 'bg-[#1E293B] border border-gray-700 shadow-[4px_4px_12px_rgba(0,0,0,0.3)]',
        title: 'text-white',
        text: 'text-gray-400',
        button: 'bg-[#635bff] hover:bg-[#5851e8]',
      };
    case 'portrait':
      return {
        bg: 'bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]',
        cardBg: 'bg-white/80 backdrop-blur-sm border border-pink-200 shadow-[4px_4px_12px_rgba(255,181,197,0.2)]',
        title: 'text-pink-600',
        text: 'text-gray-500',
        button: 'bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] hover:opacity-90',
      };
    case 'pop':
      return {
        bg: 'bg-slate-50',
        cardBg: 'bg-white border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]',
        title: 'text-black',
        text: 'text-gray-600',
        button: 'bg-pink-500 hover:bg-pink-600 border-2 border-black',
      };
    case 'classic':
      return {
        bg: 'bg-white',
        cardBg: 'bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(99,91,255,0.1)]',
        title: 'text-[#635bff]',
        text: 'text-gray-500',
        button: 'bg-[#635bff] hover:bg-[#5851e8]',
      };
    default:
      return {
        bg: 'bg-slate-50',
        cardBg: 'bg-white shadow-lg',
        title: 'text-gray-900',
        text: 'text-gray-500',
        button: 'bg-indigo-600 hover:bg-indigo-700',
      };
  }
};

export default function EmailVerifiedPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const token = searchParams.get('token');
  const { theme, setTheme } = useThemeStore();
  const themeStyles = getThemeStyles(theme);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const processVerification = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    processVerification();
  }, [token]);

  return (
    <div className={`min-h-screen ${themeStyles.bg}`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Christmas Background */}
      {theme === 'christmas' && <ChristmasBackground />}

      <div className="flex justify-center items-center min-h-screen">
        <Card className={`w-[400px] rounded-2xl ${themeStyles.cardBg}`}>
          <CardHeader>
            <CardTitle className={`text-center text-xl font-bold ${themeStyles.title}`}>
              {status === 'verifying' && '인증 확인 중...'}
              {status === 'success' && (theme === 'christmas' ? '🎄 이메일 인증 성공 🎉' : '이메일 인증 성공 🎉')}
              {status === 'error' && '인증 실패 ⚠️'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === 'verifying' && (
              <p className={themeStyles.text}>잠시만 기다려주세요.</p>
            )}

            {status === 'success' && (
              <>
                <p className={themeStyles.text}>
                  회원가입이 성공적으로 완료되었습니다.<br />
                  이제 로그인하여 서비스를 이용하실 수 있습니다.
                </p>
                <Button
                  onClick={() => navigate('/login')}
                  className={`w-full text-white ${themeStyles.button}`}
                >
                  로그인 페이지로 이동
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <p className="text-red-500">
                  유효하지 않거나 만료된 인증 링크입니다.<br />
                  다시 시도하거나 관리자에게 문의하세요.
                </p>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className={`w-full ${theme === 'dark' ? 'border-gray-700 text-white hover:bg-gray-800' : ''}`}
                >
                  메인으로 돌아가기
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}