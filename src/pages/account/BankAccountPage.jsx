import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    requestVerification, 
    verifyAndRegister, 
    getAccount, 
    deleteAccount,
    BANK_CODES 
} from '@/api/bankAccountApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

export default function BankAccountPage() {
    const navigate = useNavigate();
    
    // 상태
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState('view'); // view, input, verify
    
    // 입력 폼
    const [bankCode, setBankCode] = useState('');
    const [accountNum, setAccountNum] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    
    // 인증
    const [bankTranId, setBankTranId] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [verifyCodeFromServer, setVerifyCodeFromServer] = useState(''); // 개발용
    
    // 상태
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // 계좌 정보 조회
    useEffect(() => {
        fetchAccount();
    }, []);
    
    const fetchAccount = async () => {
        try {
            setLoading(true);
            const data = await getAccount();
            setAccount(data);
            setStep(data ? 'view' : 'input');
        } catch (err) {
            console.error('계좌 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    };
    
    // 1원 인증 요청
    const handleRequestVerification = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        
        try {
            const response = await requestVerification(bankCode, accountNum, accountHolder);
            setBankTranId(response.bankTranId);
            setVerifyCodeFromServer(response.printContent); // 개발용: 인증코드 표시
            setStep('verify');
            setSuccess('인증코드가 발송되었습니다. (개발모드: ' + response.printContent + ')');
        } catch (err) {
            setError(err.response?.data?.message || '인증 요청에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };
    
    // 인증코드 검증
    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        
        try {
            await verifyAndRegister(bankTranId, verifyCode);
            setSuccess('계좌가 등록되었습니다!');
            await fetchAccount();
            setStep('view');
        } catch (err) {
            setError(err.response?.data?.message || '인증에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };
    
    // 계좌 삭제
    const handleDelete = async () => {
        if (!confirm('계좌를 삭제하시겠습니까?')) return;
        
        try {
            await deleteAccount();
            setAccount(null);
            setStep('input');
            setSuccess('계좌가 삭제되었습니다.');
        } catch (err) {
            setError('계좌 삭제에 실패했습니다.');
        }
    };
    
    // 계좌 변경
    const handleChange = () => {
        setBankCode('');
        setAccountNum('');
        setAccountHolder('');
        setVerifyCode('');
        setStep('input');
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="container max-w-md mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>정산 계좌 관리</CardTitle>
                    <CardDescription>
                        파티 정산금을 받을 계좌를 등록하세요
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    {success && (
                        <Alert className="mb-4 border-green-500">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}
                    
                    {/* 계좌 정보 표시 */}
                    {step === 'view' && account && (
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">등록된 계좌</p>
                                <p className="text-lg font-medium">{account.bankName}</p>
                                <p className="text-gray-700">{account.maskedAccountNumber}</p>
                                <p className="text-sm text-gray-500">{account.accountHolder}</p>
                            </div>
                            
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleChange} className="flex-1">
                                    계좌 변경
                                </Button>
                                <Button variant="destructive" onClick={handleDelete}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {/* 계좌 입력 폼 */}
                    {step === 'input' && (
                        <form onSubmit={handleRequestVerification} className="space-y-4">
                            <div>
                                <Label>은행 선택</Label>
                                <Select value={bankCode} onValueChange={setBankCode}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="은행을 선택하세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BANK_CODES.map(bank => (
                                            <SelectItem key={bank.code} value={bank.code}>
                                                {bank.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <Label>계좌번호</Label>
                                <Input
                                    type="text"
                                    value={accountNum}
                                    onChange={(e) => setAccountNum(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="계좌번호 입력 (숫자만)"
                                    maxLength={20}
                                />
                            </div>
                            
                            <div>
                                <Label>예금주명</Label>
                                <Input
                                    type="text"
                                    value={accountHolder}
                                    onChange={(e) => setAccountHolder(e.target.value)}
                                    placeholder="예금주명 입력"
                                />
                            </div>
                            
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={!bankCode || !accountNum || !accountHolder || submitting}
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                1원 인증 요청
                            </Button>
                        </form>
                    )}
                    
                    {/* 인증코드 입력 */}
                    {step === 'verify' && (
                        <form onSubmit={handleVerify} className="space-y-4">
                            <Alert>
                                <AlertDescription>
                                    입력하신 계좌로 1원이 입금되었습니다.<br/>
                                    입금자명에 표시된 4자리 인증코드를 입력해주세요.
                                </AlertDescription>
                            </Alert>
                            
                            {verifyCodeFromServer && (
                                <Alert className="border-blue-500">
                                    <AlertDescription>
                                        [개발모드] 인증코드: <strong>{verifyCodeFromServer}</strong>
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            <div>
                                <Label>인증코드 (4자리)</Label>
                                <Input
                                    type="text"
                                    value={verifyCode}
                                    onChange={(e) => setVerifyCode(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="인증코드 4자리 입력"
                                    maxLength={4}
                                />
                            </div>
                            
                            <div className="flex gap-2">
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => setStep('input')}
                                    className="flex-1"
                                >
                                    이전
                                </Button>
                                <Button 
                                    type="submit" 
                                    className="flex-1"
                                    disabled={verifyCode.length !== 4 || submitting}
                                >
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    인증 완료
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
