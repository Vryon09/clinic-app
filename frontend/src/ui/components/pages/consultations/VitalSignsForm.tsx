import { Card } from "../../shadcn/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../shadcn/field";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";

function VitalSignsForm() {
  return (
    <Card className="w-full px-4 py-2">
      <p>Vital Signs</p>
      <form>
        <FieldSet>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-2">
              <Field>
                <FieldLabel>bloodPressureSystolic</FieldLabel>
                <Input type="text" />
              </Field>

              <Field>
                <FieldLabel>bloodPressureDiastolic</FieldLabel>
                <Input type="text" />
              </Field>

              <Field>
                <FieldLabel>temperature</FieldLabel>
                <Input type="text" />
              </Field>

              <Field>
                <FieldLabel>weightKg</FieldLabel>
                <Input type="text" />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Card>
  );
}

export default VitalSignsForm;
