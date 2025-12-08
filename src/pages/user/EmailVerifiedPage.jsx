import { verifyEmail } from '@/api/authApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function EmailVerifiedPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const token = searchParams.get('token');

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
    <div className="flex justify-center items-center h-screen bg-slate-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            {status === 'verifying' && '인증 확인 중...'}
            {status === 'success' && '이메일 인증 성공 🎉'}
            {status === 'error' && '인증 실패 ⚠️'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'verifying' && (
            <p className="text-gray-500">잠시만 기다려주세요.</p>
          )}

          {status === 'success' && (
            <>
              <p className="text-gray-600">
                회원가입이 성공적으로 완료되었습니다.<br />
                이제 로그인하여 서비스를 이용하실 수 있습니다.
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
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
                className="w-full"
              >
                메인으로 돌아가기
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}