import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TemplateField } from "@/data/templateSchemas";

interface DynamicFormProps {
  fields: TemplateField[];
  values: Record<string, string>;
  onChange: (fieldLabel: string, value: string) => void;
}

export function DynamicForm({ fields, values, onChange }: DynamicFormProps) {
  const renderField = (field: TemplateField) => {
    const fieldId = field.label.toLowerCase().replace(/\s+/g, '-');
    
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={fieldId}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="min-h-[100px]"
            value={values[field.label] || ""}
            onChange={(e) => onChange(field.label, e.target.value)}
            required={field.required}
          />
        );
      
      case "date":
        return (
          <Input
            id={fieldId}
            type="date"
            value={values[field.label] || ""}
            onChange={(e) => onChange(field.label, e.target.value)}
            required={field.required}
          />
        );
      
      case "file":
        return (
          <Input
            id={fieldId}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange(field.label, file.name);
            }}
            required={field.required}
          />
        );
      
      default:
        return (
          <Input
            id={fieldId}
            type="text"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={values[field.label] || ""}
            onChange={(e) => onChange(field.label, e.target.value)}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={index} className="space-y-2">
          <Label htmlFor={field.label.toLowerCase().replace(/\s+/g, '-')}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}
