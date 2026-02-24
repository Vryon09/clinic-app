import { ChevronDownIcon, Plus } from "lucide-react";
import { Button } from "../../shadcn/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../shadcn/field";
import { Input } from "../../shadcn/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn/popover";
import { Calendar } from "../../shadcn/calendar";

function AddPatient() {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setIsAdding(true)} className="cursor-pointer">
          <Plus /> <span>Add Patient</span>
        </Button>
      </div>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Patient</DialogTitle>
          </DialogHeader>

          <FieldSet className="w-full">
            <FieldGroup>
              <div className="grid grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                  <Input id="first-name" type="text" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="middle-name">Middle Name</FieldLabel>
                  <Input id="middle-name" type="text" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                  <Input id="last-name" type="text" />
                </Field>
              </div>

              <div className="grid grid-cols-2">
                <Field>
                  <FieldLabel>Birthday</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        //   data-empty={!date}
                        className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal"
                      >
                        {/* {date ? format(date, "PPP") : <span>Pick a date</span>} */}
                        <span>Pick a date</span>
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        //   selected={date}
                        //   onSelect={setDate}
                        //   defaultMonth={date}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <Input type="text" />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input id="address" type="text" placeholder="123 Main St" />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button className="cursor-pointer">Submit</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddPatient;
