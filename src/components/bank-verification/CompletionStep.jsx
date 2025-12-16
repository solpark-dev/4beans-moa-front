import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PartyPopper, Wallet, ArrowRight, Check } from 'lucide-react';
import useBankVerificationStore from '@/store/bankVerificationStore';
import { BANKS } from './BankSelector';
import { useThemeStore } from '@/store/themeStore';

// 테마별 스타일
const completionThemeStyles = {
    default: {
        cardBorder: 'border-0 shadow-lg',
        iconBg: 'bg-gradient-to-br from-green-400 to-green-600',
        iconShadow: 'shadow-lg shadow-green-200',
        circleBg: 'bg-green-100',
        infoBg: 'bg-gradient-to-br from-slate-50 to-slate-100',
        buttonBg: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
        buttonShadow: 'shadow-lg shadow-orange-200',
        checkBg: 'bg-green-500',
        titleText: 'text-slate-800',
        subtitleText: 'text-slate-500',
        checkText: 'text-slate-600',
    },
    christmas: {
        cardBorder: 'border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        iconBg: 'bg-gradient-to-br from-green-600 to-green-800',
        iconShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        circleBg: 'bg-green-100',
        infoBg: 'bg-gradient-to-br from-red-50 to-green-50',
        buttonBg: 'bg-gradient-to-r from-red-800 to-green-800 hover:from-red-900 hover:to-green-900',
        buttonShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        checkBg: 'bg-green-700',
        titleText: 'text-slate-800',
        subtitleText: 'text-slate-500',
        checkText: 'text-slate-600',
    },
    dark: {
        cardBorder: 'border border-gray-700 bg-[#1E293B] shadow-lg',
        iconBg: 'bg-gradient-to-br from-[#635bff] to-[#00d4ff]',
        iconShadow: 'shadow-lg shadow-[#635bff]/25',
        circleBg: 'bg-[#635bff]/20',
        infoBg: 'bg-gradient-to-br from-gray-800 to-gray-700',
        buttonBg: 'bg-gradient-to-r from-[#635bff] to-[#00d4ff] hover:from-[#5851e8] hover:to-[#00c0e8]',
        buttonShadow: 'shadow-lg shadow-[#635bff]/25',
        checkBg: 'bg-green-500',
        titleText: 'text-white',
        subtitleText: 'text-gray-400',
        checkText: 'text-gray-300',
    },
    pop: {
        cardBorder: 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
        iconBg: 'bg-gradient-to-br from-pink-400 to-pink-600',
        iconShadow: 'shadow-lg',
        circleBg: 'bg-pink-100',
        infoBg: 'bg-gradient-to-br from-pink-50 to-yellow-50',
        buttonBg: 'bg-pink-500 hover:bg-pink-600',
        buttonShadow: 'shadow-lg',
        checkBg: 'bg-green-500',
        titleText: 'text-slate-800',
        subtitleText: 'text-slate-500',
        checkText: 'text-slate-600',
    },
};

// canvas-confetti는 선택적 의존성 (없으면 애니메이션 생략)
let confetti = null;
try {
    confetti = require('canvas-confetti');
} catch (e) {
    // canvas-confetti가 설치되지 않음 - 무시
}

/**
 * Step 4: 완료 화면
 */
export default function CompletionStep() {
    const navigate = useNavigate();
    const { theme } = useThemeStore();
    const themeStyle = completionThemeStyles[theme] || completionThemeStyles.default;
    const { formData, verification, reset } = useBankVerificationStore();

    // 은행 정보 가져오기
    const bank = BANKS.find(b => b.code === formData.bankCode);

    // 축하 애니메이션 (confetti)
    useEffect(() => {
        // confetti가 없으면 그냥 넘어감
        if (typeof confetti === 'function') {
            const duration = 2000;
            const end = Date.now() + duration;

            const colors = theme === 'christmas'
                ? ['#c41e3a', '#2d5a27', '#ffffff', '#f5c542']
                : theme === 'dark'
                    ? ['#635bff', '#00d4ff', '#4ade80', '#ffffff']
                    : theme === 'pop'
                        ? ['#ec4899', '#f97316', '#22c55e', '#3b82f6']
                        : ['#f97316', '#fb923c', '#fdba74', '#22c55e', '#4ade80'];

            (function frame() {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    }, [theme]);

    // 내 지갑으로 이동
    const handleGoToWallet = () => {
        reset();
        navigate('/user/wallet');
    };

    // 홈으로 이동
    const handleGoHome = () => {
        reset();
        navigate('/');
    };

    return (
        <Card className={`${themeStyle.cardBorder} overflow-hidden`}>
            <CardContent className="py-12 px-6">
                <div className="text-center">
                    {/* 성공 아이콘 */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2
                        }}
                        className="relative mx-auto w-24 h-24 mb-6"
                    >
                        {/* 배경 원 */}
                        <motion.div
                            className={`absolute inset-0 ${themeStyle.circleBg} rounded-full`}
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.5 }}
                        />
                        {/* 아이콘 */}
                        <div className={`absolute inset-0 ${themeStyle.iconBg} rounded-full flex items-center justify-center ${themeStyle.iconShadow}`}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring' }}
                            >
                                <PartyPopper className="w-10 h-10 text-white" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* 타이틀 */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`text-2xl font-bold ${themeStyle.titleText} mb-2`}
                    >
                        계좌 등록 완료!
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`${themeStyle.subtitleText} mb-8`}
                    >
                        이제 파티 정산금을 받을 수 있어요
                    </motion.p>

                    {/* 등록된 계좌 정보 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`${themeStyle.infoBg} rounded-2xl p-6 mb-8`}
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            {bank && (
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                                    style={{
                                        backgroundColor: bank.color,
                                        color: bank.textColor || '#ffffff'
                                    }}
                                >
                                    {bank.logo}
                                </div>
                            )}
                            <div className="text-left">
                                <p className={`font-semibold ${themeStyle.titleText} text-lg`}>
                                    {formData.bankName}
                                </p>
                                <p className={themeStyle.subtitleText}>
                                    {verification.maskedAccount || formData.accountNum}
                                </p>
                            </div>
                        </div>

                        {/* 체크 리스트 */}
                        <div className="space-y-2">
                            {[
                                '본인 계좌 확인 완료',
                                '정산 계좌로 등록 완료',
                            ].map((text, index) => (
                                <motion.div
                                    key={text}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className={`flex items-center gap-2 text-sm ${themeStyle.checkText}`}
                                >
                                    <div className={`w-5 h-5 ${themeStyle.checkBg} rounded-full flex items-center justify-center`}>
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    {text}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 버튼들 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-3"
                    >
                        <Button
                            onClick={handleGoToWallet}
                            className={`w-full h-14 text-lg font-semibold rounded-xl ${themeStyle.buttonBg} ${themeStyle.buttonShadow}`}
                        >
                            <Wallet className="w-5 h-5 mr-2" />
                            내 지갑으로 이동
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={handleGoHome}
                            className={`w-full h-12 ${themeStyle.subtitleText} hover:${themeStyle.titleText}`}
                        >
                            홈으로 가기
                        </Button>
                    </motion.div>
                </div>
            </CardContent>
        </Card>
    );
}
