import React from "react";
import {
  useCheckbox,
  CheckboxGroup,
  Chip,
  VisuallyHidden,
  tv,
} from "@heroui/react";
import { CheckIcon } from "@heroicons/react/24/solid";

export const CustomCheckbox = ({ value, children }) => {
  const checkbox = tv({
    name: "providedIDProofs",
    slots: {
      base: "border-secondary-400 hover:bg-default-200",
      content: "text-secondary-400 text-xs font-semibold",
    },
    variants: {
      isSelected: {
        true: {
          base: "border-secondary bg-secondary hover:bg-secondary-500 hover:border-secondary-500",
          content: "text-secondary-foreground pl-1",
        },
      },
      isFocusVisible: {
        true: {
          base: "outline-solid outline-transparent ring-2 ring-focus ring-offset-2 ring-offset-background",
        },
      },
    },
  });

  const {
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    value,
  });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        color="secondary"
        startContent={
          isSelected ? <CheckIcon className="w-5 text-white" /> : null
        }
        variant="bordered"
        {...getLabelProps()}
      >
        {children}
      </Chip>
    </label>
  );
};

export default function CheckBox({ formData }) {
  const [selectedProofs, setSelectedProofs] = React.useState(
    formData?.providedIDProofs || [],
  );
  return (
    <div>
      <p className="block mb-2 font-medium">Provided ID Proofs</p>
      <div className="flex flex-col gap-1 w-full p-5 mb-5 bg-secondary-100 rounded-xl">
        <CheckboxGroup
          className="gap-1"
          orientation="horizontal"
          value={selectedProofs}
          onValueChange={setSelectedProofs}
          name="providedIDProofs"
        >
          <CustomCheckbox value="aadhar">Aadhar Card</CustomCheckbox>
          <CustomCheckbox value="drivingLicense">
            Driving License
          </CustomCheckbox>
          <CustomCheckbox value="passport">Passport</CustomCheckbox>
          <CustomCheckbox value="companyId">Company ID Card</CustomCheckbox>
          <CustomCheckbox value="voterId">Voter ID</CustomCheckbox>
          <CustomCheckbox value="panCard">PAN Card</CustomCheckbox>
          <CustomCheckbox value="rationCard">Ration Card</CustomCheckbox>
          <CustomCheckbox value="governmentId">
            Government Employee ID
          </CustomCheckbox>
          <CustomCheckbox value="studentId">Student ID</CustomCheckbox>
          <CustomCheckbox value="militaryId">
            Military/Defence ID
          </CustomCheckbox>
          <CustomCheckbox value="workPermit">
            Work Permit / Labor Card
          </CustomCheckbox>
          <CustomCheckbox value="other">Other</CustomCheckbox>
        </CheckboxGroup>
      </div>
    </div>
  );
}
