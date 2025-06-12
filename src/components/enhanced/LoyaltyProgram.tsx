import React, { useState, useEffect } from 'react';
import {
    Gift,
    Star,
    Clock,
    Calendar,
    CreditCard,
    Zap,
    Check,
    Award
    
} from 'lucide-react';
import { fetchCustomerLoyalty, redeemReward } from '../../api/customers';
import { useAuth } from '../../hooks/useAuth';
import BeautifulTabs, { BeautifulTab } from '../common/BeautifulTabs';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import Notification from '../common/Notification';

interface LoyaltyData {
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    points: number;
    pointsToNextTier: number;
    memberSince: string;
    lastService: string;
    servicesCompleted: number;
    rewardsRedeemed: number;
    availableRewards: Reward[];
    rewardHistory: RewardHistory[];
    benefits: string[];
}

interface Reward {
    id: number;
    name: string;
    description: string;
    pointsCost: number;
    category: 'DISCOUNT' | 'SERVICE' | 'PRODUCT' | 'OTHER';
    expiryDate?: string;
}

interface RewardHistory {
    id: number;
    rewardName: string;
    pointsCost: number;
    redeemedDate: string;
    usedDate?: string;
    status: 'REDEEMED' | 'USED' | 'EXPIRED';
}

const LoyaltyProgram: React.FC = () => {
    const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRedeeming, setIsRedeeming] = useState<boolean>(false);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchCustomerLoyalty();
                setLoyaltyData(data as LoyaltyData);
            } catch (error) {
                console.error('Error fetching loyalty data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRedeemReward = async () => {
        if (!selectedReward) return;

        setIsRedeeming(true);
        try {
            await redeemReward(selectedReward.id);

            // Update local state to reflect changes
            setLoyaltyData(prev => {
                if (!prev) return null;

                const updatedRewards = prev.availableRewards.filter(r => r.id !== selectedReward.id);
                const newHistory = [
                    {
                        id: Math.floor(Math.random() * 1000), // This would come from the API in a real app
                        rewardName: selectedReward.name,
                        pointsCost: selectedReward.pointsCost,
                        redeemedDate: new Date().toISOString(),
                        status: 'REDEEMED' as const
                    },
                    ...prev.rewardHistory
                ];

                return {
                    ...prev,
                    points: prev.points - selectedReward.pointsCost,
                    rewardsRedeemed: prev.rewardsRedeemed + 1,
                    availableRewards: updatedRewards,
                    rewardHistory: newHistory
                };
            });

            setShowConfirmModal(false);
            setSelectedReward(null);
        } catch (error) {
            console.error('Error redeeming reward:', error);
        } finally {
            setIsRedeeming(false);
        }
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'BRONZE':
                return 'bg-amber-700 text-white';
            case 'SILVER':
                return 'bg-gray-400 text-white';
            case 'GOLD':
                return 'bg-yellow-500 text-white';
            case 'PLATINUM':
                return 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white';
            default:
                return 'bg-gray-700 text-white';
        }
    };

    const getProgressPercentage = () => {
        if (!loyaltyData) return 0;

        const { points, pointsToNextTier } = loyaltyData;
        if (pointsToNextTier === 0) return 100; // Already at highest tier

        // Calculate tier thresholds based on current tier
        let currentTierThreshold = 0;
        let nextTierThreshold = 0;

        switch (loyaltyData.tier) {
            case 'BRONZE':
                currentTierThreshold = 0;
                nextTierThreshold = 500;
                break;
            case 'SILVER':
                currentTierThreshold = 500;
                nextTierThreshold = 1500;
                break;
            case 'GOLD':
                currentTierThreshold = 1500;
                nextTierThreshold = 3000;
                break;
            case 'PLATINUM':
                return 100; // Already at highest tier
        }

        const pointsForCurrentTier = points - currentTierThreshold;
        const pointsNeededForNextTier = nextTierThreshold - currentTierThreshold;

        return Math.min(100, Math.floor((pointsForCurrentTier / pointsNeededForNextTier) * 100));
    };

    const getNextTier = () => {
        if (!loyaltyData) return '';

        switch (loyaltyData.tier) {
            case 'BRONZE':
                return 'SILVER';
            case 'SILVER':
                return 'GOLD';
            case 'GOLD':
                return 'PLATINUM';
            case 'PLATINUM':
                return 'PLATINUM';
            default:
                return '';
        }
    };

    const getRewardCategoryIcon = (category: string) => {
        switch (category) {
            case 'DISCOUNT':
                return <CreditCard className="w-5 h-5 text-purple-500" />;
            case 'SERVICE':
                return <Zap className="w-5 h-5 text-blue-500" />;
            case 'PRODUCT':
                return <Gift className="w-5 h-5 text-green-500" />;
            default:
                return <Star className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'REDEEMED':
                return 'bg-blue-100 text-blue-800';
            case 'USED':
                return 'bg-green-100 text-green-800';
            case 'EXPIRED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading || !loyaltyData) {
        return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-[#E3D5CA]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-[#3D2C2E]">Loyalty Program</h2>
                        <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-[#3D2C2E]" />
                            <span className="text-sm font-medium text-[#6B5B47]">
                                {loyaltyData?.points || 0} Points
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading loyalty program...</p>
                </div>
            </div>
        );
    }

    const overviewTab = (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-medium">Welcome, {user?.firstName || 'Valued Member'}</h3>
                        <div className="flex items-center mt-1">
                            <Star className="w-5 h-5 mr-1 text-yellow-400" />
                            <span className="font-medium">Current Points: {loyaltyData.points}</span>
                        </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${getTierColor(loyaltyData.tier)}`}>
                        {loyaltyData.tier} MEMBER
                    </div>
                </div>

                {loyaltyData.tier !== 'PLATINUM' && (
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Progress to {getNextTier()}</span>
                            <span>{loyaltyData.pointsToNextTier} points to go</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2.5">
                            <div
                                className={`bg-yellow-400 h-2.5 rounded-full w-[${getProgressPercentage()}%]`}
                            ></div>
                        </div>
                    </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <div className="text-sm opacity-90">Member Since</div>
                        <div className="font-medium mt-1">
                            {new Date(loyaltyData.memberSince).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <div className="text-sm opacity-90">Services Completed</div>
                        <div className="font-medium mt-1">{loyaltyData.servicesCompleted}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Your Membership Benefits</h3>
                <div className="space-y-3">
                    {loyaltyData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start">
                            <div className="p-1 bg-green-100 rounded-full mr-3 mt-0.5">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span>{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">How to Earn Points</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-medium">Service Payment</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Earn 1 point for every $1 spent on services
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                            <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h4 className="font-medium">Regular Maintenance</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Earn 50 bonus points for keeping up with scheduled maintenance
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="p-2 bg-purple-100 rounded-full mr-3">
                            <Star className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h4 className="font-medium">Leave a Review</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Get 25 points for each review you leave after service
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="p-2 bg-yellow-100 rounded-full mr-3">
                            <Gift className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <h4 className="font-medium">Refer a Friend</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Earn 100 points for each friend you refer who becomes a customer
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const rewardsTab = (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Available Rewards</h3>
                    <p className="text-sm text-gray-600">
                        You have <span className="font-medium">{loyaltyData.points} points</span> available to redeem
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {loyaltyData.availableRewards.length > 0 ? (
                    loyaltyData.availableRewards.map((reward) => (
                        <div
                            key={reward.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => {
                                setSelectedReward(reward);
                                setShowConfirmModal(true);
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex">
                                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                                        {getRewardCategoryIcon(reward.category)}
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{reward.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {reward.description}
                                        </p>
                                        {reward.expiryDate && (
                                            <div className="flex items-center text-xs text-gray-500 mt-2">
                                                <Clock className="w-3.5 h-3.5 mr-1" />
                                                <span>Expires: {new Date(reward.expiryDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="font-bold text-blue-600">{reward.pointsCost} pts</div>
                                    <button
                                        className={`mt-2 px-3 py-1 text-xs rounded-full font-medium ${
                                            loyaltyData.points >= reward.pointsCost
                                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                        }`}
                                        disabled={loyaltyData.points < reward.pointsCost}
                                    >
                                        {loyaltyData.points >= reward.pointsCost ? 'Redeem' : 'Not Enough Points'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Award className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-gray-600">No rewards available at the moment</p>
                        <p className="text-sm text-gray-500">Check back later for new rewards!</p>
                    </div>
                )}
            </div>
        </div>
    );

    const historyTab = (
        <div>
            <div className="mb-4">
                <h3 className="text-lg font-medium">Reward History</h3>
                <p className="text-sm text-gray-600">Track your redeemed rewards and their status</p>
            </div>

            <div className="space-y-4">
                {loyaltyData.rewardHistory.length > 0 ? (
                    loyaltyData.rewardHistory.map((history) => (
                        <div key={history.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex">
                                    <div className="p-2 bg-green-100 rounded-full mr-3">
                                        <Award className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{history.rewardName}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Redeemed for {history.pointsCost} points
                                        </p>
                                        <div className="flex items-center text-xs text-gray-500 mt-2">
                                            <Calendar className="w-3.5 h-3.5 mr-1" />
                                            <span>Redeemed: {new Date(history.redeemedDate).toLocaleDateString()}</span>
                                        </div>
                                        {history.usedDate && (
                                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                                <Check className="w-3.5 h-3.5 mr-1" />
                                                <span>Used: {new Date(history.usedDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(history.status)}`}>
                                        {history.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Award className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-gray-600">No reward history yet</p>
                        <p className="text-sm text-gray-500">Start earning points to redeem your first reward!</p>
                    </div>
                )}
            </div>
        </div>
    );

    const tabs: BeautifulTab[] = [
        {
            id: 'overview',
            label: 'Overview',
            icon: <Star className="w-4 h-4" />,
            content: overviewTab,
        },
        {
            id: 'rewards',
            label: 'Available Rewards',
            icon: <Award className="w-4 h-4" />,
            content: rewardsTab,
        },
        {
            id: 'history',
            label: 'Reward History',
            icon: <Clock className="w-4 h-4" />,
            content: historyTab,
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-[#E3D5CA]">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-[#3D2C2E]">Loyalty Program</h2>
                    <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-[#3D2C2E]" />
                        <span className="text-sm font-medium text-[#6B5B47]">
                            {loyaltyData?.points || 0} Points
                        </span>
                    </div>
                </div>
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    title={notification.type === 'success' ? 'Success' : 'Error'}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="p-4">
                <BeautifulTabs
                    tabs={tabs}
                    variant="underline"
                    defaultTabId="overview"
                />
            </div>

            {/* Confirmation Modal */}
            <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Redeem Reward</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to redeem "{selectedReward?.name}" for {selectedReward?.pointsCost} points?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleRedeemReward} disabled={isRedeeming}>
                            {isRedeeming ? 'Redeeming...' : 'Confirm Redemption'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LoyaltyProgram;