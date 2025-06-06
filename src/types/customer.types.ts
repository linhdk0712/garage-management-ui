export interface CustomerProfile {
    customerId: number;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    preferredContactMethod: string;
    memberSince: string;
    notes?: string;
}

export interface CustomerSummary {
    customerId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    vehicleCount: number;
    lastAppointment?: string;
}

export interface LoyaltyData {
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

export interface Reward {
    id: number;
    name: string;
    description: string;
    pointsCost: number;
    category: 'DISCOUNT' | 'SERVICE' | 'PRODUCT' | 'OTHER';
    expiryDate?: string;
}

export interface RewardHistory {
    id: number;
    rewardName: string;
    pointsCost: number;
    redeemedDate: string;
    usedDate?: string;
    status: 'REDEEMED' | 'USED' | 'EXPIRED';
}

export interface CustomerStatistics {
    newCustomers: number;
    activeCustomers: number;
    averageFeedbackRating: number;
    topServices: ServiceCount[];
    customerRetention: {
        singleVisit: number;
        returning: number;
        loyal: number;
    };
}

export interface ServiceCount {
    serviceType: string;
    count: number;
}