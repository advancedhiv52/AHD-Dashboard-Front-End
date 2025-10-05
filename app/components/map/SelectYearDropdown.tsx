import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import classNames from "classnames";
import { forwardRef } from "react";

const SelectDemo = ({
  options,
  dropdownLabel,
  placeholder,
  ariaLabel,
  currentValue,
  onChange,
}: {
  options: Array<string | number> | undefined;
  dropdownLabel: string;
  currentValue: string | number | undefined;
  placeholder: string;
  ariaLabel: string;
  onChange: (value: string | number) => void;
}) => {
  const isCurrentValueOrFirstOptionNumber =
    typeof currentValue === "number" || typeof options?.[0] === "number";

  return (
    <Select.Root
      value={
        currentValue as string
        // isCurrentValueOrFirstOptionNumber
        //   ? currentValue?.toString()
        //   : currentValue
      }
      onValueChange={(value) => {
        onChange(
          isCurrentValueOrFirstOptionNumber ? Number(value) : (value as string),
        );
      }}
    >
      <Select.Trigger
        className="text-violet hover:bg-mauve3 data-[placeholder]:text-violet9 inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none shadow-[0_2px_10px] shadow-black/10 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        aria-label={ariaLabel}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="text-violet">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
          <Select.ScrollUpButton className="text-violet flex h-[25px] cursor-default items-center justify-center bg-white">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[5px]">
            <Select.Group>
              <Select.Label className="text-mauve11 px-[25px] text-xs leading-[25px]">
                {dropdownLabel}
              </Select.Label>
              {(options ?? []).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </Select.Group>

            {/* <Select.Separator className="bg-violet6 m-[5px] h-px" />

          <Select.Group>
            <Select.Label className="text-mauve11 px-[25px] text-xs leading-[25px]">
              Vegetables
            </Select.Label>
            <SelectItem value="aubergine">Aubergine</SelectItem>
            <SelectItem value="broccoli">Broccoli</SelectItem>
            <SelectItem value="carrot" disabled>
              Carrot
            </SelectItem>
            <SelectItem value="courgette">Courgette</SelectItem>
            <SelectItem value="leek">Leek</SelectItem>
          </Select.Group> */}
          </Select.Viewport>
          <Select.ScrollDownButton className="text-violet flex h-[25px] cursor-default items-center justify-center bg-white">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<
  {
    children: React.ReactNode;
    className?: string;
    value: string | number;
  },
  any
>(({ children, className, ...props }, forwardedRef) => {
  //   const  = props;
  return (
    <Select.Item
      key={props.value}
      className={classNames(
        "text-violet data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

export default SelectDemo;
