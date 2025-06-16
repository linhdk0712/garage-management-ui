# Enhanced Error Handling in Garage Management UI

This document explains how to use the enhanced error handling system that provides detailed error information when showing error notifications.

## Overview

The enhanced error handling system consists of:

1. **Enhanced Notification Component** - Shows detailed error information with expandable details
2. **Error Utilities** - Extract and format error information from various error types
3. **useNotification Hook** - Simplified way to manage notifications with error handling

## Components

### 1. Enhanced Notification Component

The `Notification` component now supports detailed error information:

```tsx
import Notification from '../components/common/Notification';

<Notification
  type="error"
  title="Error Title"
  message="User-friendly error message"
  errorDetails={{
    code: "HTTP_422",
    status: 422,
    timestamp: "2024-01-01T12:00:00Z",
    details: "Detailed error message",
    stack: "Error stack trace",
    context: { additional: "context" }
  }}
  showErrorDetails={true}
  onClose={() => setNotification(null)}
/>
```

#### Error Details Structure

```tsx
interface ErrorDetails {
  code?: string;        // Error code (e.g., "HTTP_422", "VALIDATION_ERROR")
  status?: number;      // HTTP status code
  timestamp?: string;   // When the error occurred
  details?: string;     // Detailed error message
  stack?: string;       // JavaScript stack trace
  context?: Record<string, any>; // Additional context
}
```

### 2. Error Utilities

Located in `src/utils/errorUtils.ts`, these utilities help extract and format error information:

#### `extractErrorDetails(error: unknown): ErrorDetails`

Extracts detailed error information from various error types:

```tsx
import { extractErrorDetails } from '../utils/errorUtils';

try {
  // Some operation that might fail
} catch (error) {
  const errorDetails = extractErrorDetails(error);
  // errorDetails contains structured error information
}
```

#### `createUserFriendlyMessage(errorDetails: ErrorDetails): string`

Creates user-friendly error messages:

```tsx
import { createUserFriendlyMessage } from '../utils/errorUtils';

const message = createUserFriendlyMessage(errorDetails);
// Returns user-friendly message based on error code
```

#### `formatErrorForNotification(error: unknown, showDetails?: boolean)`

Complete error formatting for notifications:

```tsx
import { formatErrorForNotification } from '../utils/errorUtils';

const errorInfo = formatErrorForNotification(error);
// Returns: { message, errorDetails, showErrorDetails }
```

### 3. useNotification Hook

Simplified way to manage notifications with built-in error handling:

```tsx
import useNotification from '../hooks/useNotification';

const MyComponent = () => {
  const { notification, showSuccess, showError, showWarning, showInfo, clearNotification } = useNotification();

  const handleSubmit = async () => {
    try {
      await someApiCall();
      showSuccess('Operation completed successfully');
    } catch (error) {
      showError(error, 'Failed to Complete Operation');
    }
  };

  return (
    <div>
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          errorDetails={notification.errorDetails}
          showErrorDetails={notification.showErrorDetails}
          onClose={clearNotification}
        />
      )}
      {/* Rest of component */}
    </div>
  );
};
```

## Usage Examples

### Basic Error Handling

```tsx
import useNotification from '../hooks/useNotification';

const MyComponent = () => {
  const { notification, showError, clearNotification } = useNotification();

  const handleApiCall = async () => {
    try {
      await apiCall();
    } catch (error) {
      showError(error, 'API Call Failed');
    }
  };

  return (
    <div>
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          errorDetails={notification.errorDetails}
          showErrorDetails={notification.showErrorDetails}
          onClose={clearNotification}
        />
      )}
    </div>
  );
};
```

### Custom Error Details

```tsx
import { extractErrorDetails } from '../utils/errorUtils';

const handleCustomError = () => {
  try {
    // Some operation
  } catch (error) {
    const errorDetails = extractErrorDetails(error);
    
    // Add custom context
    errorDetails.context = {
      ...errorDetails.context,
      customField: 'custom value',
      operation: 'user action'
    };

    setNotification({
      type: 'error',
      title: 'Custom Error',
      message: 'Something went wrong',
      errorDetails,
      showErrorDetails: true
    });
  }
};
```

### Different Notification Types

```tsx
const { showSuccess, showError, showWarning, showInfo } = useNotification();

// Success notification
showSuccess('Data saved successfully');

// Error notification with details
showError(error, 'Save Failed');

// Warning notification
showWarning('Please review your input');

// Info notification
showInfo('Your session will expire in 5 minutes');
```

## Error Types Supported

The system handles various error types:

### 1. AxiosError (API Errors)
- Extracts HTTP status codes
- Parses response data for error codes and messages
- Includes request/response context

### 2. JavaScript Errors
- Extracts error message and stack trace
- Includes error name and constructor information

### 3. String Errors
- Treats strings as error messages
- Assigns appropriate error codes

### 4. Object Errors
- Handles error objects with custom properties
- Extracts message, code, and context

## Development vs Production

The system behaves differently in development and production:

### Development Mode
- Shows all error details by default
- Displays stack traces
- Shows technical error information

### Production Mode
- Shows only user-friendly messages by default
- Hides technical details unless explicitly requested
- Only shows details for certain "safe" error types

## Best Practices

### 1. Use the useNotification Hook
```tsx
// ✅ Good
const { showError } = useNotification();
showError(error, 'Operation Failed');

// ❌ Avoid
setNotification({
  type: 'error',
  message: error.message
});
```

### 2. Provide Meaningful Titles
```tsx
// ✅ Good
showError(error, 'Failed to Save Profile');

// ❌ Avoid
showError(error, 'Error');
```

### 3. Handle Different Error Types Appropriately
```tsx
try {
  await apiCall();
} catch (error) {
  if (error.response?.status === 401) {
    showError(error, 'Session Expired');
    // Redirect to login
  } else if (error.response?.status === 422) {
    showError(error, 'Validation Error');
  } else {
    showError(error, 'Unexpected Error');
  }
}
```

### 4. Use Error Details for Debugging
```tsx
const handleError = (error) => {
  console.error('Detailed error:', extractErrorDetails(error));
  showError(error, 'Operation Failed');
};
```

## Migration Guide

To migrate existing error handling to the new system:

### Before
```tsx
const [notification, setNotification] = useState(null);

try {
  await apiCall();
} catch (error) {
  setNotification({
    type: 'error',
    message: error.message || 'An error occurred'
  });
}
```

### After
```tsx
const { notification, showError, clearNotification } = useNotification();

try {
  await apiCall();
} catch (error) {
  showError(error, 'Operation Failed');
}
```

## Configuration

### Environment Variables
- `import.meta.env.DEV` - Controls whether to show detailed error information
- Set to `true` in development, `false` in production

### Custom Error Codes
Add custom error codes to the `productionSafeCodes` array in `errorUtils.ts`:

```tsx
const productionSafeCodes = [
  'VALIDATION_ERROR',
  'BUSINESS_RULE_VIOLATION',
  'INVALID_INPUT',
  'CUSTOM_ERROR_CODE' // Add your custom codes here
];
```

## Troubleshooting

### Common Issues

1. **Error details not showing**
   - Check if `showErrorDetails` is true
   - Verify you're in development mode
   - Ensure error has extractable details

2. **Notification not appearing**
   - Check if `notification` state is properly set
   - Verify Notification component is rendered
   - Check for console errors

3. **Error formatting issues**
   - Use `extractErrorDetails()` to debug error structure
   - Check error type and properties
   - Verify error utilities are imported correctly

### Debug Mode

Enable debug logging by adding to your component:

```tsx
const handleError = (error) => {
  const details = extractErrorDetails(error);
  console.log('Error details:', details);
  showError(error, 'Debug Error');
};
``` 