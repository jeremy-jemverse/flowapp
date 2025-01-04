import { Alert } from './alert';

export function AlertDemo() {
  return (
    <div className="space-y-4 p-4 max-w-2xl mx-auto">
      {/* Standard Alerts */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-4">Standard Alerts</h3>
        <Alert variant="info">This is an informational message</Alert>
        <Alert variant="success">Operation completed successfully</Alert>
        <Alert variant="warning">Please review before proceeding</Alert>
        <Alert variant="error">An error occurred during the process</Alert>
      </div>

      {/* Alerts with close button */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-4">With close button</h3>
        <Alert variant="info" onClose={() => console.log('closed')}>
          This is a dismissible info message
        </Alert>
        <Alert variant="success" onClose={() => console.log('closed')}>
          This is a dismissible success message
        </Alert>
        <Alert variant="warning" onClose={() => console.log('closed')}>
          This is a dismissible warning message
        </Alert>
        <Alert variant="error" onClose={() => console.log('closed')}>
          This is a dismissible error message
        </Alert>
      </div>

      {/* Alerts with actions */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-4">With actions</h3>
        <Alert
          variant="info"
          primaryAction={{ label: 'Learn More', onClick: () => console.log('learn more') }}
        >
          New features are available. Click to learn more.
        </Alert>
        <Alert
          variant="success"
          primaryAction={{ label: 'View', onClick: () => console.log('view') }}
        >
          Your changes have been saved successfully.
        </Alert>
        <Alert
          variant="warning"
          primaryAction={{ label: 'Review', onClick: () => console.log('review') }}
        >
          Please review your changes before continuing.
        </Alert>
        <Alert
          variant="error"
          primaryAction={{ label: 'Try Again', onClick: () => console.log('retry') }}
        >
          Failed to save changes. Please try again.
        </Alert>
      </div>

      {/* Alerts with primary and secondary actions */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-4">With multiple actions</h3>
        <Alert
          variant="info"
          primaryAction={{ label: 'Accept', onClick: () => console.log('accept') }}
          secondaryAction={{ label: 'Cancel', onClick: () => console.log('cancel') }}
        >
          Would you like to enable notifications?
        </Alert>
        <Alert
          variant="warning"
          primaryAction={{ label: 'Save', onClick: () => console.log('save') }}
          secondaryAction={{ label: 'Discard', onClick: () => console.log('discard') }}
        >
          You have unsaved changes. Would you like to save them?
        </Alert>
      </div>

      {/* Rich content alerts */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-4">Rich content</h3>
        <Alert
          variant="info"
          primaryAction={{ label: 'Learn More', onClick: () => console.log('learn more') }}
          secondaryAction={{ label: 'Dismiss', onClick: () => console.log('dismiss') }}
        >
          <div className="space-y-2">
            <p className="font-medium">New Features Available</p>
            <p className="text-sm opacity-90">
              We've added several new features to help you be more productive. Click to learn more about
              these exciting updates and how they can benefit your workflow.
            </p>
          </div>
        </Alert>
      </div>
    </div>
  );
}