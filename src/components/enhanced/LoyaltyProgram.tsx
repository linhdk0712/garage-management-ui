import React, { useState, useEffect } from 'react';
import {
    Gift,
    Star,
    Clock,
    Calendar,
    CreditCard,
    Zap,
    Check
} from 'lucide-react';
import { fetchCustomerLoyalty, redeemReward } from '../../api/customers';
import { useAuth } from '../../hooks/useAuth';

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
    const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'history'>('overview');
    const [isRedeeming, setIsRedeeming] = useState<boolean>(false);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!loyaltyData) {
        return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
                    <h2 className="text-lg font-semibold text-white">Loyalty Program</h2>
                </div>
                <div className="p-6 text-center">
                    <div className="mb-4">
                        <Gift className="w-12 h-12 text-blue-500 mx-auto" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Join Our Loyalty Program</h3>
                    <p className="text-gray-600 mb-4">
                        Earn points with every service and redeem them for discounts, free services, and more!
                    </p>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                        onClick={() => {}}
                    >
                        Sign Up Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <h2 className="text-lg font-semibold text-white">Loyalty Program</h2>
            </div>

            <div className="border-b">
                <div className="flex">
                    <button
                        className={`px-4 py-3 font-medium text-sm ${
                            activeTab === 'overview'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`px-4 py-3 font-medium text-sm ${
                            activeTab === 'rewards'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                        onClick={() => setActiveTab('rewards')}
                    >
                        Available Rewards
                    </button>
                    <button
                        className={`px-4 py-3 font-medium text-sm ${
                            activeTab === 'history'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                        onClick={() => setActiveTab('history')}
                    >
                        Reward History
                    </button>
                </div>
            </div>

            <div className="p-4">
                {activeTab === 'overview' && (
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
                )}

                {activeTab === 'rewards' && (
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
                                <div className="text-center py-8 border rounded-lg">
                                    <Gift className="w-12 h-12 text-gray-400 mx-auto" />
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">No rewards available</h3>
                                    <p className="mt-1 text-gray-500">Check back soon for new reward options</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div>
                        <h3 className="text-lg font-medium mb-4">Reward History</h3>

                        {loyaltyData.rewardHistory.length > 0 ? (
                            <div className="space-y-4">
                                {loyaltyData.rewardHistory.map((item) => (
                                    <div key={item.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center">
                                                    <h4 className="font-medium">{item.rewardName}</h4>
                                                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    <span>Redeemed on {new Date(item.redeemedDate).toLocaleDateString()}</span>
                                                </div>
                                                {item.usedDate && (
                                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                                        <Check className="w-4 h-4 mr-1" />
                                                        <span>Used on {new Date(item.usedDate).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-bold text-gray-700">-{item.pointsCost} pts</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border rounded-lg">
                                <Clock className="w-12 h-12 text-gray-400 mx-auto" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No reward history</h3>
                                <p className="mt-1 text-gray-500">You haven't redeemed any rewards yet</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Redeem Confirmation Modal */}
            {showConfirmModal && selectedReward && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <Gift className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Redeem Reward
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to redeem {selectedReward.name} for {selectedReward.pointsCost} points?
                                            </p>
                                        </div>
                                        <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg">
                                            <div className="font-medium">{selectedReward.name}</div>
                                            <div className="text-sm text-gray-600 mt-1">{selectedReward.description}</div>
                                            <div className="text-sm text-blue-600 font-medium mt-2">{selectedReward.pointsCost} points</div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500">
                                                Current balance: <span className="font-medium">{loyaltyData.points} points</span><br />
                                                New balance: <span className="font-medium">{loyaltyData.points - selectedReward.pointsCost} points</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleRedeemReward}
                                    disabled={isRedeeming}
                                >
                                    {isRedeeming ? 'Processing...' : 'Redeem Now'}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => {
                                        setShowConfirmModal(false);
                                        setSelectedReward(null);
                                    }}
                                    disabled={isRedeeming}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoyaltyProgram;