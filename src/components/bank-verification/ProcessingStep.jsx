import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Circle, Loader2 } from 'lucide-react';
import useBankVerificationStore from '@/store/bankVerificationStore';
import { useThemeStore } from '@/store/themeStore';

// 테마별 스타일
const processingThemeStyles = {
    default: {
        cardBorder: 'border-0 shadow-lg',
        iconBg: 'bg-gradient-to-br from-orange-400 to-orange-600',
        iconShadow: 'shadow-lg shadow-orange-200',
        pulseBg: 'bg-orange-100',
        progressBg: 'bg-slate-100',
        progressFill: 'bg-gradient-to-r from-orange-400 to-orange-600',
        processingBorder: 'border-orange-500',
        processingText: 'text-orange-600',
        completedText: 'text-green-600',
        pendingText: 'text-slate-400',
        titleText: 'text-slate-800',
        subtitleText: 'text-slate-500',
        progressText: 'text-slate-400',
    },
    christmas: {
        cardBorder: 'border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        iconBg: 'bg-gradient-to-br from-red-800 to-green-800',
        iconShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        pulseBg: 'bg-red-100',
        progressBg: 'bg-gray-100',
        progressFill: 'bg-gradient-to-r from-red-800 to-green-800',
        processingBorder: 'border-red-800',
        processingText: 'text-red-800',
        completedText: 'text-green-700',
        pendingText: 'text-slate-400',
        titleText: 'text-slate-800',
        subtitleText: 'text-slate-500',
        progressText: 'text-slate-400',
    },
    dark: {
        cardBorder: 'border border-gray-700 bg-[#1E293B] shadow-lg',
        iconBg: 'bg-gradient-to-br from-[#635bff] to-[#00d4ff]',
        iconShadow: 'shadow-lg shadow-[#635bff]/25',
        pulseBg: 'bg-[#635bff]/20',
        progressBg: 'bg-gray-700',
        progressFill: 'bg-gradient-to-r from-[#635bff] to-[#00d4ff]',
        processingBorder: 'border-[#635bff]',
        processingText: 'text-[#635bff]',
        completedText: 'text-green-400',
        pendingText: 'text-gray-500',
        titleText: 'text-white',
        subtitleText: 'text-gray-400',
        progressText: 'text-gray-500',
    },
    pop: {
        cardBorder: 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
        iconBg: 'bg-gradient-to-br from-pink-400 to-pink-600',
        iconShadow: 'shadow-lg',
        pulseBg: 'bg-pink-100',
        progressBg: 'bg-gray-100',
        progressFill: 'bg-pink-500',
        processingBorder: 'border-pink-500',
        processingText: 'text-pink-600',
        completedText: 'text-green-600',
        pendingText: 'text-slate-400',
        titleText: 'text-slate-800',
        subtitleText: 'text-slate-500',
        progressText: 'text-slate-400',
    },
};

// 처리 단계 정의
const PROCESSING_STEPS = [
    { id: 1, label: '계좌 정보 확인', duration: 1000 },
    { id: 2, label: '예금주 실명 확인', duration: 1500 },
    { id: 3, label: '1원 입금 처리 중', duration: 1500 },
];

/**
 * Step 2: 처리 중 (로딩 애니메이션)
 * 총 4초 동안 3단계 애니메이션 진행
 */
export default function ProcessingStep() {
    const { theme } = useThemeStore();
    const themeStyle = processingThemeStyles[theme] || processingThemeStyles.default;
    const { formData } = useBankVerificationStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    // 단계별 애니메이션 진행
    useEffect(() => {
        let totalElapsed = 0;

        PROCESSING_STEPS.forEach((step, index) => {
            const timeout = setTimeout(() => {
                setCurrentStep(index + 1);
            }, totalElapsed);

            totalElapsed += step.duration;

            return () => clearTimeout(timeout);
        });
    }, []);

    // 프로그레스 바 애니메이션
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2.5; // 4초 동안 0 → 100
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // 단계 상태 결정
    const getStepStatus = (stepIndex) => {
        if (stepIndex < currentStep) return 'completed';
        if (stepIndex === currentStep) return 'processing';
        return 'pending';
    };

    return (
        <Card className={themeStyle.cardBorder}>
            <CardContent className="py-12 px-6">
                <div className="text-center">
                    {/* 은행 아이콘 애니메이션 */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="relative mx-auto w-24 h-24 mb-8"
                    >
                        {/* 외곽 펄스 애니메이션 */}
                        <motion.div
                            className={`absolute inset-0 ${themeStyle.pulseBg} rounded-full`}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        />
                        {/* 메인 아이콘 */}
                        <div className={`absolute inset-0 ${themeStyle.iconBg} rounded-full flex items-center justify-center ${themeStyle.iconShadow}`}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                                <Loader2 className="w-10 h-10 text-white" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* 타이틀 */}
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`text-xl font-bold ${themeStyle.titleText} mb-2`}
                    >
                        계좌 정보를 확인하고 있습니다
                    </motion.h2>

                    {/* 은행/계좌 정보 */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={`${themeStyle.subtitleText} mb-8`}
                    >
                        {formData.bankName} {formData.accountHolder}님
                    </motion.p>

                    {/* 프로그레스 바 */}
                    <div className="max-w-xs mx-auto mb-8">
                        <div className={`h-2 ${themeStyle.progressBg} rounded-full overflow-hidden`}>
                            <motion.div
                                className={`h-full ${themeStyle.progressFill} rounded-full`}
                                initial={{ width: '0%' }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>
                        <p className={`text-xs ${themeStyle.progressText} mt-2`}>{Math.round(progress)}%</p>
                    </div>

                    {/* 단계별 체크리스트 */}
                    <div className="max-w-xs mx-auto space-y-3">
                        {PROCESSING_STEPS.map((step, index) => {
                            const status = getStepStatus(index);

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="flex items-center gap-3"
                                >
                                    {/* 상태 아이콘 */}
                                    <div className="relative w-6 h-6 flex-shrink-0">
                                        {status === 'completed' ? (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                            >
                                                <Check className="w-4 h-4 text-white" />
                                            </motion.div>
                                        ) : status === 'processing' ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className={`w-6 h-6 border-2 ${themeStyle.processingBorder} border-t-transparent rounded-full`}
                                            />
                                        ) : (
                                            <Circle className={`w-6 h-6 ${themeStyle.pendingText}`} />
                                        )}
                                    </div>

                                    {/* 레이블 */}
                                    <span className={`
                                        text-sm transition-colors duration-300
                                        ${status === 'completed' ? `${themeStyle.completedText} font-medium` : ''}
                                        ${status === 'processing' ? `${themeStyle.processingText} font-medium` : ''}
                                        ${status === 'pending' ? themeStyle.pendingText : ''}
                                    `}>
                                        {status === 'processing' && index === 2 ? (
                                            <motion.span
                                                animate={{ opacity: [1, 0.5, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                {step.label}...
                                            </motion.span>
                                        ) : (
                                            step.label
                                        )}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
