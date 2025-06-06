import React from 'react';
import { useFeatureFlags } from '../../contexts/FeatureFlagContext';
import { FeatureFlags } from '../../config/featureFlags';

interface FeatureGateProps {
    feature: keyof FeatureFlags;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const FeatureGate: React.FC<FeatureGateProps> = ({ feature, children, fallback }) => {
    const { isEnabled } = useFeatureFlags();

    if (!isEnabled(feature)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default FeatureGate; 