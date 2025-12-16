import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, AlertCircle, Loader2, Shield } from 'lucide-react';
import useBankVerificationStore from '@/store/bankVerificationStore';
import BankSelector from './BankSelector';
import { requestVerification } from '@/api/bankAccountApi';
import { useThemeStore } from '@/store/themeStore';

// 테마별 스타일
const bankSelectionThemeStyles = {
    default: {
        cardBg: '',
        iconBg: 'bg-gradient-to-br from-orange-400 to-orange-600',
        iconShadow: 'shadow-lg shadow-orange-200',
        border: 'border-0',
        shadow: 'shadow-lg',
        inputBorder: 'border-2 border-slate-200 focus:border-orange-500 focus:ring-orange-100',
        infoBg: 'bg-slate-50',
        infoIconColor: 'text-slate-400',
        infoText: 'text-slate-500',
        accentText: 'text-orange-600',
        buttonBg: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
        buttonShadow: 'shadow-lg shadow-orange-200',
        titleText: 'text-slate-800',
        subtitleText: 'text-slate-500',
        labelText: 'text-slate-700',
    },
    christmas: {
        cardBg: '',
        iconBg: 'bg-gradient-to-br from-red-800 to-green-800',
        iconShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        border: 'border border-gray-200',
        shadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        inputBorder: 'border border-gray-200 focus:border-red-800 focus:ring-red-100',
        infoBg: 'bg-red-50',
        infoIconColor: 'text-red-400',
        infoText: 'text-red-700',
        accentText: 'text-red-800',
        buttonBg: 'bg-gradient-to-r from-red-800 to-green-800 hover:from-red-900 hover:to-green-900',
        buttonShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        titleText: 'text-slate-800',
        subtitleText: 'text-slate-500',
        labelText: 'text-slate-700',
    },
    dark: {
        cardBg: 'bg-[#1E293B]',
        iconBg: 'bg-gradient-to-br from-[#635bff] to-[#00d4ff]',
        iconShadow: 'shadow-lg shadow-[#635bff]/25',
        border: 'border border-gray-700',
        shadow: 'shadow-lg',
        inputBorder: 'border border-gray-600 bg-gray-800 text-white focus:border-[#635bff] focus:ring-[#635bff]/20',
        infoBg: 'bg-gray-800',
        infoIconColor: 'text-[#635bff]',
        infoText: 'text-gray-300',
        accentText: 'text-[#635bff]',
        buttonBg: 'bg-gradient-to-r from-[#635bff] to-[#00d4ff] hover:from-[#5851e8] hover:to-[#00c0e8]',
        buttonShadow: 'shadow-lg shadow-[#635bff]/25',
        titleText: 'text-white',
        subtitleText: 'text-gray-400',
        labelText: 'text-gray-300',
    },
    pop: {
        cardBg: '',
        iconBg: 'bg-gradient-to-br from-pink-400 to-pink-600',
        iconShadow: 'shadow-lg',
        border: 'border-2 border-black',
        shadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
        inputBorder: 'border-2 border-black focus:border-pink-500 focus:ring-pink-100',
        infoBg: 'bg-pink-50',
        infoIconColor: 'text-pink-400',
        infoText: 'text-pink-600',
        accentText: 'text-pink-600',
        buttonBg: 'bg-pink-500 hover:bg-pink-600',
        buttonShadow: 'shadow-lg',
        titleText: 'text-slate-800',
        subtitleText: 'text-slate-500',
        labelText: 'text-slate-700',
    },
};

/**
 * Step 1: 은행 및 계좌 정보 입력
 */
export default function BankSelectionStep() {
    const { theme } = useThemeStore();
    const themeStyle = bankSelectionThemeStyles[theme] || bankSelectionThemeStyles.default;
    const {
        formData,
        setFormData,
        setStep,
        setVerificationSuccess,
        setError,
        error,
        clearError
    } = useBankVerificationStore();

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 은행 선택 핸들러
    const handleBankChange = ({ bankCode, bankName }) => {
        setFormData({ bankCode, bankName });
        clearError();
    };

    // 계좌번호 입력 (숫자만)
    const handleAccountNumChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setFormData({ accountNum: value });
        clearError();
    };

    // 예금주명 입력
    const handleAccountHolderChange = (e) => {
        setFormData({ accountHolder: e.target.value });
        clearError();
    };

    // 유효성 검사
    const isValid = () => {
        return (
            formData.bankCode &&
            formData.accountNum.length >= 10 &&
            formData.accountHolder.length >= 2
        );
    };

    // 1원 인증 요청
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValid()) return;

        setIsSubmitting(true);
        clearError();

        try {
            // API 호출
            const response = await requestVerification(
                formData.bankCode,
                formData.accountNum,
                formData.accountHolder
            );

            // 응답 처리
            if (response.success !== false) {
                // 처리 중 단계로 이동 (4초 딜레이 후 인증 단계로)
                setStep('processing');

                // 4초 후 인증 데이터 설정 및 인증 단계로 이동
                setTimeout(() => {
                    setVerificationSuccess({
                        bankTranId: response.bankTranId,
                        maskedAccount: response.maskedAccount || maskAccountNumber(formData.accountNum),
                        expiresAt: response.expiresAt || new Date(Date.now() + 10 * 60 * 1000).toISOString(),
                        verifyCode: response.printContent || response.verifyCode || ''
                    });
                }, 4000);
            } else {
                setError(response.message || '인증 요청에 실패했습니다.');
            }
        } catch (err) {
            console.error('인증 요청 실패:', err);
            setError(err.response?.data?.message || err.message || '인증 요청에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 계좌번호 마스킹
    const maskAccountNumber = (num) => {
        if (num.length < 6) return num;
        const prefix = num.slice(0, 3);
        const suffix = num.slice(-3);
        return `${prefix}-***-***${suffix}`;
    };

    return (
        <Card className={`${themeStyle.border} ${themeStyle.shadow} ${themeStyle.cardBg}`}>
            <CardHeader className="text-center pb-2">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className={`mx-auto w-16 h-16 ${themeStyle.iconBg} rounded-full flex items-center justify-center mb-4 ${themeStyle.iconShadow}`}
                >
                    <Building2 className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className={`text-xl font-bold ${themeStyle.titleText}`}>
                    정산받을 계좌를 등록해주세요
                </CardTitle>
                <CardDescription className={themeStyle.subtitleText}>
                    1원 인증을 통해 본인 계좌를 확인합니다
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* 에러 메시지 */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </motion.div>
                    )}

                    {/* 은행 선택 */}
                    <div className="space-y-2">
                        <Label className={`text-sm font-medium ${themeStyle.labelText}`}>
                            은행 선택
                        </Label>
                        <BankSelector
                            value={formData.bankCode}
                            onChange={handleBankChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* 계좌번호 */}
                    <div className="space-y-2">
                        <Label className={`text-sm font-medium ${themeStyle.labelText}`}>
                            계좌번호
                        </Label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            value={formData.accountNum}
                            onChange={handleAccountNumChange}
                            placeholder="계좌번호 입력 (숫자만)"
                            maxLength={20}
                            disabled={isSubmitting}
                            className={`h-12 text-lg rounded-xl ${themeStyle.inputBorder}`}
                        />
                        <p className={`text-xs ${themeStyle.subtitleText}`}>
                            - 없이 숫자만 입력하세요
                        </p>
                    </div>

                    {/* 예금주명 */}
                    <div className="space-y-2">
                        <Label className={`text-sm font-medium ${themeStyle.labelText}`}>
                            예금주명
                        </Label>
                        <Input
                            type="text"
                            value={formData.accountHolder}
                            onChange={handleAccountHolderChange}
                            placeholder="예금주명 입력"
                            maxLength={20}
                            disabled={isSubmitting}
                            className={`h-12 text-lg rounded-xl ${themeStyle.inputBorder}`}
                        />
                    </div>

                    {/* 안내 문구 */}
                    <div className={`flex items-start gap-2 p-3 ${themeStyle.infoBg} rounded-xl`}>
                        <Shield className={`w-5 h-5 ${themeStyle.infoIconColor} flex-shrink-0 mt-0.5`} />
                        <p className={`text-xs ${themeStyle.infoText} leading-relaxed`}>
                            입력하신 계좌로 <span className={`font-semibold ${themeStyle.accentText}`}>1원</span>이 입금됩니다.
                            입금자명에 표시된 <span className="font-semibold">4자리 숫자</span>를 입력하면 인증이 완료됩니다.
                        </p>
                    </div>

                    {/* 제출 버튼 */}
                    <Button
                        type="submit"
                        disabled={!isValid() || isSubmitting}
                        className={`w-full h-14 text-lg font-semibold rounded-xl ${themeStyle.buttonBg} ${themeStyle.buttonShadow} transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                요청 중...
                            </>
                        ) : (
                            '1원 인증 요청'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
