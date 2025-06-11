import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Download, 
  Search, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { getPaymentHistory, getPaymentReceipt } from '../../api/payments';
import { Payment } from '../../types/payment.types';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Spinner from '../../components/common/Spinner';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import PaymentModal from '../../components/customer/PaymentModal';

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const data = await getPaymentHistory();
        setPayments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch payment history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const downloadReceipt = async (paymentId: number) => {
    try {
      const receipt = await getPaymentReceipt(paymentId);
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(receipt);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading receipt:', err);
      setError('Failed to download receipt. Please try again.');
    }
  };

  const viewPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    // Search filter
    const matchesSearch = 
      payment.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vehicleInfo.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vehicleInfo.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vehicleInfo.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      filterStatus === 'all' || 
      payment.status === filterStatus;
    
    // Payment method filter
    const matchesMethod = 
      filterMethod === 'all' || 
      payment.paymentMethod === filterMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusBadge = (status: string) => {
    let variant: 'success' | 'warning' | 'destructive' | 'secondary' = 'secondary';
    let icon = null;
    
    switch (status) {
      case 'COMPLETED':
        variant = 'success';
        icon = <CheckCircle className="h-4 w-4 mr-1" />;
        break;
      case 'PENDING':
        variant = 'warning';
        icon = <Clock className="h-4 w-4 mr-1" />;
        break;
      case 'FAILED':
        variant = 'destructive';
        icon = <AlertCircle className="h-4 w-4 mr-1" />;
        break;
      case 'REFUNDED':
        variant = 'secondary';
        icon = <AlertCircle className="h-4 w-4 mr-1" />;
        break;
    }
    
    return (
      <Badge variant={variant}>
        {icon}
        {status}
      </Badge>
    );
  };

  const getPaymentMethodDisplay = (method: string) => {
    const methodIcons = {
      'CREDIT_CARD': <CreditCard className="h-4 w-4 mr-1" />,
      'DEBIT_CARD': <CreditCard className="h-4 w-4 mr-1" />,
      'CASH': <CreditCard className="h-4 w-4 mr-1" />,
      'BANK_TRANSFER': <CreditCard className="h-4 w-4 mr-1" />,
      'CHECK': <CreditCard className="h-4 w-4 mr-1" />,
    };
    
    const displayNames = {
      'CREDIT_CARD': 'Credit Card',
      'DEBIT_CARD': 'Debit Card',
      'CASH': 'Cash',
      'BANK_TRANSFER': 'Bank Transfer',
      'CHECK': 'Check',
    };
    
    return (
      <div className="flex items-center">
        {methodIcons[method as keyof typeof methodIcons]}
        <span>{displayNames[method as keyof typeof displayNames]}</span>
      </div>
    );
  };

  if (isLoading) {
    return <Spinner size="lg" text="Loading payment history..." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment History</h1>

      <Card>
        <div className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by service or vehicle..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="w-40">
                <label className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={(value: string) => setFilterStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-40">
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={filterMethod} onValueChange={(value: string) => setFilterMethod(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                    <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="CHECK">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {payments.length === 0 ? (
            <div className="text-center py-10">
              <CreditCard className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">No payment records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.paymentId}>
                      <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.serviceType}</TableCell>
                      <TableCell>
                        {payment.vehicleInfo.make} {payment.vehicleInfo.model} ({payment.vehicleInfo.licensePlate})
                      </TableCell>
                      <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{getPaymentMethodDisplay(payment.paymentMethod)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewPaymentDetails(payment)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadReceipt(payment.paymentId)}
                            disabled={payment.status !== 'COMPLETED'}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Receipt
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {showPaymentModal && selectedPayment && (
        <PaymentModal
          payment={selectedPayment}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPayment(null);
          }}
          onDownloadReceipt={() => downloadReceipt(selectedPayment.paymentId)}
        />
      )}
    </div>
  );
};

export default PaymentsPage;