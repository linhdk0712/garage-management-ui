import React from 'react';
import { X, Download, CreditCard, Calendar, Car } from 'lucide-react';
import { Payment } from '../../types/payment.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface PaymentModalProps {
  payment: Payment;
  onClose: () => void;
  onDownloadReceipt: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ payment, onClose, onDownloadReceipt }) => {
  const getStatusVariant = (status: string): 'success' | 'warning' | 'destructive' | 'secondary' => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'destructive';
      case 'REFUNDED':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    const displayNames = {
      'CREDIT_CARD': 'Credit Card',
      'DEBIT_CARD': 'Debit Card',
      'CASH': 'Cash',
      'BANK_TRANSFER': 'Bank Transfer',
      'CHECK': 'Check',
    };
    return displayNames[method as keyof typeof displayNames] || method;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Payment Details</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <Badge variant={getStatusVariant(payment.status)}>
              {payment.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Amount</span>
            <span className="text-lg font-semibold text-green-600">
              ${payment.amount.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Payment Method</span>
            <span className="flex items-center">
              <CreditCard className="h-4 w-4 mr-1" />
              {getPaymentMethodDisplay(payment.paymentMethod)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Date</span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(payment.paymentDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Service</span>
            <span>{payment.serviceType}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Vehicle</span>
            <span className="flex items-center">
              <Car className="h-4 w-4 mr-1" />
              {payment.vehicleInfo.make} {payment.vehicleInfo.model}
            </span>
          </div>

          {payment.transactionId && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Transaction ID</span>
              <span className="text-xs font-mono">{payment.transactionId}</span>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              onClick={onDownloadReceipt}
              disabled={payment.status !== 'COMPLETED'}
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal; 