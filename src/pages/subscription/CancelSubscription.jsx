import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import httpClient from '../../api/httpClient';

const CancelSubscription = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const cancelSubscription = async () => {
            if (window.confirm('정말로 구독을 해지하시겠습니까? 다음 결제일부터 서비스 이용이 중단됩니다.')) {
                try {
                    const response = await httpClient.post(`/subscription/${id}/cancel`);
                    if (response.success) {
                        alert('구독이 해지되었습니다.');
                        navigate('/subscription');
                    } else {
                        alert(response.error?.message || '구독 해지에 실패했습니다.');
                        navigate(`/subscription/${id}`);
                    }
                } catch (error) {
                    console.error("Failed to cancel subscription", error);
                    alert('구독 해지에 실패했습니다.');
                    navigate(`/subscription/${id}`);
                }
            } else {
                navigate(`/subscription/${id}`);
            }
        };

        cancelSubscription();
    }, [id, navigate]);

    return (
        <div className="flex justify-center items-center h-64">
            <p>처리 중...</p>
        </div>
    );
};

export default CancelSubscription;
