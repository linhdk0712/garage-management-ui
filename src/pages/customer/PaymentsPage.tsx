import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Download, 
  Search, 
  Eye, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { getPaymentHistory, getPaymentReceipt } from '../../api/payments';
import { Payment } from '../../types/payment.types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Table, { TableColumn } from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Select from '../../components/common/Select';
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

  // Define table columns
  const columns: TableColumn<Payment>[] = [
    {
      header: 'Date',
      accessor: (payment) => new Date(payment.paymentDate).toLocaleDateString(),
      className: 'min-w-[120px]',
    },
    {
      header: 'Service',
      accessor: 'serviceType',
      className: 'min-w-[200px]',
    },
    {
      header: 'Vehicle',
      accessor: (payment) => `${payment.vehicleInfo.make} ${payment.vehicleInfo.model} (${payment.vehicleInfo.licensePlate})`,
      className: 'min-w-[200px]',
    },
    {
      header: 'Amount',
      accessor: (payment) => `$${payment.amount.toFixed(2)}`,
      className: 'text-right min-w-[100px]',
    },
    {
      header: 'Method',
      accessor: 'paymentMethod',
      cell: (payment) => {
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
            {methodIcons[payment.paymentMethod as keyof typeof methodIcons]}
            <span>{displayNames[payment.paymentMethod as keyof typeof displayNames]}</span>
          </div>
        );
      },
      className: 'min-w-[150px]',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (payment) => {
        let variant: 'success' | 'warning' | 'danger' | 'secondary' = 'secondary';
        let icon = null;
        
        switch (payment.status) {
          case 'COMPLETED':
            variant = 'success';
            icon = <CheckCircle className="h-4 w-4 mr-1" />;
            break;
          case 'PENDING':
            variant = 'warning';
            icon = <Clock className="h-4 w-4 mr-1" />;
            break;
          case 'FAILED':
            variant = 'danger';
            icon = <AlertCircle className="h-4 w-4 mr-1" />;
            break;
          case 'REFUNDED':
            variant = 'secondary';
            icon = <AlertCircle className="h-4 w-4 mr-1" />;
            break;
        }
        
        return (
          <Badge
            label={payment.status}
            variant={variant}
            icon={icon}
            size="sm"
          />
        );
      },
      className: 'min-w-[120px]',
    },
    {
      header: 'Actions',
      accessor: (payment) => payment,
      cell: (payment) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() => viewPaymentDetails(payment)}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => downloadReceipt(payment.paymentId)}
            disabled={payment.status !== 'COMPLETED'}
          >
            Receipt
          </Button>
        </div>
      ),
      className: 'min-w-[180px]',
    },
  ];

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
                <Select
                  id="statusFilter"
                  label="Status"
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'COMPLETED', label: 'Completed' },
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'FAILED', label: 'Failed' },
                    { value: 'REFUNDED', label: 'Refunded' },
                  ]}
                  value={filterStatus}
                  onChange={(value) => setFilterStatus(value)}
                />
              </div>
              
              <div className="w-40">
                <Select
                  id="methodFilter"
                  label="Payment Method"
                  options={[
                    { value: 'all', label: 'All Methods' },
                    { value: 'CREDIT_CARD', label: 'Credit Card' },
                    { value: 'DEBIT_CARD', label: 'Debit Card' },
                    { value: 'CASH', label: 'Cash' },
                    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                    { value: 'CHECK', label: 'Check' },
                  ]}
                  value={filterMethod}
                  onChange={(value) => setFilterMethod(value)}
                />
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
            <Table
              columns={columns}
              data={filteredPayments}
              keyField="paymentId"
              pagination
              pageSize={10}
              emptyMessage="No payments match your filters"
            />
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