import { Alert } from "@/components/ui/alert";

export function AlertDemo() {
  return (
    <div className="space-y-4 p-4 max-w-2xl mx-auto">
      {/* Standard Alerts */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-4">Standard Alerts</h3>
        <Alert variant="info">I am an info message</Alert>
        <Alert variant="success">I am a success message</Alert>
        <Alert variant="warning">I am a warning message</Alert>
        <Alert variant="error">I am an error message</Alert>
        <Alert>I am a message</Alert>
      </div>

      {/* Alerts with close button */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-4">With close button</h3>
        <Alert variant="info" onClose={() => console.log("closed")}>
          I am an info message
        </Alert>
        <Alert variant="success" onClose={() => console.log("closed")}>
          I am a success message
        </Alert>
        <Alert variant="warning" onClose={() => console.log("closed")}>
          I am a warning message
        </Alert>
        <Alert variant="error" onClose={() => console.log("closed")}>
          I am an error message
        </Alert>
      </div>

      {/* Alerts with actions */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-4">With actions</h3>
        <Alert
          variant="info"
          primaryAction={{ label: "Accept", onClick: () => console.log("accepted") }}
        >
          I am an info with an action
        </Alert>
        <Alert
          variant="success"
          primaryAction={{ label: "Accept", onClick: () => console.log("accepted") }}
        >
          I am a success with an action
        </Alert>
        <Alert
          variant="warning"
          primaryAction={{ label: "Undo", onClick: () => console.log("undo") }}
        >
          I am a warning with an action
        </Alert>
        <Alert
          variant="error"
          primaryAction={{ label: "Undo", onClick: () => console.log("undo") }}
        >
          I am an error with an action
        </Alert>
      </div>

      {/* Alerts with primary and secondary actions */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-4">With primary and secondary actions</h3>
        <Alert
          variant="info"
          primaryAction={{ label: "Accept", onClick: () => console.log("accepted") }}
          secondaryAction={{ label: "Deny", onClick: () => console.log("denied") }}
        >
          I am an info with an action
        </Alert>
        <Alert
          variant="success"
          primaryAction={{ label: "Accept", onClick: () => console.log("accepted") }}
          secondaryAction={{ label: "Deny", onClick: () => console.log("denied") }}
        >
          I am a success with an action
        </Alert>
        <Alert
          variant="warning"
          primaryAction={{ label: "Accept", onClick: () => console.log("accepted") }}
          secondaryAction={{ label: "Deny", onClick: () => console.log("denied") }}
        >
          I am a warning with an action
        </Alert>
        <Alert
          variant="error"
          primaryAction={{ label: "Accept", onClick: () => console.log("accepted") }}
          secondaryAction={{ label: "Deny", onClick: () => console.log("denied") }}
        >
          I am an error with an action
        </Alert>
      </div>

      {/* Heavy information alert */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-4">Heavy information</h3>
        <Alert
          variant="info"
          primaryAction={{ label: "Accept", onClick: () => console.log("accepted") }}
          secondaryAction={{ label: "Deny", onClick: () => console.log("denied") }}
        >
          <div className="space-y-2">
            <p className="font-medium">Endive grape groundnut horseradish</p>
            <p className="text-sm opacity-90">
              Artichoke aubergine avocado bell bitterleaf broccoli brussels burdock chickweed chicory
              collard cucumber desert earthnut
            </p>
          </div>
        </Alert>
      </div>
    </div>
  );
}