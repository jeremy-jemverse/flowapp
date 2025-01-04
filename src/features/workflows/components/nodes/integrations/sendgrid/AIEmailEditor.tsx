import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AIEmailEditorProps {
  isOpen: boolean;
  onClose: () => void;
  emailData: {
    to: string;
    from: string;
    subject: string;
    body: string;
  };
  onSave: (body: string) => void;
}

export function AIEmailEditor({ isOpen, onClose, emailData, onSave }: AIEmailEditorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] sm:h-[80vh]">
        <DialogHeader>
          <DialogTitle>AI Email Editor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 flex-1 overflow-hidden">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input value={emailData.from} disabled />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input value={emailData.to} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input value={emailData.subject} disabled />
          </div>
          <div className="space-y-2 flex-1">
            <Label>Body</Label>
            <div className="h-[calc(100vh-22rem)]">
              <Textarea
                value={emailData.body}
                onChange={(e) => onSave(e.target.value)}
                placeholder="Write your email content here..."
                className="h-full resize-none"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
